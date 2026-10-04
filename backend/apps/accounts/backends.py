from django.contrib.auth.backends import ModelBackend
from django.contrib.auth import get_user_model
from django.db.models import Q

class EmailOrUsernameModelBackend(ModelBackend):
    """
    Allows authentication using email, username ('admin'), or phone number.
    """
    def authenticate(self, request, username=None, password=None, **kwargs):
        UserModel = get_user_model()
        if username is None:
            username = kwargs.get(UserModel.USERNAME_FIELD)
        
        if not username:
            return None

        # Clean input
        identifier = str(username).strip()

        # Try to find user by email, phone_number, or 'admin' fallback
        try:
            if identifier.lower() == "admin":
                user = UserModel.objects.filter(Q(email="admin@erentkarar.com") | Q(email="admin@admin.com") | Q(is_superuser=True)).first()
            else:
                user = UserModel.objects.filter(
                    Q(email__iexact=identifier) | Q(phone_number=identifier)
                ).first()
        except Exception:
            return None

        if user and user.check_password(password) and self.user_can_authenticate(user):
            return user
        return None
