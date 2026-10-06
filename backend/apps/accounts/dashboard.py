from django.urls import reverse
from .models import PartnerApplication, ContactRequest
from apps.agreements.models import AgreementOrder
from apps.properties.models import Property


def dashboard_callback(request, context):
    cards = []
    specs = [
        ("Pending partner applications", PartnerApplication, {"status": "PENDING"}, "accounts.view_partnerapplication", "accounts_partnerapplication", "Review applications"),
        ("New contact requests", ContactRequest, {"status": "NEW"}, "accounts.view_contactrequest", "accounts_contactrequest", "Open inbox"),
        ("Orders awaiting assignment", AgreementOrder, {"status": "PARTNER_ASSIGNMENT_PENDING"}, "agreements.view_agreementorder", "agreements_agreementorder", "Assign a partner"),
        ("Properties", Property, {}, "properties.view_property", "properties_property", "Manage properties"),
    ]
    for title, model, filters, permission, url, action in specs:
        if request.user.has_perm(permission):
            from urllib.parse import urlencode
            query = urlencode({f"{key}__exact": value for key, value in filters.items()})
            cards.append({"title": title, "count": model.objects.filter(**filters).count(), "url": reverse(f"admin:{url}_changelist") + (f"?{query}" if query else ""), "action": action})
    context["operation_cards"] = cards
    context["partner_applications"] = PartnerApplication.objects.filter(status="PENDING")[:5] if request.user.has_perm("accounts.view_partnerapplication") else []
    context["contact_requests"] = ContactRequest.objects.filter(status="NEW")[:5] if request.user.has_perm("accounts.view_contactrequest") else []
    return context
