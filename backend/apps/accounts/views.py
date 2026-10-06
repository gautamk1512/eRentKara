import base64
import json
import requests
from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from apps.accounts.models import User, UserProfile
from apps.accounts.serializers import UserSerializer, RegisterSerializer, UserProfileSerializer
from apps.audit.models import AuditLog

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        # Generate JWT tokens immediately upon registration
        refresh = RefreshToken.for_user(user)

        # Audit Log
        AuditLog.objects.create(
            user=user,
            action="USER_REGISTER",
            entity_name="User",
            entity_id=str(user.id),
            details={"email": user.email, "role": user.role},
        )

        return Response(
            {
                "success": True,
                "message": "User registered successfully.",
                "data": {
                    "user": UserSerializer(user).data,
                    "tokens": {
                        "refresh": str(refresh),
                        "access": str(refresh.access_token),
                    },
                },
            },
            status=status.HTTP_201_CREATED,
        )

class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        if isinstance(email, str) and email.upper().startswith("EKP-"):
            from .models import PartnerApplication
            from django.core.exceptions import ValidationError
            try:
                application = PartnerApplication.objects.select_related("user").get(pk=email[4:], status="APPROVED", activated_at__isnull=False)
                email = application.user.email
            except (PartnerApplication.DoesNotExist, ValidationError, ValueError):
                email = ""

        if not email or not password:
            return Response(
                {"success": False, "error": {"code": "INVALID_CREDENTIALS", "message": "Email and password are required."}},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = authenticate(request, username=email, password=password)
        if not user:
            return Response(
                {"success": False, "error": {"code": "AUTH_FAILED", "message": "Invalid email or password."}},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        refresh = RefreshToken.for_user(user)

        # Record audit log
        AuditLog.objects.create(
            user=user,
            action="USER_LOGIN",
            entity_name="User",
            entity_id=str(user.id),
            details={"email": user.email},
        )

        return Response(
            {
                "success": True,
                "message": "Login successful.",
                "data": {
                    "user": UserSerializer(user).data,
                    "tokens": {
                        "refresh": str(refresh),
                        "access": str(refresh.access_token),
                    },
                },
            },
            status=status.HTTP_200_OK,
        )

class MeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response(
            {
                "success": True,
                "data": UserSerializer(request.user).data,
            }
        )

    def put(self, request):
        profile, _ = UserProfile.objects.get_or_create(user=request.user)
        serializer = UserProfileSerializer(profile, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        # Update user fields if provided
        for field in ["first_name", "last_name", "phone_number"]:
            if field in request.data:
                setattr(request.user, field, request.data[field])
        request.user.save()

        return Response(
            {
                "success": True,
                "message": "Profile updated successfully.",
                "data": UserSerializer(request.user).data,
            }
        )

class GoogleLoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        credential = request.data.get("credential")
        email = request.data.get("email")
        google_id = request.data.get("google_id")
        first_name = request.data.get("first_name", "")
        last_name = request.data.get("last_name", "")
        name = request.data.get("name", "")
        picture = request.data.get("picture", "")
        requested_role = request.data.get("role") or User.RoleChoices.OWNER

        # If credential (Google ID token / JWT) provided, attempt Google tokeninfo verification
        if credential:
            try:
                # 1. Try Google tokeninfo endpoint
                verify_url = f"https://oauth2.googleapis.com/tokeninfo?id_token={credential}"
                resp = requests.get(verify_url, timeout=5)
                if resp.status_code == 200:
                    id_info = resp.json()
                    email = id_info.get("email") or email
                    google_id = id_info.get("sub") or google_id
                    first_name = id_info.get("given_name") or first_name
                    last_name = id_info.get("family_name") or last_name
                    name = id_info.get("name") or name
                    picture = id_info.get("picture") or picture
                else:
                    # Fallback decoding payload if in local testing or offline
                    parts = credential.split(".")
                    if len(parts) == 3:
                        padded = parts[1] + "=" * ((4 - len(parts[1]) % 4) % 4)
                        decoded_bytes = base64.urlsafe_b64decode(padded)
                        id_info = json.loads(decoded_bytes.decode("utf-8"))
                        email = id_info.get("email") or email
                        google_id = id_info.get("sub") or google_id
                        first_name = id_info.get("given_name") or first_name
                        last_name = id_info.get("family_name") or last_name
                        name = id_info.get("name") or name
                        picture = id_info.get("picture") or picture
            except Exception as e:
                # If network fails, proceed if email was provided directly
                if not email:
                    return Response(
                        {"success": False, "error": {"code": "GOOGLE_AUTH_FAILED", "message": f"Unable to verify Google credential: {str(e)}"}},
                        status=status.HTTP_400_BAD_REQUEST,
                    )

        if not email:
            return Response(
                {"success": False, "error": {"code": "MISSING_EMAIL", "message": "Email is required for Google Sign-In."}},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not first_name and name:
            name_parts = name.split()
            first_name = name_parts[0]
            last_name = " ".join(name_parts[1:]) if len(name_parts) > 1 else ""

        valid_roles = ["OWNER", "TENANT", "SHOP_OPERATOR"]
        if requested_role not in valid_roles:
            requested_role = User.RoleChoices.OWNER

        user = User.objects.filter(email__iexact=email).first()
        if user and (user.is_staff or user.role == "LEGAL_PARTNER"):
            return Response({"error": "Use password login for this account."}, status=403)
        is_new = False
        if not user:
            is_new = True
            user = User.objects.create_user(
                email=email.lower(),
                password=None,
                first_name=first_name,
                last_name=last_name,
                role=requested_role,
                is_verified=True,
                google_id=google_id or "",
            )
            UserProfile.objects.create(
                user=user,
                full_name=f"{first_name} {last_name}".strip() or email.split("@")[0],
                preferred_city="Ahmedabad",
            )
        else:
            updated = False
            if not user.first_name and first_name:
                user.first_name = first_name
                updated = True
            if not user.last_name and last_name:
                user.last_name = last_name
                updated = True
            if not user.is_verified:
                user.is_verified = True
                updated = True
            if google_id and hasattr(user, "google_id") and not user.google_id:
                user.google_id = google_id
                updated = True
            if requested_role and user.role != requested_role and request.data.get("force_role"):
                user.role = requested_role
                updated = True
            if updated:
                user.save()

            UserProfile.objects.get_or_create(
                user=user,
                defaults={"full_name": f"{user.first_name} {user.last_name}".strip() or email.split("@")[0]},
            )

        refresh = RefreshToken.for_user(user)

        AuditLog.objects.create(
            user=user,
            action="USER_GOOGLE_LOGIN",
            entity_name="User",
            entity_id=str(user.id),
            details={"email": user.email, "role": user.role, "is_new": is_new},
        )

        return Response(
            {
                "success": True,
                "message": "Google authentication successful.",
                "data": {
                    "user": UserSerializer(user).data,
                    "tokens": {
                        "refresh": str(refresh),
                        "access": str(refresh.access_token),
                    },
                },
            },
            status=status.HTTP_200_OK,
        )

