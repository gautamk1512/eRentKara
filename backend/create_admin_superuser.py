import os
import sys
import django

if sys.stdout.encoding != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8')

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'erentkarar.settings')
django.setup()

from django.contrib.auth import get_user_model, authenticate
User = get_user_model()

# Create or update admin@erentkarar.com
for email in ["admin@erentkarar.com", "admin@admin.com"]:
    user, created = User.objects.get_or_create(
        email=email,
        defaults={
            "first_name": "System",
            "last_name": "Admin",
            "is_staff": True,
            "is_superuser": True,
            "role": User.RoleChoices.SUPER_ADMIN,
            "is_verified": True,
            "is_active": True,
        }
    )
    user.set_password("admin")
    user.is_staff = True
    user.is_superuser = True
    user.role = User.RoleChoices.SUPER_ADMIN
    user.is_active = True
    user.is_verified = True
    user.save()
    print(f"User {email} configured with password 'admin' (is_superuser={user.is_superuser}, is_staff={user.is_staff})")

# Test authentication with 'admin' / 'admin'
auth_user_1 = authenticate(username="admin", password="admin")
print("Auth test with username='admin' & password='admin':", "SUCCESS ✅" if auth_user_1 else "FAILED ❌")

auth_user_2 = authenticate(username="admin@erentkarar.com", password="admin")
print("Auth test with username='admin@erentkarar.com' & password='admin':", "SUCCESS ✅" if auth_user_2 else "FAILED ❌")

auth_user_3 = authenticate(username="admin@admin.com", password="admin")
print("Auth test with username='admin@admin.com' & password='admin':", "SUCCESS ✅" if auth_user_3 else "FAILED ❌")
