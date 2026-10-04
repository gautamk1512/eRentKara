import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
APPS_DIR = BASE_DIR / "apps"

APPS = [
    ("accounts", "Accounts & Authentication"),
    ("organizations", "Multi-tenant Organizations"),
    ("properties", "Property & Unit Hierarchy"),
    ("marketplace", "Public Rental Marketplace"),
    ("tenants", "Tenant Lifecycles & Tenancies"),
    ("leads", "CRM Leads & Visits"),
    ("bookings", "Room & Bed Bookings"),
    ("kyc", "Aadhaar/PAN KYC & Document Verification"),
    ("agreements", "Indian Rental Agreements & eSign"),
    ("billing", "Rent Billing & Utility Invoicing"),
    ("payments", "Payment Gateway & Webhook Safety"),
    ("deposits", "Security Deposit Ledger & Settlements"),
    ("complaints", "Complaints & Maintenance Tickets"),
    ("visitors", "Visitor Gate Pass & Logs"),
    ("mess", "Mess Menus, Attendance & Food Billing"),
    ("staff", "Staff Management & Shift Permissions"),
    ("notifications", "Multi-channel Notifications & Communication Logs"),
    ("reports", "Financial & Operational Reporting"),
    ("referrals", "Referral Engine & Rewards"),
    ("subscriptions", "SaaS Subscription Plans"),
    ("ai", "Ekrar AI Assistant & Business Tools"),
    ("audit", "Immutable Audit Logging"),
]

for app_name, verbose_name in APPS:
    app_folder = APPS_DIR / app_name
    app_folder.mkdir(parents=True, exist_ok=True)
    
    # __init__.py
    (app_folder / "__init__.py").touch()
    
    # apps.py
    class_name = "".join(word.capitalize() for word in app_name.split("_")) + "Config"
    apps_content = f'''from django.apps import AppConfig

class {class_name}(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "apps.{app_name}"
    verbose_name = "{verbose_name}"
'''
    (app_folder / "apps.py").write_text(apps_content, encoding="utf-8")
    
    # models.py if not present
    models_file = app_folder / "models.py"
    if not models_file.exists():
        models_file.write_text('from django.db import models\n', encoding="utf-8")
        
    # views.py if not present
    views_file = app_folder / "views.py"
    if not views_file.exists():
        views_file.write_text('from rest_framework import viewsets, permissions, status\nfrom rest_framework.response import Response\n', encoding="utf-8")
        
    # serializers.py if not present
    serializers_file = app_folder / "serializers.py"
    if not serializers_file.exists():
        serializers_file.write_text('from rest_framework import serializers\n', encoding="utf-8")
        
    # urls.py if not present
    urls_file = app_folder / "urls.py"
    if not urls_file.exists():
        urls_file.write_text('from django.urls import path, include\nfrom rest_framework.routers import DefaultRouter\n\nrouter = DefaultRouter()\n\nurlpatterns = [\n    path("", include(router.urls)),\n]\n', encoding="utf-8")

print(f"Successfully scaffolded {len(APPS)} modular apps in apps/")
