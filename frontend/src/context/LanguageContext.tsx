"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type Language = "gu" | "hi" | "en";

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string, fallback?: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  gu: {
    // Top Ribbon
    "ribbon.stamp": "રાજ્ય સરકાર ઈ-સ્ટેમ્પ",
    "ribbon.beta": "બીટા વર્ઝન",
    "ribbon.law": "મોડલ ટેનન્સી એક્ટ 2021 અને IT એક્ટ 2000 માન્ય • 28 ભારતીય રાજ્યોમાં માન્ય",
    "ribbon.rental_os": "ભારતની સ્માર્ટ રેન્ટલ પ્રોપર્ટી ઓપરેટિંગ સિસ્ટમ — PG, હોસ્ટેલ અને ફ્લેટ",
    "ribbon.verify": "દસ્તાવેજ ઈ-સ્ટેમ્પ ચકાસો",
    "ribbon.pricing": "કિંમત અને સ્ટેમ્પ",
    "ribbon.faq": "કાનૂની પ્રશ્નોત્તરી",

    // Brand & Mode
    "nav.brand_deed": "અધિકૃત કાનૂની ભાડા કરાર",
    "nav.brand_os": "PG અને પ્રોપર્ટી મેનેજમેન્ટ",
    "nav.rent_agreement": "ભાડા કરાર",
    "nav.rental_management": "રેન્ટલ મેનેજમેન્ટ",

    // Navigation Links
    "nav.ai_studio": "રેન્ટ એગ્રીમેન્ટ AI",
    "nav.live_studio": "લાઈવ સ્ટુડિયો",
    "nav.agreement_formats": "કરારના ફોર્મેટ્સ",
    "nav.residential_deed": "રહેણાંક 11-મહિનાનો કરાર",
    "nav.residential_desc": "ફ્લેટ, મકાન અને એપાર્ટમેન્ટ માટે",
    "nav.commercial_deed": "કોમર્શિયલ લીઝ ડીડ",
    "nav.commercial_desc": "ઓફિસ, દુકાન અને ગોડાઉન માટે",
    "nav.affidavit": "ભાડુઆત સોગંદનામું (Affidavit)",
    "nav.affidavit_desc": "સોસાયટી NOC અને પોલીસ વેરિફિકેશન",
    "nav.pricing": "કિંમત અને સ્ટેમ્પ",
    "nav.ai_renew": "AI રિન્યુ",
    "nav.need_help": "મદદ જોઈએ છે?",
    "nav.user_manual": "યુઝર મેન્યુઅલ",
    "nav.kiosks": "કિયોસ્ક કેન્દ્રો",

    // Action Buttons
    "nav.track_status": "સ્ટેટસ ટ્રેક કરો",
    "nav.sign_in": "સાઇન ઇન",
    "nav.create_agreement": "કરાર બનાવો",
    "nav.tenant_login": "ભાડુઆત લૉગિન",
    "nav.owner_portal": "માલિક પોર્ટલ",
    "nav.kiosk_portal": "કિયોસ્ક પોર્ટલ",
    "nav.dashboard": "ડેશબોર્ડ",
    "nav.owner_agreements": "માલિક કરાર",
    "nav.tenant_agreements": "ભાડુઆત કરાર",
    "nav.kiosk_hub": "કિયોસ્ક હબ",
    "nav.logout": "લૉગ આઉટ",

    // Mobile Drawer
    "mobile.services_title": "કરાર સેવાઓ",
    "mobile.rental_title": "પ્રોપર્ટી મેનેજમેન્ટ સેવાઓ",
    "mobile.lang_label": "ભાષા પસંદ કરો",
    "mobile.track_deed": "કરાર સ્ટેટસ તપાસો",
    "mobile.faqs": "કાનૂની માન્યતા અને પ્રશ્નોત્તરી",

    // Homepage Hero
    "hero.badge": "સરકારી માન્ય ઈ-સ્ટેમ્પ અને રેન્ટલ પ્લેટફોર્મ",
    "hero.ai_badge": "AI રિયલ-ટાઇમ સ્ટુડિયો લાઈવ",
    "hero.title_part1": "ભાડા કરાર.",
    "hero.title_part2": "સરળ અને 100% કાનૂની.",
    "hero.subtitle": "રહેણાંક અને કોમર્શિયલ ભાડા કરાર ઓનલાઇન 5 મિનિટમાં બનાવો — ઝડપી, સુરક્ષિત, આધાર eSign અને ભારતના દરેક રાજ્યમાં કાયદેસર માન્ય.",
    "hero.residential": "રહેણાંક",
    "hero.commercial": "કોમર્શિયલ",
    "hero.cta_ai": "Rent Agreement AI સાથે બનાવો",
    "hero.cta_classic": "ક્લાસિક ફોર્મ",
    "hero.cta_status": "સ્ટેટસ તપાસો",
    "hero.feat_online": "100% ઓનલાઇન",
    "hero.feat_stamp": "સરકારી e-Stamp",
    "hero.feat_esign": "આધાર eSign",
    "hero.feat_pan": "સમગ્ર ભારતમાં માન્ય",

    // Doc Preview Tabs
    "doc.tab_agreement": "11-મહિનાનો ભાડા કરાર",
    "doc.tab_affidavit": "કાનૂની સોગંદનામું (Affidavit)",

    // Pricing Page
    "pricing.badge": "ગુજરાત સ્ટેમ્પ એક્ટ 1958 અને આર્ટિકલ 30 અનુસાર માન્ય",
    "pricing.title": "પારદર્શક, કોઈ છૂપો ચાર્જ નહીં",
    "pricing.title_highlight": "ભાડા કરાર કિંમત સૂચિ",
    "pricing.subtitle": "સેલ્ફ-સર્વિસ ડ્રાફ્ટથી લઈને આધાર eSign, સરકારી ઈ-સ્ટેમ્પ અને ઘેરબેઠા ફિઝિકલ ડિલિવરી સુધી.",
    "pricing.calc_badge": "કાનૂની ફી કેલ્ક્યુલેટર",
    "pricing.calc_heading": "લાઈવ ગુજરાત સ્ટેમ્પ ડ્યુટી અને સર્વિસ કેલ્ક્યુલેટર",
    "pricing.calc_sub": "ગુજરાત મહેસૂલ વિભાગના નિયમો મુજબ અધિકૃત અને પારદર્શક ગણતરી.",
    "pricing.calc_monthly_rent": "માસિક ભાડું (₹)",
    "pricing.calc_deposit": "સિક્યોરિટી ડિપોઝિટ (₹)",
    "pricing.calc_duration": "કરાર સમયગાળો (મહિના)",
    "pricing.calc_optional_services": "વૈકલ્પિક કાનૂની સેવાઓ ઉમેરો:",
    "pricing.addon_esign": "આધાર eSign (માલિક + ભાડુઆત) - ₹98",
    "pricing.addon_notary": "સરકારી નોટરી એટેસ્ટેશન - ₹249",
    "pricing.addon_courier": "ડોરસ્ટેપ સ્પીડ પોસ્ટ બોન્ડ ડિલિવરી - ₹149",
    "pricing.addon_kiosk": "કિયોસ્ક કેન્દ્ર સહાયતા - ₹99",
    "pricing.breakdown": "કુલ ચુકવવાપાત્ર રકમની વિગત",
    "pricing.govt_duty": "સરકારી સ્ટેમ્પ ડ્યુટી (રાજ્ય તિજોરી)",
    "pricing.provider_fee": "ઈ-સ્ટેમ્પિંગ એજન્સી ચાર્જ (CRA)",
    "pricing.platform_fee": "પ્લેટફોર્મ સેવા ચાર્જ",
    "pricing.gst": "GST (18%)",
    "pricing.grand_total": "કુલ ચુકવણી રકમ",
    "pricing.cta_create": "આ પ્લાન સાથે કરાર બનાવો",

    // Pricing Tiers
    "tier.draft.title": "1. ભાડા કરાર ડ્રાફ્ટ",
    "tier.draft.desc": "તત્કાલ વકીલ દ્વારા પ્રમાણિત ડ્રાફ્ટ. તમારા પોતાના સ્ટેમ્પ પેપર પર પ્રિન્ટ કરો.",
    "tier.estamp.title": "2. કરાર + ગુજરાત ઈ-સ્ટેમ્પ",
    "tier.estamp.desc": "અધિકૃત ગુજરાત સરકાર માન્ય નોન-જ્યુડિશિયલ ઈ-સ્ટેમ્પ સર્ટિફિકેટ સાથે જોડેલ.",
    "tier.digital.title": "3. ઈ-સ્ટેમ્પ + ડ્યુઅલ આધાર eSign",
    "tier.digital.desc": "100% પેપરલેસ. સત્તાવાર ઈ-સ્ટેમ્પ સાથે માલિક અને ભાડુઆતનું કાનૂની આધાર OTP eSign.",
    "tier.notary.title": "4. ડિજિટલ કરાર + નોટરી એટેસ્ટેશન",
    "tier.notary.desc": "અધિકૃત એડવોકેટ નોટરી દ્વારા કાનૂની ચકાસણી અને રજિસ્ટર્ડ નોટરી સ્ટેમ્પ.",

    // Footer
    "footer.desc": "ભારતનું અગ્રણી ભાડા કરાર અને પ્રોપર્ટી મેનેજમેન્ટ પ્લેટફોર્મ. સરકારી ઈ-સ્ટેમ્પ, આધાર eSign અને 100% કાનૂની માન્યતા.",
    "footer.rights": "સર્વ હક સુરક્ષિત. eRentKarar India.",
    "footer.compliance": "મોડલ ટેનન્સી એક્ટ 2021 અને આઈટી એક્ટ 2000 અનુસાર માન્ય.",

    // Common
    "btn.continue": "આગળ વધો",
    "btn.back": "પાછા જાઓ",
    "btn.submit": "સબમિટ કરો",
    "status.verified": "પ્રમાણિત",
    "status.pending": "બાકી",
  },

  hi: {
    // Top Ribbon
    "ribbon.stamp": "राज्य सरकार ई-स्टाम्प",
    "ribbon.beta": "बीटा संस्करण",
    "ribbon.law": "मॉडल टेनेंसी एक्ट 2021 और आईटी एक्ट 2000 मान्य • 28 भारतीय राज्यों में मान्य",
    "ribbon.rental_os": "भारत का स्मार्ट रेंटल प्रॉपर्टी ऑपरेटिंग सिस्टम — पीजी, हॉस्टल और फ्लैट्स",
    "ribbon.verify": "दस्तावेज़ ई-स्टाम्प सत्यापित करें",
    "ribbon.pricing": "मूल्य और स्टाम्प",
    "ribbon.faq": "कानूनी प्रश्नोत्तर",

    // Brand & Mode
    "nav.brand_deed": "आधिकारिक कानूनी किराया अनुबंध",
    "nav.brand_os": "पीजी और संपत्ति प्रबंधन",
    "nav.rent_agreement": "किराया अनुबंध",
    "nav.rental_management": "किराया प्रबंधन",

    // Navigation Links
    "nav.ai_studio": "रेंट एग्रीमेंट AI",
    "nav.live_studio": "लाइव स्टूडियो",
    "nav.agreement_formats": "अनुबंध प्रारूप",
    "nav.residential_deed": "आवासीय 11-महीने का अनुबंध",
    "nav.residential_desc": "फ्लैट, मकान और अपार्टमेंट के लिए",
    "nav.commercial_deed": "व्यावसायिक लीज डीड",
    "nav.commercial_desc": "दुकान, कार्यालय और गोदाम के लिए",
    "nav.affidavit": "किरायेदार शपथ पत्र (Affidavit)",
    "nav.affidavit_desc": "सोसाइटी NOC और पुलिस सत्यापन",
    "nav.pricing": "मूल्य और स्टाम्प",
    "nav.ai_renew": "AI रिन्यू",
    "nav.need_help": "सहायता चाहिए?",
    "nav.user_manual": "यूज़र मैनुअल",
    "nav.kiosks": "कियोस्क केंद्र",

    // Action Buttons
    "nav.track_status": "स्टेटस ट्रैक करें",
    "nav.sign_in": "साइन इन",
    "nav.create_agreement": "अनुबंध बनाएं",
    "nav.tenant_login": "किरायेदार लॉगिन",
    "nav.owner_portal": "मालिक पोर्टल",
    "nav.kiosk_portal": "कियोस्क पोर्टल",
    "nav.dashboard": "डैशबोर्ड",
    "nav.owner_agreements": "मकान मालिक अनुबंध",
    "nav.tenant_agreements": "किरायेदार अनुबंध",
    "nav.kiosk_hub": "कियोस्क हब",
    "nav.logout": "लॉग आउट",

    // Mobile Drawer
    "mobile.services_title": "अनुबंध सेवाएं",
    "mobile.rental_title": "संपत्ति प्रबंधन सेवाएं",
    "mobile.lang_label": "भाषा चुनें",
    "mobile.track_deed": "अनुबंध स्थिति जांचें",
    "mobile.faqs": "कानूनी वैधता और अक्सर पूछे जाने वाले सवाल",

    // Homepage Hero
    "hero.badge": "सरकारी मान्यता प्राप्त ई-स्टाम्प और रेंटल प्लेटफॉर्म",
    "hero.ai_badge": "AI रियल-टाइम स्टूडियो लाइव",
    "hero.title_part1": "किराया अनुबंध.",
    "hero.title_part2": "सरल और 100% कानूनी.",
    "hero.subtitle": "आवासीय और व्यावसायिक किराया अनुबंध ऑनलाइन 5 मिनट में तैयार करें — सुरक्षित, आधार eSign और भारत के सभी राज्यों में पूर्णतः वैध।",
    "hero.residential": "आवासीय",
    "hero.commercial": "व्यावसायिक",
    "hero.cta_ai": "Rent Agreement AI से बनाएं",
    "hero.cta_classic": "क्लासिक फॉर्म",
    "hero.cta_status": "स्थिति जांचें",
    "hero.feat_online": "100% ऑनलाइन",
    "hero.feat_stamp": "सरकारी e-Stamp",
    "hero.feat_esign": "आधार eSign",
    "hero.feat_pan": "अखिल भारतीय मान्य",

    // Doc Preview Tabs
    "doc.tab_agreement": "11-महीने का किराया अनुबंध",
    "doc.tab_affidavit": "कानूनी शपथ पत्र (Affidavit)",

    // Pricing Page
    "pricing.badge": "गुजरात स्टाम्प अधिनियम 1958 एवं अनुच्छेद 30 के अनुसार वैधानिक",
    "pricing.title": "पारदर्शी, कोई छुपा शुल्क नहीं",
    "pricing.title_highlight": "किराया अनुबंध मूल्य सूची",
    "pricing.subtitle": "सेल्फ-सर्विस ड्राफ्ट से लेकर आधार eSign, आधिकारिक ई-स्टाम्प और डोरस्टेप डिलीवरी तक।",
    "pricing.calc_badge": "वैधानिक शुल्क कैलकुलेटर",
    "pricing.calc_heading": "लाइव गुजरात स्टाम्प शुल्क और सेवा कैलकुलेटर",
    "pricing.calc_sub": "गुजरात राजस्व विभाग के नियमों के अनुसार सत्यापित और पारदर्शी गणना।",
    "pricing.calc_monthly_rent": "मासिक किराया (₹)",
    "pricing.calc_deposit": "सुरक्षा जमा (₹)",
    "pricing.calc_duration": "अनुबंध अवधि (महीने)",
    "pricing.calc_optional_services": "वैकल्पिक कानूनी सेवाएं जोड़ें:",
    "pricing.addon_esign": "आधार eSign (मालिक + किरायेदार) - ₹98",
    "pricing.addon_notary": "सरकारी नोटरी सत्यापन - ₹249",
    "pricing.addon_courier": "डोरस्टेप स्पीड पोस्ट बॉन्ड डिलीवरी - ₹149",
    "pricing.addon_kiosk": "कियोस्क केंद्र सहायता - ₹99",
    "pricing.breakdown": "कुल देय राशि का विवरण",
    "pricing.govt_duty": "सरकारी स्टाम्प शुल्क (राज्य खजाना)",
    "pricing.provider_fee": "ई-स्टाम्पिंग एजेंसी शुल्क (CRA)",
    "pricing.platform_fee": "प्लेटफॉर्म सेवा शुल्क",
    "pricing.gst": "GST (18%)",
    "pricing.grand_total": "कुल देय राशि",
    "pricing.cta_create": "इस योजना के साथ अनुबंध बनाएं",

    // Pricing Tiers
    "tier.draft.title": "1. किराया अनुबंध ड्राफ्ट",
    "tier.draft.desc": "अधिवक्ता द्वारा तुरंत तैयार कानूनी ड्राफ्ट। अपने स्वयं के स्टाम्प पेपर पर प्रिंट करें।",
    "tier.estamp.title": "2. अनुबंध + गुजरात ई-स्टाम्प",
    "tier.estamp.desc": "आधिकारिक गुजरात सरकार मान्यता प्राप्त ई-स्टाम्प प्रमाण पत्र के साथ संकलित।",
    "tier.digital.title": "3. ई-स्टाम्प + डुअल आधार eSign",
    "tier.digital.desc": "100% पेपरलेस। आधिकारिक ई-स्टाम्प और मालिक व किरायेदार का सुरक्षित आधार OTP eSign।",
    "tier.notary.title": "4. डिजिटल अनुबंध + नोटरी सत्यापन",
    "tier.notary.desc": "सत्यापित नोटरी अधिवक्ता समीक्षा और आधिकारिक डिजिटल नोटरी मुहर एवं क्रमांक।",

    // Footer
    "footer.desc": "भारत का प्रमुख किराया अनुबंध और संपत्ति प्रबंधन प्लेटफॉर्म। सरकारी ई-स्टाम्प, आधार eSign और 100% कानूनी वैधता।",
    "footer.rights": "सर्वाधिकार सुरक्षित। eRentKarar India.",
    "footer.compliance": "मॉडल टेनेंसी एक्ट 2021 और आईटी एक्ट 2000 के अनुसार मान्य।",

    // Common
    "btn.continue": "आगे बढ़ें",
    "btn.back": "वापस जाएं",
    "btn.submit": "जमा करें",
    "status.verified": "सत्यापित",
    "status.pending": "लंबित",
  },

  en: {
    // Top Ribbon
    "ribbon.stamp": "STATE GOVT e-STAMP",
    "ribbon.beta": "BETA VERSION",
    "ribbon.law": "Model Tenancy Act 2021 & IT Act 2000 Approved • 28 Indian States Supported",
    "ribbon.rental_os": "India's Smart Rental Property Operating System — PG, Hostels, Flats & Auto UPI",
    "ribbon.verify": "Verify Deed Certificate",
    "ribbon.pricing": "Pricing & Stamp",
    "ribbon.faq": "Legal FAQ",

    // Brand & Mode
    "nav.brand_deed": "Official Legal Agreements",
    "nav.brand_os": "PG & Property Management",
    "nav.rent_agreement": "Rent Agreement",
    "nav.rental_management": "Rental Management",

    // Navigation Links
    "nav.ai_studio": "Rent Agreement AI",
    "nav.live_studio": "Live Studio",
    "nav.agreement_formats": "Agreement Formats",
    "nav.residential_deed": "Residential 11-Month Deed",
    "nav.residential_desc": "For flats, houses & independent floors",
    "nav.commercial_deed": "Commercial Lease Deed",
    "nav.commercial_desc": "For offices, shops, retail & warehouses",
    "nav.affidavit": "Tenancy Affidavit",
    "nav.affidavit_desc": "Society NOC & police declaration format",
    "nav.pricing": "Pricing & Stamp",
    "nav.ai_renew": "AI Renew",
    "nav.need_help": "Need Help?",
    "nav.user_manual": "User Manual",
    "nav.kiosks": "Kiosks",

    // Action Buttons
    "nav.track_status": "Track Status",
    "nav.sign_in": "Sign In",
    "nav.create_agreement": "Create Agreement",
    "nav.tenant_login": "Tenant Login",
    "nav.owner_portal": "Owner Portal",
    "nav.kiosk_portal": "Kiosk",
    "nav.dashboard": "Dashboard",
    "nav.owner_agreements": "Owner Agreements",
    "nav.tenant_agreements": "Tenant Agreements",
    "nav.kiosk_hub": "Kiosk Hub",
    "nav.logout": "Logout",

    // Mobile Drawer
    "mobile.services_title": "Agreement Services",
    "mobile.rental_title": "Rental Management Services",
    "mobile.lang_label": "Select Language",
    "mobile.track_deed": "Track Deed Status",
    "mobile.faqs": "Legal Validity & FAQs",

    // Homepage Hero
    "hero.badge": "Digital Rental Agreement Platform",
    "hero.ai_badge": "AI Real-time Studio Live",
    "hero.title_part1": "Rent Agreement.",
    "hero.title_part2": "Made Simple & Legal.",
    "hero.subtitle": "Create, sign, and execute residential and commercial rent agreements online — fast, secure, Aadhaar eSigned, under applicable tenancy laws and statutory rules.",
    "hero.residential": "Residential",
    "hero.commercial": "Commercial",
    "hero.cta_ai": "Draft with Rent Agreement AI",
    "hero.cta_classic": "Classic Form",
    "hero.cta_status": "Check Status",
    "hero.feat_online": "100% Online",
    "hero.feat_stamp": "Govt e-Stamp",
    "hero.feat_esign": "Aadhaar eSign",
    "hero.feat_pan": "PAN India",

    // Doc Preview Tabs
    "doc.tab_agreement": "11-Month Agreement",
    "doc.tab_affidavit": "Legal Affidavit",

    // Pricing Page
    "pricing.badge": "Statutory Gujarat Stamp Act 1958 & Article 30 Compliant",
    "pricing.title": "Transparent, Zero-Hidden-Fee",
    "pricing.title_highlight": "Rent Agreement Pricing",
    "pricing.subtitle": "From self-service drafts to full digital Aadhaar eSign, official Gujarat CRA e-Stamping, and doorstep physical bond delivery.",
    "pricing.calc_badge": "Statutory Fee Estimator",
    "pricing.calc_heading": "Live Transparent Gujarat Stamp Duty & Service Calculator",
    "pricing.calc_sub": "Backend verified calculation with itemized breakdown per Gujarat Revenue Department rules.",
    "pricing.calc_monthly_rent": "Monthly Rent (₹)",
    "pricing.calc_deposit": "Security Deposit (₹)",
    "pricing.calc_duration": "Agreement Duration (Months)",
    "pricing.calc_optional_services": "Add Optional Legal Services:",
    "pricing.addon_esign": "Dual Aadhaar eSign (Owner + Tenant) - ₹98",
    "pricing.addon_notary": "Advocate Notary Attestation - ₹249",
    "pricing.addon_courier": "Doorstep Speed Post Delivery - ₹149",
    "pricing.addon_kiosk": "Assisted Kiosk / Shop Entry - ₹99",
    "pricing.breakdown": "Total Payable Breakdown",
    "pricing.govt_duty": "Government Stamp Duty (State Treasury)",
    "pricing.provider_fee": "e-Stamping Agency Fee (CRA)",
    "pricing.platform_fee": "Platform Fee",
    "pricing.gst": "GST (18%)",
    "pricing.grand_total": "Total Amount Payable",
    "pricing.cta_create": "Create Agreement with this Plan",

    // Pricing Tiers
    "tier.draft.title": "1. Rent Agreement Draft",
    "tier.draft.desc": "Instant lawyer-approved legal draft with standard Gujarat clauses. Self-print on your own stamp paper.",
    "tier.estamp.title": "2. Agreement + Gujarat eStamp",
    "tier.estamp.desc": "Deed merged with official Gujarat Government non-judicial e-Stamp certificate from authorized CRA.",
    "tier.digital.title": "3. eStamp + Dual Aadhaar eSign",
    "tier.digital.desc": "100% paperless execution. Official Gujarat e-Stamp plus CCA-compliant Aadhaar OTP eSign for Owner & Tenant.",
    "tier.notary.title": "4. Digital Deed + Notary Attestation",
    "tier.notary.desc": "Complete digital deed with authorized advocate notary attestation and registered notary entry stamp.",

    // Footer
    "footer.desc": "India's premier digital rent agreement & property operating platform. Government e-Stamping, Aadhaar eSign, and 100% court compliance.",
    "footer.rights": "All rights reserved. eRentKarar India.",
    "footer.compliance": "Model Tenancy Act 2021 & IT Act 2000 Compliant.",

    // Common
    "btn.continue": "Continue",
    "btn.back": "Back",
    "btn.submit": "Submit",
    "status.verified": "Verified",
    "status.pending": "Pending",
  },
};

const LanguageContext = createContext<LanguageContextType>({
  lang: "gu",
  setLang: () => {},
  t: (key: string, fallback?: string) => fallback || key,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>("gu");

  useEffect(() => {
    const saved = localStorage.getItem("erk_lang") as Language;
    if (saved && (saved === "gu" || saved === "hi" || saved === "en")) {
      setLangState(saved);
    }
  }, []);

  useEffect(() => { document.documentElement.lang = lang; }, [lang]);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem("erk_lang", newLang);
    window.dispatchEvent(new CustomEvent("erk-language-changed", { detail: { lang: newLang } }));
  };

  const t = (key: string, fallback?: string): string => {
    const activeDict = translations[lang] || translations["gu"];
    return activeDict[key] || fallback || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
