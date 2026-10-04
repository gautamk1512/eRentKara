import uuid
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from apps.referrals.models import ReferralCode, Referral, ReferralReward
from apps.referrals.serializers import ReferralCodeSerializer

class MyReferralView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        ref_code, created = ReferralCode.objects.get_or_create(
            user=request.user,
            defaults={"code": f"ERK-{request.user.email.split('@')[0][:6].upper()}-{uuid.uuid4().hex[:4].upper()}"}
        )
        return Response({"success": True, "data": ReferralCodeSerializer(ref_code).data})

class TrackReferralClickView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        code = request.data.get("code")
        if code:
            ref = ReferralCode.objects.filter(code__iexact=code).first()
            if ref:
                ref.total_clicks += 1
                ref.save()
                return Response({"success": True, "message": "Click recorded."})
        return Response({"success": False, "message": "Invalid code"}, status=status.HTTP_404_NOT_FOUND)
