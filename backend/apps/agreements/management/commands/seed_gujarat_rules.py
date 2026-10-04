from django.core.management.base import BaseCommand
from django.utils import timezone
from apps.agreements.models import LegalRule, AgreementClause, Shop, StateConfiguration


class Command(BaseCommand):
    help = "Seed Gujarat Legal Rules, Bilingual Clauses, and Kiosk Network"

    def handle(self, *args, **kwargs):
        self.stdout.write("Seeding Gujarat Legal Rules...")

        # 1. State Configuration (Legacy)
        StateConfiguration.objects.update_or_create(
            state_code="GJ",
            defaults={
                "state_name": "Gujarat",
                "stamp_duty_type": StateConfiguration.StampDutyType.FIXED,
                "base_stamp_duty": 300.0,
                "registration_fee": 0.0,
                "e_stamping_supported": True,
                "legal_tenancy_act_reference": "Gujarat Stamp Act 1958 Article 30 & Model Tenancy Act",
            }
        )

        # 2. Gujarat Residential Tenancy Rule (<= 11 Months)
        LegalRule.objects.update_or_create(
            state_code="GJ",
            agreement_type=LegalRule.AgreementType.RESIDENTIAL,
            max_duration_months=11,
            defaults={
                "state_name": "Gujarat",
                "district": "",
                "property_type": "RESIDENTIAL",
                "min_duration_months": 1,
                "fixed_stamp_duty": 300.0,
                "rate_percentage": 0.0,
                "minimum_stamp_duty": 300.0,
                "registration_fee_fixed": 0.0,
                "registration_fee_percentage": 0.0,
                "registration_required_threshold_months": 12,
                "platform_fee": 299.0,
                "provider_fee": 100.0,
                "effective_from": timezone.now().date(),
                "version": "GJ-STAMP-2026-V1",
                "notes": "Gujarat Stamp Act 1958 Schedule I Article 30 (Residential Leases up to 11 months)",
                "source_reference": "Superintendent of Stamps, Govt of Gujarat Notification 2024",
                "is_active": True,
            }
        )

        # 3. Gujarat Residential Tenancy Rule (>= 12 Months - Registration Required)
        LegalRule.objects.update_or_create(
            state_code="GJ",
            agreement_type=LegalRule.AgreementType.RESIDENTIAL,
            max_duration_months=60,
            defaults={
                "state_name": "Gujarat",
                "district": "",
                "property_type": "RESIDENTIAL",
                "min_duration_months": 12,
                "fixed_stamp_duty": 0.0,
                "rate_percentage": 0.250,
                "minimum_stamp_duty": 500.0,
                "registration_fee_fixed": 1000.0,
                "registration_fee_percentage": 0.0,
                "registration_required_threshold_months": 12,
                "platform_fee": 499.0,
                "provider_fee": 150.0,
                "effective_from": timezone.now().date(),
                "version": "GJ-STAMP-REG-2026-V1",
                "notes": "Registration Act 1908 Section 17 & Gujarat Stamp Act Article 30 (Mandatory Sub-Registrar)",
                "source_reference": "Inspector General of Registration Gujarat",
                "is_active": True,
            }
        )

        # 4. Gujarat Commercial Rule
        LegalRule.objects.update_or_create(
            state_code="GJ",
            agreement_type=LegalRule.AgreementType.COMMERCIAL,
            defaults={
                "state_name": "Gujarat",
                "district": "",
                "property_type": "COMMERCIAL",
                "min_duration_months": 1,
                "max_duration_months": 120,
                "fixed_stamp_duty": 500.0,
                "rate_percentage": 0.500,
                "minimum_stamp_duty": 500.0,
                "registration_fee_fixed": 1500.0,
                "registration_fee_percentage": 0.0,
                "registration_required_threshold_months": 12,
                "platform_fee": 599.0,
                "provider_fee": 200.0,
                "effective_from": timezone.now().date(),
                "version": "GJ-COMMERCIAL-2026-V1",
                "notes": "Commercial Lease Deeds under Gujarat Stamp Act",
                "source_reference": "Govt of Gujarat Revenue Department",
                "is_active": True,
            }
        )

        # 5. Multilingual Legal Clauses (Gujarati + Hindi + English)
        clauses = [
            {
                "category": AgreementClause.Category.RENT_PAYMENT,
                "title_en": "Rent Payment & Due Date",
                "title_gu": "ભાડું ચુકવણી અને નિયત તારીખ",
                "title_hi": "किराया भुगतान एवं देय तिथि",
                "content_en": "The Tenant agrees to pay the agreed monthly rent on or before the 5th day of each calendar month via direct bank transfer or UPI without any deduction.",
                "content_gu": "ભાડૂતે દર કેલેન્ડર મહિનાની ૫મી તારીખ સુધીમાં કોઈપણ કપાત વિના સીધા બેંક ટ્રાન્સફર અથવા UPI દ્વારા સંમત થયેલ માસિક ભાડું મકાનમાલિકને ચૂકવવાનું રહેશે.",
                "content_hi": "किरायेदार प्रत्येक कैलेंडर माह की 5 तारीख या उससे पहले बैंक ट्रांसफर या यूपीआई के माध्यम से सहमत मासिक किराया बिना किसी कटौती के मकान मालिक को भुगतान करेगा।",
                "is_mandatory": True,
                "display_order": 1,
            },
            {
                "category": AgreementClause.Category.SECURITY_DEPOSIT,
                "title_en": "Security Deposit & Refund",
                "title_gu": "સિક્યોરિટી ડિપોઝિટ અને રિફંડ",
                "title_hi": "सुरक्षा जमा (सिक्योरिटी डिपॉजिट) एवं वापसी",
                "content_en": "The Tenant has deposited an interest-free refundable security deposit with the Owner. The deposit shall be refunded within 15 days of peaceful handover of premises, subject to deduction of unpaid utility bills or physical damage.",
                "content_gu": "ભાડૂતે મકાનમાલિક પાસે વ્યાજમુક્ત રિફંડેબલ સિક્યોરિટી ડિપોઝિટ જમા કરાવી છે. આ રકમ મકાનનો શાંતિપૂર્ણ કબજો સોંપ્યાના ૧૫ દિવસમાં બાકી બિલ કે નુકસાની બાદ કરીને પરત કરવામાં આવશે.",
                "content_hi": "किरायेदार ने मकान मालिक के पास ब्याज मुक्त रिफंडेबल सुरक्षा जमा राशि जमा की है। यह राशि परिसर के शांतिपूर्ण कब्जे के 15 दिनों के भीतर बकाया बिल या नुकसान काटकर वापस कर दी जाएगी।",
                "is_mandatory": True,
                "display_order": 2,
            },
            {
                "category": AgreementClause.Category.MAINTENANCE,
                "title_en": "Society Maintenance Charges",
                "title_gu": "સોસાયટી મેન્ટેનન્સ ચાર્જીસ",
                "title_hi": "सोसायटी रखरखाव शुल्क (मेंटेनेंस)",
                "content_en": "Society maintenance charges shall be paid regularly in accordance with the agreed terms, and the official payment receipt shall be preserved.",
                "content_gu": "સોસાયટીના મેન્ટેનન્સ ચાર્જીસ પરસ્પર સંમત થયેલી શરતો મુજબ નિયમિતપણે ચૂકવવાના રહેશે અને તેની સત્તાવાર રસીદ સાચવવાની રહેશે.",
                "content_hi": "सोसायटी रखरखाव शुल्क का भुगतान सहमत शर्तों के अनुसार नियमित रूप से किया जाएगा और आधिकारिक रसीद सुरक्षित रखी जाएगी।",
                "is_mandatory": True,
                "display_order": 3,
            },
            {
                "category": AgreementClause.Category.ELECTRICITY_WATER,
                "title_en": "Electricity & Water Utilities",
                "title_gu": "વીજળી અને પાણીના બિલ",
                "title_hi": "बिजली, पानी एवं अन्य सुविधाएं",
                "content_en": "The Tenant shall pay actual electricity, gas, and municipal water consumption charges based on sub-meter/meter readings directly to the respective authorities.",
                "content_gu": "ભાડૂતે મીટર રીડિંગ મુજબ વીજળી, ગેસ અને પાણી વપરાશના વાસ્તવિક બિલની રકમ સીધી સંબંધિત સત્તામંડળને સમયસર ભરવાની રહેશે.",
                "content_hi": "किरायेदार मीटर रीडिंग के आधार पर बिजली, गैस और नगर निगम पानी के वास्तविक उपभोग शुल्क का भुगतान सीधे संबंधित विभागों को करेगा।",
                "is_mandatory": True,
                "display_order": 4,
            },
            {
                "category": AgreementClause.Category.LOCK_IN,
                "title_en": "Lock-in Period",
                "title_gu": "લૉક-ઇન સમયગાળો",
                "title_hi": "लॉक-इन अवधि",
                "content_en": "Both parties agree to a lock-in period as specified. Neither party may terminate the tenancy during this period except for material breach or mutual written consent.",
                "content_gu": "બંને પક્ષો દર્શાવેલ લૉક-ઇન સમયગાળા માટે સંમત થાય છે. આ સમયગાળા દરમિયાન ગંભીર ઉલ્લંઘન કે લેખિત સહમતિ સિવાય કરાર રદ કરી શકાશે નહીં.",
                "content_hi": "दोनों पक्ष निर्धारित लॉक-इन अवधि के लिए सहमत हैं। गंभीर उल्लंघन या आपसी लिखित सहमति के अलावा इस अवधि के दौरान अनुबंध समाप्त नहीं किया जा सकता।",
                "is_mandatory": False,
                "display_order": 5,
            },
            {
                "category": AgreementClause.Category.NOTICE_PERIOD,
                "title_en": "Notice Period & Vacating",
                "title_gu": "નોટિસ પિરિયડ અને મકાન ખાલી કરવું",
                "title_hi": "नोटिस अवधि और परिसर खाली करना",
                "content_en": "Either party may terminate this agreement after the lock-in period by providing one (1) month prior written notice to the other party.",
                "content_gu": "લૉક-ઇન સમયગાળો પૂર્ણ થયા પછી કોઈપણ પક્ષ ૧ (એક) મહિનાની પૂર્વ લેખિત નોટિસ આપીને આ કરાર સમાપ્ત કરી શકે છે.",
                "content_hi": "लॉक-इन अवधि के बाद कोई भी पक्ष दूसरे पक्ष को 1 (एक) महीने का पूर्व लिखित नोटिस देकर इस अनुबंध को समाप्त कर सकता है।",
                "is_mandatory": True,
                "display_order": 6,
            },
            {
                "category": AgreementClause.Category.SOCIETY_RULES,
                "title_en": "Society Bylaws & Neighbor Harmony",
                "title_gu": "સોસાયટીના નિયમો અને પડોશી સૌહાર્દ",
                "title_hi": "सोसायटी नियम और शांतिपूर्ण निवास",
                "content_en": "The Tenant agrees to respect all society regulations, noise limits, visitor guidelines, and community bylaws established by the Residents Welfare Association.",
                "content_gu": "ભાડૂત સોસાયટીના નિયમો, અવાજ મર્યાદા, મુલાકાતીઓના નિયમો અને હાઉસિંગ સોસાયટીના તમામ નિયમોનું પાલન કરવા સંમત થાય છે.",
                "content_hi": "किरायेदार सोसायटी के उपनियमों और शांतिपूर्ण निवास के सभी नियमों का पालन करेगा और पड़ोसियों के लिए कोई उपद्रव नहीं करेगा।",
                "is_mandatory": False,
                "display_order": 7,
            },
            {
                "category": AgreementClause.Category.REPAIRS,
                "title_en": "Repairs & Maintenance Responsibilities",
                "title_gu": "સમારકામ અને જાળવણી",
                "title_hi": "संरचनात्मक एवं आंतरिक मरम्मत",
                "content_en": "Day-to-day minor repairs shall be taken care of by the Tenant. Major structural repairs, seepage, and building integrity issues remain the responsibility of the Owner.",
                "content_gu": "રોજિંદા નાના સમારકામની કાળજી ભાડૂતે લેવાની રહેશે. મોટા માળખાકીય સમારકામ અને લીકેજ જેવી બાબતો મકાનમાલિકની જવાબદારી રહેશે.",
                "content_hi": "मकान मालिक बड़ी संरचनात्मक मरम्मत के लिए जिम्मेदार होगा, जबकि दिन-प्रतिदिन के मामूली रखरखाव के लिए किरायेदार जिम्मेदार होगा।",
                "is_mandatory": True,
                "display_order": 8,
            },
            {
                "category": AgreementClause.Category.COMMERCIAL_USE,
                "title_en": "Strict Residential Use",
                "title_gu": "માત્ર રહેણાંક ઉપયોગ",
                "title_hi": "अनुबंधित उपयोग (वाणिज्यिक निषेध)",
                "content_en": "The premises are leased solely for private residential use. No commercial activity, subletting, or hazardous storage is permitted without prior written consent.",
                "content_gu": "આ મિલકત માત્ર ખાનગી રહેણાંક હેતુ માટે ભાડે આપવામાં આવી છે. મકાનમાલિકની મંજૂરી વિના કોઈપણ વ્યાવસાયિક પ્રવૃત્તિ કે પેટા-ભાડે આપવાની મનાઈ છે.",
                "content_hi": "परिसर का उपयोग केवल आवासीय उद्देश्य के लिए किया जाएगा। बिना अनुमति के कोई व्यावसायिक या गैर-कानूनी गतिविधि नहीं की जाएगी।",
                "is_mandatory": True,
                "display_order": 9,
            },
            {
                "category": AgreementClause.Category.TERMINATION,
                "title_en": "Default & Eviction Terms",
                "title_gu": "ડિફોલ્ટ અને કરાર રદ્દીકરણ શરતો",
                "title_hi": "डिफ़ॉल्ट और बेदखली की शर्तें",
                "content_en": "In the event of continuous default of rent for 60 days, unauthorized modifications, or illegal activities, the Owner may revoke this licence and initiate lawful repossession.",
                "content_gu": "સતત ૬૦ દિવસ સુધી ભાડું ન ભરવા કે ગેરકાયદેસર પ્રવૃત્તિ કરવા બદલ મકાનમાલિક આ લાઇસન્સ રદ કરી કાયદેસર પગલાં લેવા હકદાર રહેશે.",
                "content_hi": "लगातार 60 दिनों तक किराया न देने, अनधिकृत संशोधन या गैर-कानूनी गतिविधियों के मामले में, मकान मालिक अनुबंध रद्द कर कानूनी कब्जा लेने का हकदार होगा।",
                "is_mandatory": True,
                "display_order": 10,
            },
        ]

        for c_data in clauses:
            AgreementClause.objects.update_or_create(
                category=c_data["category"],
                defaults=c_data
            )

        # 6. Sample Assisted Shop Kiosks in Gujarat
        from apps.accounts.models import User
        admin_user = User.objects.filter(is_superuser=True).first()
        if not admin_user:
            admin_user = User.objects.filter(role="SUPER_ADMIN").first()
        if not admin_user:
            admin_user = User.objects.first()

        if admin_user:
            sample_shops = [
                {
                    "shop_code": "GJ-AHM-001",
                    "name": "Amdavad Seva Kendra & Legal Hub",
                    "owner_user": admin_user,
                    "phone": "9825012345",
                    "email": "seva.ahmedabad@erentkarar.com",
                    "address": "Shop 12, Navrangpura Complex, CG Road",
                    "city": "Ahmedabad",
                    "district": "Ahmedabad",
                    "state": "Gujarat",
                    "is_approved": True,
                    "is_active": True,
                },
                {
                    "shop_code": "GJ-SUR-002",
                    "name": "Surat Digital Document Center",
                    "owner_user": admin_user,
                    "phone": "9825067890",
                    "email": "surat.hub@erentkarar.com",
                    "address": "402, Ring Road Commercial Plaza",
                    "city": "Surat",
                    "district": "Surat",
                    "state": "Gujarat",
                    "is_approved": True,
                    "is_active": True,
                },
            ]

            for s_data in sample_shops:
                Shop.objects.update_or_create(
                    shop_code=s_data["shop_code"],
                    defaults=s_data
                )

        self.stdout.write(self.style.SUCCESS("Successfully seeded Gujarat rules, bilingual clauses, and kiosk shops!"))
