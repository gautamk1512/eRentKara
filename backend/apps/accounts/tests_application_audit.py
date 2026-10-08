import hashlib,hmac,json,time,tempfile,uuid
from decimal import Decimal
from unittest.mock import patch,Mock
from django.test import TestCase,override_settings
from rest_framework.test import APIClient
from django.core.cache import cache
from apps.accounts.models import User
from apps.organizations.models import Organization,OrganizationMember
from apps.properties.models import Property,Building,Floor,Room,Bed
from apps.tenants.models import Tenancy
from apps.billing.models import Invoice
from apps.payments.models import Payment,PaymentAttempt
from apps.kyc.models import KYC


class ApplicationAuditTests(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.owner=User.objects.create_user(email='owner@audit.test',role='OWNER')
        cls.other=User.objects.create_user(email='other@audit.test',role='OWNER')
        cls.tenant=User.objects.create_user(email='tenant@audit.test',role='TENANT')
        cls.admin=User.objects.create_superuser(email='admin@audit.test')
        cls.org=Organization.objects.create(name='Audit',contact_email=cls.owner.email,contact_phone='9876543200')
        cls.foreign=Organization.objects.create(name='Other',contact_email=cls.other.email,contact_phone='9876543201')
        OrganizationMember.objects.create(organization=cls.org,user=cls.owner,role='OWNER')
        OrganizationMember.objects.create(organization=cls.foreign,user=cls.other,role='OWNER')
        cls.prop=Property.objects.create(organization=cls.org,title='Audit stay',description='Test',address='Test road',locality='Center',city='Vadodara',pincode='390001',monthly_rent_starting=1000,is_published=True,verification_status='VERIFIED')
        cls.foreign_prop=Property.objects.create(organization=cls.foreign,title='Other stay',description='Test',address='Test road',locality='Center',city='Surat',pincode='395001',monthly_rent_starting=2000,is_published=True,verification_status='VERIFIED')
        cls.beds=[]
        for prop in [cls.prop,cls.foreign_prop]:
            building=Building.objects.create(property=prop,name='Main')
            floor=Floor.objects.create(building=building,floor_number=1,name='First')
            room=Room.objects.create(floor=floor,room_number='101',base_rent=1000)
            cls.beds.append(Bed.objects.create(room=room,bed_identifier='A',rent_amount=1000,deposit_amount=2000))
        cls.stay=Tenancy.objects.create(tenant=cls.tenant,property=cls.prop,monthly_rent=1000,start_date='2026-10-01',status='ACTIVE')
        cls.invoice=Invoice.objects.create(tenancy=cls.stay,billing_month=10,billing_year=2026,base_rent=1000,total_amount=1000,paid_amount=100,due_date='2026-10-05')
        cls.payment=Payment.objects.create(organization=cls.org,tenancy=cls.stay,invoice=cls.invoice,amount=900,gateway_order_id='order_audit')

    def setUp(self):
        self.client=APIClient(); cache.clear(); self.client.force_authenticate(self.owner)

    def test_cross_organization_property_create_is_denied(self):
        r=self.client.post('/api/v1/properties/',{'organization':str(self.foreign.pk),'title':'Intrusion','description':'Test','address':'A','locality':'B','city':'Surat','pincode':'395001','monthly_rent_starting':1000},format='json')
        self.assertEqual(r.status_code,403)

    def test_property_approval_cannot_be_patched_by_owner(self):
        self.assertEqual(self.client.patch(f'/api/v1/properties/{self.prop.pk}/',{'verification_status':'VERIFIED','is_published':True},format='json').status_code,400)

    def test_ownership_submission_requires_admin_review(self):
        r=self.client.post(f'/api/v1/properties/{self.prop.pk}/verify-ownership/',{'verification_method':'UTILITY_API','ownership_warranty_accepted':True,'electricity_consumer_number':'TEST-123'},format='json')
        self.assertEqual(r.status_code,200); self.prop.refresh_from_db()
        self.assertEqual(self.prop.verification_status,'PENDING'); self.assertFalse(self.prop.is_published)

    def test_inventory_hierarchy_cannot_reference_foreign_property(self):
        r=self.client.post('/api/v1/properties/buildings/',{'property':str(self.foreign_prop.pk),'name':'Injected'},format='json')
        self.assertEqual(r.status_code,403)

    def test_foreign_tenant_enrollment_does_not_create_user(self):
        r=self.client.post('/api/v1/tenants/enroll/',{'property':str(self.foreign_prop.pk),'tenant_email':'new@audit.test','start_date':'2026-10-01'},format='json')
        self.assertEqual(r.status_code,403); self.assertFalse(User.objects.filter(email='new@audit.test').exists())

    def test_cross_property_bed_enrollment_is_denied(self):
        r=self.client.post('/api/v1/tenants/enroll/',{'property':str(self.prop.pk),'bed':self.beds[1].pk,'tenant_email':'new@audit.test','start_date':'2026-10-01'},format='json')
        self.assertEqual(r.status_code,400)

    def test_valid_enrollment_and_double_allocation_guard(self):
        payload={'property':str(self.prop.pk),'bed':self.beds[0].pk,'tenant_email':'new@audit.test','tenant_name':'New Tenant','start_date':'2026-10-01'}
        response=self.client.post('/api/v1/tenants/enroll/',payload,format='json')
        self.assertEqual(response.status_code,201,response.data)
        self.assertFalse(User.objects.get(email='new@audit.test').has_usable_password())
        self.assertEqual(self.client.post('/api/v1/tenants/enroll/',{**payload,'tenant_email':'next@audit.test'},format='json').status_code,409)

    def test_tenant_cannot_onboard_itself(self):
        self.client.force_authenticate(self.tenant)
        self.assertEqual(self.client.post(f'/api/v1/tenants/{self.stay.pk}/onboard/').status_code,403)

    def test_booking_bed_must_belong_to_selected_property(self):
        self.client.force_authenticate(None)
        r=self.client.post('/api/v1/bookings/',{'property':str(self.prop.pk),'bed':self.beds[1].pk,'move_in_date':'2026-11-01','tenant_name':'Guest','tenant_phone':'9876543209'},format='json')
        self.assertEqual(r.status_code,400)

    def test_booking_double_reservation_protection(self):
        self.client.force_authenticate(None)
        payload={'property':str(self.prop.pk),'bed':self.beds[0].pk,'move_in_date':'2026-11-01','tenant_name':'Guest','tenant_phone':'9876543209'}
        response=self.client.post('/api/v1/bookings/',payload,format='json')
        self.assertEqual(response.status_code,201,response.data)
        self.assertEqual(self.client.post('/api/v1/bookings/',payload,format='json').status_code,409)

    def test_unpublished_property_cannot_be_booked(self):
        self.prop.is_published=False; self.prop.save()
        r=self.client.post('/api/v1/bookings/',{'property':str(self.prop.pk),'move_in_date':'2026-11-01','tenant_name':'Guest','tenant_phone':'9876543209'},format='json')
        self.assertEqual(r.status_code,404)

    def test_invoice_invalid_month_is_validation_error(self):
        for month in ['abc',0,13]:
            self.assertEqual(self.client.post('/api/v1/invoices/generate_monthly_invoices/',{'month':month},format='json').status_code,400)

    def test_monthly_invoice_generation_is_idempotent(self):
        payload={'month':11,'year':2026}
        for _ in range(2): self.assertEqual(self.client.post('/api/v1/invoices/generate_monthly_invoices/',payload,format='json').status_code,200)
        self.assertEqual(Invoice.objects.filter(tenancy=self.stay,billing_month=11).count(),1)

    def test_unpaid_receipt_cannot_be_generated(self):
        self.assertEqual(self.client.post(f'/api/v1/invoices/{self.invoice.pk}/generate_receipt/').status_code,400)

    def test_invoice_cannot_be_forged_as_paid_by_patch(self):
        self.assertEqual(self.client.patch(f'/api/v1/invoices/{self.invoice.pk}/',{'status':'PAID','paid_amount':1000},format='json').status_code,400)

    def test_payment_record_mutations_are_disabled(self):
        self.assertEqual(self.client.patch(f'/api/v1/payments/{self.payment.pk}/',{'status':'SUCCESS'},format='json').status_code,405)
        self.assertEqual(self.client.post(f'/api/v1/payments/{self.payment.pk}/confirm_payment/').status_code,400)
        self.payment.refresh_from_db(); self.assertEqual(self.payment.status,'CREATED')

    @patch('apps.payments.views.razorpay.Client')
    def test_rent_checkout_uses_remaining_balance_and_links_invoice(self,gateway):
        gateway.return_value.order.create.return_value={'id':'order_new','amount':90000,'currency':'INR'}
        r=self.client.post('/api/v1/payments/create-order/',{'invoice_id':str(self.invoice.pk),'amount':100},format='json')
        self.assertEqual(r.status_code,201)
        self.assertEqual(gateway.return_value.order.create.call_args.kwargs['data']['amount'],90000)
        self.assertEqual(Payment.objects.get(gateway_order_id='order_new').invoice_id,self.invoice.pk)

    @patch('apps.payments.views.razorpay.Client')
    def test_cross_customer_invoice_checkout_is_denied(self,gateway):
        self.client.force_authenticate(self.other)
        self.assertEqual(self.client.post('/api/v1/payments/create-order/',{'invoice_id':str(self.invoice.pk),'amount':100},format='json').status_code,403)
        gateway.assert_not_called()

    @patch('apps.payments.views.razorpay.Client')
    def test_invoice_gateway_verification_and_retry_are_idempotent(self,gateway):
        from django.conf import settings
        gateway.return_value.payment.fetch.return_value={'order_id':'order_audit','id':'pay_audit','amount':90000,'currency':'INR','status':'captured'}
        signature=hmac.new(settings.RAZORPAY_KEY_SECRET.encode(),b'order_audit|pay_audit',hashlib.sha256).hexdigest()
        payload={'invoice_id':str(self.invoice.pk),'razorpay_order_id':'order_audit','razorpay_payment_id':'pay_audit','razorpay_signature':signature}
        for _ in range(2): self.assertEqual(self.client.post('/api/v1/payments/verify-payment/',payload,format='json').status_code,200)
        self.invoice.refresh_from_db(); self.assertEqual(self.invoice.paid_amount,1000); self.assertEqual(self.invoice.status,'PAID')

    @override_settings(RAZORPAY_WEBHOOK_SECRET='audit-secret')
    def test_webhook_requires_signature_and_valid_capture(self):
        self.client.force_authenticate(None)
        payload={'event':'payment.captured','payload':{'payment':{'entity':{'id':'pay_audit','order_id':'order_audit','status':'captured','amount':90000,'currency':'INR'}}}}
        self.assertEqual(self.client.post('/api/v1/payments/webhook/',payload,format='json').status_code,400)
        body=json.dumps(payload,separators=(',',':')).encode(); signature=hmac.new(b'audit-secret',body,hashlib.sha256).hexdigest()
        for _ in range(2): self.assertEqual(self.client.post('/api/v1/payments/webhook/',body,content_type='application/json',HTTP_X_RAZORPAY_SIGNATURE=signature,HTTP_X_RAZORPAY_EVENT_ID='event-audit').status_code,200)
        self.assertEqual(PaymentAttempt.objects.count(),1); self.invoice.refresh_from_db(); self.assertEqual(self.invoice.paid_amount,1000)

    @override_settings(GOOGLE_CLIENT_ID='audit-client')
    def test_google_email_impersonation_is_rejected(self):
        self.client.force_authenticate(None)
        self.assertEqual(self.client.post('/api/v1/auth/google/',{'email':self.owner.email,'force_role':True},format='json').status_code,400)

    @override_settings(GOOGLE_CLIENT_ID='audit-client')
    @patch('apps.accounts.views.requests.get')
    def test_google_invalid_audience_and_expiry_are_rejected(self,google):
        google.return_value.json.return_value={'aud':'attacker','iss':'accounts.google.com','email_verified':'true','exp':time.time()+60,'email':self.owner.email,'sub':'123'}
        self.assertEqual(self.client.post('/api/v1/auth/google/',{'credential':'forged'},format='json').status_code,401)

    @override_settings(GOOGLE_CLIENT_ID='audit-client')
    @patch('apps.accounts.views.requests.get')
    def test_google_verified_identity_cannot_change_existing_role(self,google):
        google.return_value.json.return_value={'aud':'audit-client','iss':'accounts.google.com','email_verified':'true','exp':time.time()+60,'email':self.owner.email,'sub':'123'}
        r=self.client.post('/api/v1/auth/google/',{'credential':'verified-by-mock','role':'TENANT','force_role':True},format='json')
        self.assertEqual(r.status_code,200); self.owner.refresh_from_db(); self.assertEqual(self.owner.role,'OWNER')

    def test_kyc_cannot_be_self_verified(self):
        record=KYC.objects.create(user=self.tenant,tenancy=self.stay)
        self.client.force_authenticate(self.tenant)
        self.assertEqual(self.client.post(f'/api/v1/kyc/{record.pk}/verify/',{'approved':True},format='json').status_code,403)

    def test_public_menu_write_is_rejected(self):
        self.client.force_authenticate(None)
        self.assertIn(self.client.post('/api/v1/mess/menu/',{},format='json').status_code,[401,403])

    def test_cross_org_menu_create_is_rejected(self):
        r=self.client.post('/api/v1/mess/menu/',{'property':str(self.foreign_prop.pk),'day_of_week':1,'breakfast':'A','lunch':'B','dinner':'C'},format='json')
        self.assertEqual(r.status_code,403)

    def test_meal_toggle_validation_and_reversal(self):
        self.client.force_authenticate(self.tenant)
        self.assertEqual(self.client.post('/api/v1/mess/attendance/toggle_opt_out/',{'meal_date':'invalid','meal_type':'LUNCH'},format='json').status_code,400)
        for expected in [True,False]:
            r=self.client.post('/api/v1/mess/attendance/toggle_opt_out/',{'meal_date':'2026-10-10','meal_type':'LUNCH'},format='json')
            self.assertEqual(r.status_code,200); self.assertEqual(r.data['is_opted_out'],expected)

    def test_marketplace_filters_pagination_and_hidden_listing(self):
        r=self.client.get('/api/v1/marketplace/search/?city=Vadodara&limit=1'); self.assertEqual(r.status_code,200); self.assertEqual(len(r.data['data']),1)
        self.assertEqual(r.data['data'][0]['city'],'Vadodara')
        self.assertEqual(self.client.get('/api/v1/marketplace/search/?limit=oops').status_code,400)

    def test_public_listing_requires_login_and_valid_inventory(self):
        self.client.force_authenticate(None)
        self.assertIn(self.client.post('/api/v1/marketplace/list-property/',{},format='json').status_code,[401,403])
        self.client.force_authenticate(self.owner)
        self.assertEqual(self.client.post('/api/v1/marketplace/list-property/',{'title':'New','total_beds':'bad'},format='json').status_code,400)
        r=self.client.post('/api/v1/marketplace/list-property/',{'title':'Three beds','total_beds':3,'city':'Vadodara'},format='json')
        self.assertEqual(r.status_code,201); p=Property.objects.get(title='Three beds')
        self.assertEqual(Bed.objects.filter(room__floor__building__property=p).count(),3); self.assertFalse(p.is_published)

    def test_foreign_ai_conversation_returns_not_found(self):
        self.assertEqual(self.client.post('/api/v1/ai/chat/',{'conversation_id':str(uuid.uuid4()),'message':'pending rent'},format='json').status_code,404)


def private_route_test(route):
    def test(self):
        self.client.force_authenticate(None)
        self.assertIn(self.client.get(route).status_code,[401,403])
    return test
for label,route in {'properties':'properties/','organizations':'organizations/','tenants':'tenants/','invoices':'invoices/','payments':'payments/','complaints':'complaints/','visitors':'visitors/','kyc':'kyc/','leads':'leads/','audit':'audit/','reports':'reports/dashboard-metrics/','agreements':'agreements/orders/'}.items():
    setattr(ApplicationAuditTests,'test_anonymous_cannot_read_'+label,private_route_test('/api/v1/'+route))
