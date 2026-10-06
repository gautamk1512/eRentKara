"""Reviewed partner applications and one-use account activation."""
import logging
from urllib.parse import urlencode
from django.conf import settings
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth.tokens import default_token_generator
from django.core.exceptions import ValidationError
from django.core.mail import send_mail
from django.db import transaction
from django.utils import timezone
from rest_framework import generics, permissions, serializers
from rest_framework.response import Response
from rest_framework.throttling import AnonRateThrottle
from rest_framework.views import APIView
from .models import PartnerApplication, ContactRequest, User, UserProfile

logger = logging.getLogger(__name__)


class PublicFormThrottle(AnonRateThrottle):
    rate = "10/hour"


class PartnerApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = PartnerApplication
        fields = ["full_name", "email", "phone", "business_name", "city", "state", "profession", "registration_number", "address", "experience", "consent"]
        extra_kwargs = {"consent": {"required": True}}

    def validate_consent(self, value):
        if not value:
            raise serializers.ValidationError("Please confirm that we may review and contact you about your application.")
        return value

    def validate_email(self, value):
        value = value.strip().lower()
        if PartnerApplication.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("An application already exists. Contact support for its status.")
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("This email has an account. Contact support before applying as a partner.")
        return value

    def validate_phone(self, value):
        digits = "".join(c for c in value if c.isdigit())
        if not 10 <= len(digits) <= 15:
            raise serializers.ValidationError("Enter a valid phone number with 10–15 digits.")
        return value


class PartnerApplicationView(generics.CreateAPIView):
    serializer_class = PartnerApplicationSerializer
    permission_classes = [permissions.AllowAny]
    authentication_classes = []
    throttle_classes = [PublicFormThrottle]


class ContactRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactRequest
        fields = ["name", "email", "phone", "product", "subject", "message"]


class ContactRequestView(generics.CreateAPIView):
    serializer_class = ContactRequestSerializer
    permission_classes = [permissions.AllowAny]
    authentication_classes = []
    throttle_classes = [PublicFormThrottle]


def send_partner_invitation(application):
    """Persist delivery outcome so admins can explicitly retry failed email."""
    user = application.user
    if application.status != "APPROVED" or not user or application.activated_at:
        raise ValidationError("Only an approved, unactivated application can receive an invitation.")
    query = urlencode({"application": str(application.pk), "token": default_token_generator.make_token(user)})
    url = f"{settings.FRONTEND_URL.rstrip('/')}/partner/activate?{query}"
    try:
        count = send_mail(
            "Your eRentKarar partner application is approved",
            f"Hello {application.full_name},\n\nYour partner application for {application.city} has been approved.\n"
            f"Partner ID: {application.partner_id}\nLogin email: {user.email}\n\n"
            f"Create your password using this one-use link (valid for 24 hours):\n{url}\n\n"
            f"After activation, sign in at {settings.FRONTEND_URL.rstrip('/')}/partner/login.\n"
            "Your Partner Dashboard contains only the agreements assigned to you.\n\neRentKarar team",
            settings.DEFAULT_FROM_EMAIL, [user.email], fail_silently=False,
        )
        if count != 1:
            raise RuntimeError("Email backend did not accept the message")
    except Exception:
        logger.exception("Partner invitation delivery failed for application %s", application.pk)
        application.invitation_error = "Email delivery failed. Check email configuration, then use Resend invitation."
        application.save(update_fields=["invitation_error"])
        return False
    application.invitation_sent_at = timezone.now()
    application.invitation_error = ""
    application.save(update_fields=["invitation_sent_at", "invitation_error"])
    return True


def approve_partner(application_id, reviewer):
    with transaction.atomic():
        application = PartnerApplication.objects.select_for_update().get(pk=application_id)
        if application.status != "PENDING":
            raise ValidationError("Only pending applications can be approved.")
        if User.objects.filter(email__iexact=application.email).exists():
            raise ValidationError("An account already uses this email. Review it separately; its role was not changed.")
        names = application.full_name.split(maxsplit=1)
        user = User.objects.create_user(email=application.email, role="LEGAL_PARTNER", is_active=False,
                                        first_name=names[0], last_name=names[1] if len(names) > 1 else "")
        UserProfile.objects.create(user=user, full_name=application.full_name, preferred_city=application.city)
        application.user = user
        application.status = "APPROVED"
        application.reviewed_by = reviewer
        application.reviewed_at = timezone.now()
        application.save()
    return send_partner_invitation(application)


class ActivatePartnerView(APIView):
    permission_classes = [permissions.AllowAny]
    authentication_classes = []
    throttle_classes = [PublicFormThrottle]

    def post(self, request):
        with transaction.atomic():
            try:
                application = PartnerApplication.objects.select_for_update().get(pk=request.data.get("application"), status="APPROVED")
            except (PartnerApplication.DoesNotExist, ValidationError, ValueError, TypeError):
                return Response({"detail": "Invalid or expired invitation. Please contact support."}, status=400)
            user = application.user
            token = request.data.get("token")
            if not user or application.activated_at or not isinstance(token, str) or not default_token_generator.check_token(user, token):
                return Response({"detail": "Invalid or expired invitation. Please contact support for a new link."}, status=400)
            password = request.data.get("password")
            if not isinstance(password, str) or len(password) < 10 or len(password) > 128:
                return Response({"detail": "Choose a password between 10 and 128 characters."}, status=400)
            try:
                validate_password(password, user)
            except ValidationError as error:
                return Response({"detail": " ".join(error.messages)}, status=400)
            user.set_password(password)
            user.is_active = True
            user.is_verified = True
            user.save(update_fields=["password", "is_active", "is_verified"])
            application.activated_at = timezone.now()
            application.save(update_fields=["activated_at"])
        return Response({"success": True, "email": user.email, "partner_id": application.partner_id})
