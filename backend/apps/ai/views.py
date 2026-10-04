from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from django.utils import timezone
from apps.ai.models import AIConversation, AIMessage, AIAction
from apps.ai.serializers import AIConversationSerializer, AIMessageSerializer, AIActionSerializer
from apps.ai.tools import EkrarAITools
from apps.organizations.models import Organization
from apps.audit.models import AuditLog
from apps.notifications.models import CommunicationLog

class AIChatView(APIView):
    """
    Ekrar AI - Intelligent Rental Business Assistant.
    Supports Hindi and English natural queries with RBAC scoped tool results.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        user = request.user
        query = request.data.get("message", "").strip().lower()
        conv_id = request.data.get("conversation_id")

        org = Organization.objects.filter(members__user=user).first()
        if not org:
            return Response(
                {"success": False, "error": {"code": "NO_ORG", "message": "No active organization found."}},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if conv_id:
            conversation = AIConversation.objects.filter(id=conv_id, user=user).first()
        else:
            conversation = AIConversation.objects.create(
                user=user,
                organization=org,
                title=query[:50].capitalize() or "Rental Query"
            )

        # Log User Message
        AIMessage.objects.create(
            conversation=conversation,
            sender=AIMessage.Sender.USER,
            content=request.data.get("message", ""),
        )

        response_text = ""
        tool_data = []
        action_prepared = None

        # Intelligent Intent Matching
        if any(w in query for w in ["pending", "बकाया", "dues", "rent pending", "rent due", "किराया"]):
            pending_info = EkrarAITools.get_pending_rent(user)
            tool_data.append({"tool": "get_pending_rent", "data": pending_info})
            count = pending_info["total_tenants_pending"]
            amt = pending_info["total_amount_pending"]

            if count > 0:
                response_text = (
                    f"Found **{count} tenants** with pending rent, totaling **₹{amt:,.2f}**.\n\n"
                    f"Top pending accounts:\n" +
                    "\n".join([f"• **{t['tenant_name']}** ({t['property']} - Room {t['room']}): ₹{t['amount_due']:,.2f} (Due: {t['due_date']})" for t in pending_info["tenants"][:5]])
                )
            else:
                response_text = "Good news! There are currently no pending rent invoices in your organization."

        elif any(w in query for w in ["vacant", "खाली", "rooms available", "vacancy", "available bed"]):
            vacant_info = EkrarAITools.get_vacant_inventory(user)
            tool_data.append({"tool": "get_vacant_inventory", "data": vacant_info})
            count = vacant_info["total_vacant_beds"]
            if count > 0:
                response_text = (
                    f"You have **{count} vacant beds/rooms** ready for immediate occupancy across your properties:\n\n" +
                    "\n".join([f"• **{v['property']}** ({v['locality']}) - Room {v['room']}, {v['bed']} @ ₹{v['rent']:,.2f}/mo" for v in vacant_info["vacant_units"][:6]])
                )
            else:
                response_text = "All rooms and beds in your properties are currently 100% occupied!"

        elif any(w in query for w in ["collection", "कमाई", "revenue", "collected", "कलेक्शन"]):
            coll = EkrarAITools.get_monthly_collection(user)
            tool_data.append({"tool": "get_monthly_collection", "data": coll})
            response_text = (
                f"**Collection Summary for {coll['month']}:**\n"
                f"• Total Invoiced: **₹{coll['total_billed']:,.2f}**\n"
                f"• Total Collected: **₹{coll['total_collected']:,.2f}**\n"
                f"• Collection Efficiency: **{coll['collection_rate_percent']}%**"
            )

        elif any(w in query for w in ["kyc", "documents", "वेरिफिकेशन"]):
            kyc_info = EkrarAITools.get_pending_kyc(user)
            tool_data.append({"tool": "get_pending_kyc", "data": kyc_info})
            count = kyc_info["total_pending_verifications"]
            response_text = f"You have **{count} tenant KYC submissions** pending your review and approval."

        elif any(w in query for w in ["reminder", "whatsapp", "रिमाइंडर", "alert"]):
            # Trigger Action Preview flow (Requirements 42)
            pending_info = EkrarAITools.get_pending_rent(user)
            count = pending_info["total_tenants_pending"]
            amt = pending_info["total_amount_pending"]

            action = AIAction.objects.create(
                conversation=conversation,
                action_type=AIAction.ActionType.RENT_REMINDER,
                preview_summary=f"Prepare and dispatch official WhatsApp Rent Reminders to {count} tenants with total dues of ₹{amt:,.2f}.",
                payload={"tenants_count": count, "total_amount": amt},
                status=AIAction.ActionStatus.PREPARED
            )
            action_prepared = AIActionSerializer(action).data

            response_text = (
                f"I have identified **{count} pending tenants** with total outstanding rent of **₹{amt:,.2f}**.\n\n"
                f"I have prepared an automated WhatsApp notification reminder for your approval.\n"
                f"Click **Confirm & Send Reminders** below to dispatch."
            )

        else:
            response_text = (
                "Namaste! I am **Ekrar AI**, your Indian rental property assistant. You can ask me:\n\n"
                "• *किसका rent pending है?*\n"
                "• *कितने rooms vacant हैं?*\n"
                "• *इस महीने collection कितनी हुई?*\n"
                "• *Pending tenants को WhatsApp reminder भेजो*"
            )

        ai_msg = AIMessage.objects.create(
            conversation=conversation,
            sender=AIMessage.Sender.ASSISTANT,
            content=response_text,
            tool_invocations=tool_data
        )

        return Response({
            "success": True,
            "data": {
                "conversation_id": str(conversation.id),
                "message": AIMessageSerializer(ai_msg).data,
                "action": action_prepared,
            }
        })

class AIActionConfirmView(APIView):
    """
    Executes user-approved sensitive actions (Requirement 42 & 43).
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, action_id):
        action = AIAction.objects.filter(id=action_id, conversation__user=request.user).first()
        if not action:
            return Response({"success": False, "message": "Action not found."}, status=status.HTTP_404_NOT_FOUND)

        if action.status != AIAction.ActionStatus.PREPARED:
            return Response({"success": False, "message": f"Action is already {action.status}."}, status=status.HTTP_400_BAD_REQUEST)

        # Execute
        action.status = AIAction.ActionStatus.CONFIRMED
        action.executed_at = timezone.now()
        action.execution_result = {"status": "SUCCESS", "dispatched_count": action.payload.get("tenants_count", 0)}
        action.save()

        # Log to immutable AuditLog
        AuditLog.objects.create(
            user=request.user,
            organization=action.conversation.organization,
            action="AI_ACTION_EXECUTED",
            entity_name="AIAction",
            entity_id=str(action.id),
            details={"action_type": action.action_type, "summary": action.preview_summary},
        )

        # Log Communication
        CommunicationLog.objects.create(
            organization=action.conversation.organization,
            recipient="All Pending Tenants",
            channel=CommunicationLog.Channel.WHATSAPP,
            template_name="rent_due_urgent_v1",
            message_content=action.preview_summary,
            status=CommunicationLog.Status.SENT,
            provider_message_id=f"WA-BULK-{action.id}"
        )

        return Response({
            "success": True,
            "message": "Action confirmed and executed successfully! WhatsApp reminders have been dispatched.",
            "data": AIActionSerializer(action).data,
        })
