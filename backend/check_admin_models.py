import os
import sys
import django

if sys.stdout.encoding != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8')

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'erentkarar.settings')
django.setup()

from django.contrib import admin
from django.apps import apps

registered_models = set(admin.site._registry.keys())

print("\n================ DJANGO ADMIN REGISTRATION STATUS ================")
for app_config in apps.get_app_configs():
    if app_config.name.startswith('apps.'):
        print(f"\n[App: {app_config.name}]")
        models = list(app_config.get_models())
        if not models:
            print("   (No models)")
        for model in models:
            is_reg = model in registered_models
            status = "[REGISTERED]    " if is_reg else "[NOT REGISTERED]"
            print(f"   {status} -> {model.__name__}")

print("\n===================================================================\n")
