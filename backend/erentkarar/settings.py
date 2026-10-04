"""
Django settings for erentkarar project.
Production-grade configuration with multi-tenancy, JWT auth, and India-first localization.
"""

import os
from pathlib import Path
from datetime import timedelta
from dotenv import load_dotenv

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# Load environment variables from .env if present
load_dotenv(BASE_DIR.parent / ".env")

SECRET_KEY = os.getenv("SECRET_KEY", "django-insecure-3u#fq7n8uyo5@3zrx)(_r^jji0$0a_ebm6!n+@)#de=^4jmkso-erentkarar")

DEBUG = os.getenv("DEBUG", "True").lower() in ("true", "1", "yes")

ALLOWED_HOSTS = [host.strip() for host in os.getenv("ALLOWED_HOSTS", "localhost,127.0.0.1,testserver,*").split(",") if host.strip()]

# Application definition
DJANGO_APPS = [
    "unfold",
    "unfold.contrib.filters",
    "unfold.contrib.forms",
    "unfold.contrib.inlines",
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
]

THIRD_PARTY_APPS = [
    "rest_framework",
    "rest_framework_simplejwt",
    "corsheaders",
    "django_filters",
]

LOCAL_APPS = [
    "apps.accounts",
    "apps.organizations",
    "apps.properties",
    "apps.marketplace",
    "apps.tenants",
    "apps.leads",
    "apps.bookings",
    "apps.kyc",
    "apps.agreements",
    "apps.billing",
    "apps.payments",
    "apps.deposits",
    "apps.complaints",
    "apps.visitors",
    "apps.mess",
    "apps.staff",
    "apps.notifications",
    "apps.reports",
    "apps.referrals",
    "apps.subscriptions",
    "apps.ai",
    "apps.audit",
]

INSTALLED_APPS = DJANGO_APPS + THIRD_PARTY_APPS + LOCAL_APPS

# Modern Unfold Admin Dashboard Configuration
UNFOLD = {
    "SITE_TITLE": "eRentKarar Admin OS",
    "SITE_HEADER": "eRentKarar",
    "SITE_SUBHEADER": "India's Smart Rental Management & Legal Agreement Platform",
    "SITE_URL": "/",
    "SITE_SYMBOL": "home_work",
    "SHOW_HISTORY": True,
    "SHOW_VIEW_ON_SITE": True,
    "THEME": "auto",
    "COLORS": {
        "primary": {
            "50": "239 246 255",
            "100": "219 234 254",
            "200": "191 219 254",
            "300": "147 197 253",
            "400": "96 165 250",
            "500": "0 113 227",
            "600": "0 102 204",
            "700": "0 86 179",
            "800": "30 58 138",
            "900": "23 37 84",
            "950": "15 23 42",
        },
    },
    "SIDEBAR": {
        "show_search": True,
        "show_all_applications": True,
        "navigation": [
            {
                "title": "Rental & Property Management",
                "separator": True,
                "collapsible": True,
                "items": [
                    {
                        "title": "Properties & Units",
                        "icon": "apartment",
                        "link": "/admin/properties/property/",
                    },
                    {
                        "title": "Rooms",
                        "icon": "meeting_room",
                        "link": "/admin/properties/room/",
                    },
                    {
                        "title": "Beds & Occupancy",
                        "icon": "single_bed",
                        "link": "/admin/properties/bed/",
                    },
                    {
                        "title": "Tenancies & Stays",
                        "icon": "group",
                        "link": "/admin/tenants/tenancy/",
                    },
                    {
                        "title": "Move-In Checklists",
                        "icon": "fact_check",
                        "link": "/admin/tenants/movein/",
                    },
                    {
                        "title": "Move-Out Inspections",
                        "icon": "door_open",
                        "link": "/admin/tenants/moveout/",
                    },
                ],
            },
            {
                "title": "Rent Billing & Financials",
                "separator": True,
                "collapsible": True,
                "items": [
                    {
                        "title": "Rent Invoices",
                        "icon": "receipt_long",
                        "link": "/admin/billing/invoice/",
                    },
                    {
                        "title": "Payments & Receipts",
                        "icon": "payments",
                        "link": "/admin/payments/payment/",
                    },
                    {
                        "title": "Security Deposits",
                        "icon": "account_balance",
                        "link": "/admin/deposits/securitydeposit/",
                    },
                    {
                        "title": "Electricity Meter Readings",
                        "icon": "electric_meter",
                        "link": "/admin/billing/electricityreading/",
                    },
                ],
            },
            {
                "title": "Legal Agreements & Stamping",
                "separator": True,
                "collapsible": True,
                "items": [
                    {
                        "title": "Rent Agreements",
                        "icon": "description",
                        "link": "/admin/agreements/agreement/",
                    },
                    {
                        "title": "Agreement Clauses",
                        "icon": "gavel",
                        "link": "/admin/agreements/agreementclause/",
                    },
                    {
                        "title": "E-Seva Kendra Shops",
                        "icon": "storefront",
                        "link": "/admin/agreements/shop/",
                    },
                    {
                        "title": "State Stamp Duty Rules",
                        "icon": "rule",
                        "link": "/admin/agreements/legalrule/",
                    },
                ],
            },
            {
                "title": "Operations & Facilities",
                "separator": True,
                "collapsible": True,
                "items": [
                    {
                        "title": "Complaints & Maintenance",
                        "icon": "build",
                        "link": "/admin/complaints/complaint/",
                    },
                    {
                        "title": "Visitor Gate Pass",
                        "icon": "shield",
                        "link": "/admin/visitors/visitor/",
                    },
                    {
                        "title": "Mess Food Plans",
                        "icon": "restaurant",
                        "link": "/admin/mess/messplan/",
                    },
                    {
                        "title": "Staff & Shifts",
                        "icon": "badge",
                        "link": "/admin/staff/staff/",
                    },
                ],
            },
            {
                "title": "CRM Leads & Growth",
                "separator": True,
                "collapsible": True,
                "items": [
                    {
                        "title": "Marketplace Leads",
                        "icon": "contact_phone",
                        "link": "/admin/leads/lead/",
                    },
                    {
                        "title": "Bookings & Tokens",
                        "icon": "event_available",
                        "link": "/admin/bookings/booking/",
                    },
                    {
                        "title": "Aadhaar / PAN KYC",
                        "icon": "fingerprint",
                        "link": "/admin/kyc/kyc/",
                    },
                    {
                        "title": "SaaS Subscriptions",
                        "icon": "workspace_premium",
                        "link": "/admin/subscriptions/organizationsubscription/",
                    },
                    {
                        "title": "Referrals & Rewards",
                        "icon": "card_giftcard",
                        "link": "/admin/referrals/referral/",
                    },
                ],
            },
            {
                "title": "System, AI & Security",
                "separator": True,
                "collapsible": True,
                "items": [
                    {
                        "title": "User Accounts",
                        "icon": "manage_accounts",
                        "link": "/admin/accounts/user/",
                    },
                    {
                        "title": "Organizations",
                        "icon": "domain",
                        "link": "/admin/organizations/organization/",
                    },
                    {
                        "title": "Ekrar AI Assistant",
                        "icon": "smart_toy",
                        "link": "/admin/ai/aiconversation/",
                    },
                    {
                        "title": "Immutable Audit Logs",
                        "icon": "verified_user",
                        "link": "/admin/audit/auditlog/",
                    },
                ],
            },
        ],
    },
}

