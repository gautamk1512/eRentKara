import os
import sys
import django

if sys.stdout.encoding != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8')

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'erentkarar.settings')
django.setup()

from django.apps import apps

print("\n================ MODEL OBJECT COUNTS IN DATABASE ================")
for app in apps.get_app_configs():
    if app.name.startswith('apps.'):
        app_name = app.name.split('.')[1]
        for model in app.get_models():
            try:
                count = model.objects.count()
                print(f"{app_name:<15} | {model.__name__:<25} | {count} records")
            except Exception as e:
                print(f"{app_name:<15} | {model.__name__:<25} | ERROR: {e}")
print("=================================================================\n")