AUTH_USER_MODEL = "accounts.User"

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "erentkarar.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR / "templates"],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "erentkarar.wsgi.application"

# Database
# Support DATABASE_URL if configured, fallback to sqlite3 for local portability
DATABASE_URL = os.getenv("DATABASE_URL")
if DATABASE_URL and DATABASE_URL.startswith("postgres"):
    import urllib.parse as urlparse
    url = urlparse.urlparse(DATABASE_URL)
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.postgresql",
            "NAME": url.path[1:],
            "USER": url.username,
            "PASSWORD": url.password,
            "HOST": url.hostname,
            "PORT": url.port or 5432,
        }
    }
else:
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.sqlite3",
            "NAME": BASE_DIR / "db.sqlite3",
        }
    }

# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator", "OPTIONS": {"min_length": 4}},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

AUTHENTICATION_BACKENDS = [
    "apps.accounts.backends.EmailOrUsernameModelBackend",
    "django.contrib.auth.backends.ModelBackend",
]

# REST Framework Configuration
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
        "rest_framework.authentication.SessionAuthentication",
    ),
    "DEFAULT_PERMISSION_CLASSES": (
        "rest_framework.permissions.IsAuthenticatedOrReadOnly",
    ),
    "DEFAULT_FILTER_BACKENDS": (
        "django_filters.rest_framework.DjangoFilterBackend",
        "rest_framework.filters.SearchFilter",
        "rest_framework.filters.OrderingFilter",
    ),
    "DEFAULT_PAGINATION_CLASS": "erentkarar.pagination.StandardResultsPagination",
    "PAGE_SIZE": 20,
    "EXCEPTION_HANDLER": "apps.accounts.exceptions.custom_exception_handler",
}

# SimpleJWT Settings
SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(days=1),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=30),
    "ROTATE_REFRESH_TOKENS": True,
    "BLACKLIST_AFTER_ROTATION": False,
    "AUTH_HEADER_TYPES": ("Bearer",),
}

# CORS Configuration
CORS_ALLOW_ALL_ORIGINS = True  # For dev; scoped in production via CORS_ALLOWED_ORIGINS
CORS_ALLOWED_ORIGIN_REGEXES = [
    r"^https?://localhost:\d+$",
    r"^https?://127\.0\.0\.1:\d+$",
    r"^https://.*\.erentkarar\.com$",
]

# India-First Localization
LANGUAGE_CODE = "en-in"
TIME_ZONE = "Asia/Kolkata"
USE_I18N = True
USE_TZ = True

# Static & Media Files
STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"
MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# Provider Integrations Configuration
ESIGN_PROVIDER = os.getenv("ESIGN_PROVIDER", "mock")
PAYMENT_PROVIDER = os.getenv("PAYMENT_PROVIDER", "mock")
WHATSAPP_PROVIDER = os.getenv("WHATSAPP_PROVIDER", "mock")
AI_PROVIDER = os.getenv("AI_PROVIDER", "mock")
