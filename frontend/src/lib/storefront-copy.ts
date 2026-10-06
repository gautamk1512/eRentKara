"use client";
import { useLanguage } from "@/context/LanguageContext";
const copy: Record<string, {hi: string; gu: string}> = {
  "Rental Agreement": {
    "hi": "किराया अनुबंध",
    "gu": "ભાડા કરાર"
  },
  "Rental OS": {
    "hi": "Rental OS",
    "gu": "Rental OS"
  },
  "How it works": {
    "hi": "कैसे काम करता है",
    "gu": "કેવી રીતે કામ કરે છે"
  },
  "Delivery options": {
    "hi": "डिलीवरी विकल्प",
    "gu": "ડિલિવરી વિકલ્પો"
  },
  "Track order": {
    "hi": "ऑर्डर देखें",
    "gu": "ઓર્ડર જુઓ"
  },
  "Sign in": {
    "hi": "लॉग इन",
    "gu": "લૉગ ઇન"
  },
  "Create agreement": {
    "hi": "अनुबंध बनाएँ",
    "gu": "કરાર બનાવો"
  },
  "Skip to content": {
    "hi": "मुख्य सामग्री पर जाएँ",
    "gu": "મુખ્ય સામગ્રી પર જાઓ"
  },
  "RENTAL AGREEMENTS, SIMPLIFIED": {
    "hi": "किराया अनुबंध, आसान तरीके से",
    "gu": "ભાડા કરાર, સરળ રીતે"
  },
  "LESS PAPERWORK. MORE PEACE OF MIND.": {
    "hi": "कम कागज़ी काम। अधिक सुकून।",
    "gu": "ઓછું કાગળકામ. વધુ શાંતિ."
  },
  "Your rental agreement.": {
    "hi": "आपका किराया अनुबंध।",
    "gu": "તમારો ભાડા કરાર."
  },
  "Made simple.": {
    "hi": "अब आसान।",
    "gu": "હવે સરળ."
  },
  "Share your details. Upload your documents.": {
    "hi": "विवरण भरें। दस्तावेज़ अपलोड करें।",
    "gu": "વિગતો ભરો. દસ્તાવેજો અપલોડ કરો."
  },
  "We’ll take care of preparation and delivery.": {
    "hi": "तैयारी और डिलीवरी अब आसान।",
    "gu": "તૈયારી અને ડિલિવરી હવે સરળ."
  },
  "For a home": {
    "hi": "घर के लिए",
    "gu": "ઘર માટે"
  },
  "For a business": {
    "hi": "व्यवसाय के लिए",
    "gu": "વ્યવસાય માટે"
  },
  "Create my agreement": {
    "hi": "मेरा अनुबंध बनाएँ",
    "gu": "મારો કરાર બનાવો"
  },
  "Soft copy or doorstep delivery. You choose.": {
    "hi": "सॉफ्ट कॉपी या घर पर डिलीवरी। आप चुनें।",
    "gu": "સોફ્ટ કોપી કે ઘરે ડિલિવરી. તમે પસંદ કરો."
  },
  "Reviewed by our team": {
    "hi": "हमारी टीम की समीक्षा",
    "gu": "અમારી ટીમની સમીક્ષા"
  },
  "Track every step online": {
    "hi": "हर चरण ऑनलाइन देखें",
    "gu": "દરેક તબક્કો ઓનલાઇન જુઓ"
  },
  "FROM DOCUMENTS TO DONE": {
    "hi": "दस्तावेज़ से तैयार अनुबंध तक",
    "gu": "દસ્તાવેજોથી તૈયાર કરાર સુધી"
  },
  "PREVIEW": {
    "hi": "नमूना",
    "gu": "નમૂનો"
  },
  "RESIDENTIAL / COMMERCIAL": {
    "hi": "आवासीय / व्यावसायिक",
    "gu": "રહેણાંક / વ્યવસાયિક"
  },
  "Rental": {
    "hi": "किराया",
    "gu": "ભાડા"
  },
  "Agreement": {
    "hi": "अनुबंध",
    "gu": "કરાર"
  },
  "Prepared for your next chapter.": {
    "hi": "आपकी नई शुरुआत के लिए।",
    "gu": "તમારી નવી શરૂઆત માટે."
  },
  "FIRST PARTY": {
    "hi": "पहला पक्ष",
    "gu": "પ્રથમ પક્ષ"
  },
  "SECOND PARTY": {
    "hi": "दूसरा पक्ष",
    "gu": "બીજો પક્ષ"
  },
  "Property owner": {
    "hi": "संपत्ति मालिक",
    "gu": "મિલકત માલિક"
  },
  "Tenant": {
    "hi": "किरायेदार",
    "gu": "ભાડુઆત"
  },
  "Prepared with care.": {
    "hi": "ध्यान से तैयार।",
    "gu": "કાળજીપૂર્વક તૈયાર."
  },
  "Every step, taken care of.": {
    "hi": "हर चरण में साथ।",
    "gu": "દરેક તબક્કે સાથે."
  },
  "Submit → Review → Prepare → Deliver": {
    "hi": "जमा करें → समीक्षा → तैयारी → डिलीवरी",
    "gu": "સબમિટ → સમીક્ષા → તૈયારી → ડિલિવરી"
  },
  "ILLUSTRATION · YOUR ACTUAL STATUS IS IN MY ORDERS": {
    "hi": "नमूना · वास्तविक स्थिति मेरे ऑर्डर में देखें",
    "gu": "નમૂનો · સાચી સ્થિતિ મારા ઓર્ડરમાં જુઓ"
  },
  "A SIMPLE PROCESS": {
    "hi": "एक आसान प्रक्रिया",
    "gu": "એક સરળ પ્રક્રિયા"
  },
  "You submit.": {
    "hi": "आप जमा करें।",
    "gu": "તમે સબમિટ કરો."
  },
  "We take it from there.": {
    "hi": "आगे अब आसान।",
    "gu": "આગળ હવે સરળ."
  },
  "No running between offices. One place to follow your agreement.": {
    "hi": "अनुबंध की जानकारी एक ही जगह देखें।",
    "gu": "કરારની માહિતી એક જ જગ્યાએ જુઓ."
  },
  "Share the essentials": {
    "hi": "ज़रूरी जानकारी दें",
    "gu": "જરૂરી માહિતી આપો"
  },
  "Fill in your rental details, upload your proofs and pay securely.": {
    "hi": "किराये का विवरण भरें, प्रमाण अपलोड करें और भुगतान करें।",
    "gu": "ભાડાની વિગતો ભરો, પુરાવા અપલોડ કરો અને ચુકવણી કરો."
  },
  "We verify & prepare": {
    "hi": "हम जाँचकर तैयार करेंगे",
    "gu": "અમે ચકાસીને તૈયાર કરીશું"
  },
  "Our team reviews your documents and assigns a legal partner in your city.": {
    "hi": "टीम आपके दस्तावेज़ जाँचकर शहर के कानूनी पार्टनर को काम सौंपती है।",
    "gu": "ટીમ દસ્તાવેજો ચકાસીને તમારા શહેરના કાનૂની પાર્ટનરને કામ સોંપે છે."
  },
  "Receive your agreement": {
    "hi": "अपना अनुबंध पाएँ",
    "gu": "તમારો કરાર મેળવો"
  },
  "Download the approved PDF or track your printed copy to your doorstep.": {
    "hi": "स्वीकृत PDF डाउनलोड करें या मुद्रित कॉपी की डिलीवरी देखें।",
    "gu": "મંજૂર PDF ડાઉનલોડ કરો અથવા છાપેલી કોપીની ડિલિવરી જુઓ."
  },
  "YOUR AGREEMENT. YOUR WAY.": {
    "hi": "आपका अनुबंध। आपकी पसंद।",
    "gu": "તમારો કરાર. તમારી પસંદગી."
  },
  "A soft copy online.": {
    "hi": "सॉफ्ट कॉपी ऑनलाइन।",
    "gu": "સોફ્ટ કોપી ઓનલાઇન."
  },
  "A hard copy at your door.": {
    "hi": "हार्ड कॉपी आपके घर।",
    "gu": "હાર્ડ કોપી તમારા ઘરે."
  },
  "Your approved agreement is always a download away. Need a physical copy? Add doorstep delivery before you pay.": {
    "hi": "स्वीकृत अनुबंध डाउनलोड करें। मुद्रित कॉपी चाहिए तो भुगतान से पहले घर पर डिलीवरी चुनें।",
    "gu": "મંજૂર કરાર ડાઉનલોડ કરો. છાપેલી કોપી જોઈએ તો ચુકવણી પહેલાં ઘરે ડિલિવરી પસંદ કરો."
  },
  "All charges shown before checkout": {
    "hi": "भुगतान से पहले सभी शुल्क देखें",
    "gu": "ચુકવણી પહેલાં બધા શુલ્ક જુઓ"
  },
  "Updates and correction requests in one place": {
    "hi": "अपडेट और सुधार एक ही जगह",
    "gu": "અપડેટ અને સુધારા એક જ જગ્યાએ"
  },
  "Final document checked before delivery": {
    "hi": "डिलीवरी से पहले अंतिम जाँच",
    "gu": "ડિલિવરી પહેલાં અંતિમ ચકાસણી"
  },
  "Choose how you receive it": {
    "hi": "कॉपी का विकल्प चुनें",
    "gu": "કોપીનો વિકલ્પ પસંદ કરો"
  },
  "Digital soft copy": {
    "hi": "डिजिटल सॉफ्ट कॉपी",
    "gu": "ડિજિટલ સોફ્ટ કોપી"
  },
  "Approved PDF, ready to download.": {
    "hi": "स्वीकृत PDF डाउनलोड के लिए तैयार।",
    "gu": "મંજૂર PDF ડાઉનલોડ માટે તૈયાર."
  },
  "Included": {
    "hi": "शामिल",
    "gu": "સમાવેશ"
  },
  "Printed hard copy": {
    "hi": "मुद्रित हार्ड कॉपी",
    "gu": "છાપેલી હાર્ડ કોપી"
  },
  "A physical copy, delivered to your door.": {
    "hi": "मुद्रित कॉपी आपके घर पहुँचाई जाएगी।",
    "gu": "છાપેલી કોપી તમારા ઘરે પહોંચાડવામાં આવશે."
  },
  "Extra charges": {
    "hi": "अतिरिक्त शुल्क",
    "gu": "વધારાનો શુલ્ક"
  },
  "Final price shown at checkout": {
    "hi": "अंतिम कीमत भुगतान से पहले देखें",
    "gu": "અંતિમ કિંમત ચુકવણી પહેલાં જુઓ"
  },
  "Your package": {
    "hi": "आपका पैकेज",
    "gu": "તમારું પેકેજ"
  },
  "Let’s get started": {
    "hi": "शुरू करें",
    "gu": "શરૂ કરો"
  },
  "Payment comes after your details and documents.": {
    "hi": "विवरण और दस्तावेज़ भरने के बाद भुगतान करें।",
    "gu": "વિગતો અને દસ્તાવેજો ભર્યા પછી ચુકવણી કરો."
  },
  "GOOD TO KNOW": {
    "hi": "ज़रूरी जानकारी",
    "gu": "જરૂરી માહિતી"
  },
  "A few questions,": {
    "hi": "कुछ सवालों के",
    "gu": "કેટલાક પ્રશ્નોના"
  },
  "answered.": {
    "hi": "जवाब।",
    "gu": "જવાબ."
  },
  "Need a little help?": {
    "hi": "सहायता चाहिए?",
    "gu": "મદદ જોઈએ છે?"
  },
  "Which documents do I need?": {
    "hi": "कौन से दस्तावेज़ चाहिए?",
    "gu": "કયા દસ્તાવેજો જોઈએ?"
  },
  "What happens after I pay?": {
    "hi": "भुगतान के बाद क्या होगा?",
    "gu": "ચુકવણી પછી શું થશે?"
  },
  "Can I get a printed agreement?": {
    "hi": "मुद्रित अनुबंध मिल सकता है?",
    "gu": "છાપેલો કરાર મળી શકે?"
  },
  "What if a document needs correction?": {
    "hi": "दस्तावेज़ में सुधार कैसे करें?",
    "gu": "દસ્તાવેજમાં સુધારો કેવી રીતે કરવો?"
  },
  "Choose your agreement": {
    "hi": "अपना अनुबंध चुनें",
    "gu": "તમારો કરાર પસંદ કરો"
  },
  "For your home. For your business.": {
    "hi": "घर के लिए। व्यवसाय के लिए।",
    "gu": "ઘર માટે. વ્યવસાય માટે."
  },
  "Residential": {
    "hi": "आवासीय",
    "gu": "રહેણાંક"
  },
  "Commercial": {
    "hi": "व्यावसायिक",
    "gu": "વ્યવસાયિક"
  },
  "Flats, houses and rented rooms. Share the owner, tenant and property details to get started.": {
    "hi": "फ्लैट, घर और किराये के कमरे। मालिक, किरायेदार और संपत्ति का विवरण भरकर शुरू करें।",
    "gu": "ફ્લેટ, ઘર અને ભાડાના રૂમ. માલિક, ભાડુઆત અને મિલકતની વિગતો ભરીને શરૂ કરો."
  },
  "Offices, shops and business premises. Submit the lease details and required proofs for review.": {
    "hi": "ऑफिस, दुकान और व्यावसायिक परिसर। समीक्षा के लिए लीज़ का विवरण और प्रमाण जमा करें।",
    "gu": "ઓફિસ, દુકાન અને વ્યવસાયિક જગ્યા. સમીક્ષા માટે લીઝની વિગતો અને પુરાવા આપો."
  },
  "Start residential agreement": {
    "hi": "आवासीय अनुबंध शुरू करें",
    "gu": "રહેણાંક કરાર શરૂ કરો"
  },
  "Start commercial agreement": {
    "hi": "व्यावसायिक अनुबंध शुरू करें",
    "gu": "વ્યવસાયિક કરાર શરૂ કરો"
  },
  "Built around your peace of mind": {
    "hi": "आपकी सुविधा के लिए",
    "gu": "તમારી સુવિધા માટે"
  },
  "One dashboard": {
    "hi": "एक डैशबोर्ड",
    "gu": "એક ડેશબોર્ડ"
  },
  "Keep your documents, payment and order updates together.": {
    "hi": "दस्तावेज़, भुगतान और ऑर्डर अपडेट एक साथ रखें।",
    "gu": "દસ્તાવેજો, ચુકવણી અને ઓર્ડર અપડેટ સાથે રાખો."
  },
  "Human review": {
    "hi": "टीम की समीक्षा",
    "gu": "ટીમની સમીક્ષા"
  },
  "Our team checks your proofs and the prepared agreement.": {
    "hi": "टीम प्रमाण और तैयार अनुबंध की जाँच करती है।",
    "gu": "ટીમ પુરાવા અને તૈયાર કરારની ચકાસણી કરે છે."
  },
  "Clear delivery options": {
    "hi": "स्पष्ट डिलीवरी विकल्प",
    "gu": "સ્પષ્ટ ડિલિવરી વિકલ્પો"
  },
  "Choose PDF or printed delivery before checkout.": {
    "hi": "भुगतान से पहले PDF या मुद्रित डिलीवरी चुनें।",
    "gu": "ચુકવણી પહેલાં PDF કે છાપેલી ડિલિવરી પસંદ કરો."
  },
  "Simple pricing": {
    "hi": "आसान मूल्य विवरण",
    "gu": "સરળ કિંમત વિગતો"
  },
  "Service fee": {
    "hi": "सेवा शुल्क",
    "gu": "સેવા શુલ્ક"
  },
  "Printing & delivery": {
    "hi": "प्रिंटिंग और डिलीवरी",
    "gu": "પ્રિન્ટિંગ અને ડિલિવરી"
  },
  "Applicable stamp duty, taxes and optional services are itemised at checkout. This package is not the final payable total.": {
    "hi": "लागू स्टाम्प शुल्क, कर और वैकल्पिक सेवाएँ भुगतान से पहले अलग दिखेंगे। यह पैकेज अंतिम देय राशि नहीं है।",
    "gu": "લાગુ સ્ટેમ્પ શુલ્ક, કર અને વૈકલ્પિક સેવાઓ ચુકવણી પહેલાં અલગ દેખાશે. આ પેકેજ અંતિમ ચુકવણી રકમ નથી."
  },
  "For legal partners": {
    "hi": "कानूनी पार्टनर के लिए",
    "gu": "કાનૂની પાર્ટનર માટે"
  },
  "Help your city get agreements done.": {
    "hi": "अपने शहर में अनुबंध तैयार करने में मदद करें।",
    "gu": "તમારા શહેરમાં કરાર તૈયાર કરવામાં મદદ કરો."
  },
  "Our admin verifies documents and assigns orders by city. Approved partners sign in, download assigned documents and upload the prepared agreement for review.": {
    "hi": "एडमिन दस्तावेज़ जाँचकर शहर के अनुसार ऑर्डर सौंपता है। स्वीकृत पार्टनर लॉग इन करके सौंपे गए दस्तावेज़ डाउनलोड करें और तैयार अनुबंध समीक्षा के लिए अपलोड करें।",
    "gu": "એડમિન દસ્તાવેજો ચકાસીને શહેર મુજબ ઓર્ડર સોંપે છે. મંજૂર પાર્ટનર લૉગ ઇન કરીને સોંપેલા દસ્તાવેજો ડાઉનલોડ કરે અને તૈયાર કરાર સમીક્ષા માટે અપલોડ કરે."
  },
  "Partner sign in": {
    "hi": "पार्टनर लॉग इन",
    "gu": "પાર્ટનર લૉગ ઇન"
  },
  "Become a partner": {
    "hi": "पार्टनर बनें",
    "gu": "પાર્ટનર બનો"
  },
  "Agreements & support": {
    "hi": "अनुबंध और सहायता",
    "gu": "કરાર અને સહાય"
  },
  "Property & living": {
    "hi": "संपत्ति और रहने के विकल्प",
    "gu": "મિલકત અને રહેવાના વિકલ્પો"
  },
  "Contact us": {
    "hi": "संपर्क करें",
    "gu": "સંપર્ક કરો"
  },
  "My orders": {
    "hi": "मेरे ऑर्डर",
    "gu": "મારા ઓર્ડર"
  },
  "Help & guide": {
    "hi": "सहायता और गाइड",
    "gu": "સહાય અને માર્ગદર્શિકા"
  },
  "Browse properties": {
    "hi": "प्रॉपर्टी देखें",
    "gu": "મિલકતો જુઓ"
  },
  "PG & Hostels": {
    "hi": "PG और हॉस्टल",
    "gu": "PG અને હોસ્ટેલ"
  },
  "Co-Living": {
    "hi": "को-लिविंग",
    "gu": "કો-લિવિંગ"
  },
  "Owner dashboard": {
    "hi": "मालिक डैशबोर्ड",
    "gu": "માલિક ડેશબોર્ડ"
  },
  "List a property": {
    "hi": "प्रॉपर्टी सूचीबद्ध करें",
    "gu": "મિલકત સૂચિમાં ઉમેરો"
  },
  "Prepared locally. Managed online.": {
    "hi": "स्थानीय तैयारी। ऑनलाइन प्रबंधन।",
    "gu": "સ્થાનિક તૈયારી. ઓનલાઇન સંચાલન."
  },
  "A simpler way to prepare agreements and manage rental properties.": {
    "hi": "अनुबंध तैयार करने और किराये की संपत्ति सँभालने का आसान तरीका।",
    "gu": "કરાર તૈયાર કરવા અને ભાડાની મિલકત સંભાળવાની સરળ રીત."
  },
  "Find a place. Manage your rentals.": {
    "hi": "जगह खोजें। किराये की संपत्ति सँभालें।",
    "gu": "જગ્યા શોધો. ભાડાની મિલકત સંભાળો."
  },
  "Find, Book, Manage, All in One Place.": {
    "hi": "खोजें, बुक करें और सँभालें। एक ही जगह।",
    "gu": "શોધો, બુક કરો અને સંભાળો. એક જ જગ્યાએ."
  },
  "Rental properties, PGs & co-living": {
    "hi": "किराये की संपत्ति, PG और को-लिविंग",
    "gu": "ભાડાની મિલકત, PG અને કો-લિવિંગ"
  },
  "Properties": {
    "hi": "प्रॉपर्टीज़",
    "gu": "મિલકતો"
  },
  "PG/Hostel": {
    "hi": "PG/हॉस्टल",
    "gu": "PG/હોસ્ટેલ"
  },
  "PG / Hostel": {
    "hi": "PG / हॉस्टल",
    "gu": "PG / હોસ્ટેલ"
  },
  "Flats & Rooms": {
    "hi": "फ्लैट और कमरे",
    "gu": "ફ્લેટ અને રૂમ"
  },
  "Rooms / Beds": {
    "hi": "कमरे / बेड",
    "gu": "રૂમ / બેડ"
  },
  "Select City": {
    "hi": "शहर चुनें",
    "gu": "શહેર પસંદ કરો"
  },
  "Property Type": {
    "hi": "प्रॉपर्टी प्रकार",
    "gu": "મિલકતનો પ્રકાર"
  },
  "Budget": {
    "hi": "बजट",
    "gu": "બજેટ"
  },
  "Any Budget": {
    "hi": "कोई भी बजट",
    "gu": "કોઈપણ બજેટ"
  },
  "All Types": {
    "hi": "सभी प्रकार",
    "gu": "બધા પ્રકાર"
  },
  "Search": {
    "hi": "खोजें",
    "gu": "શોધો"
  },
  "Explore Property Types": {
    "hi": "प्रॉपर्टी के विकल्प देखें",
    "gu": "મિલકતના વિકલ્પો જુઓ"
  },
  "Explore Properties": {
    "hi": "प्रॉपर्टी देखें",
    "gu": "મિલકતો જુઓ"
  },
  "How It Works": {
    "hi": "कैसे काम करता है",
    "gu": "કેવી રીતે કામ કરે છે"
  },
  "Get started in minutes and manage everything from one dashboard.": {
    "hi": "शुरू करें और एक डैशबोर्ड से सब सँभालें।",
    "gu": "શરૂ કરો અને એક ડેશબોર્ડથી બધું સંભાળો."
  },
  "From single rooms to full buildings — we manage all types of rental properties.": {
    "hi": "कमरों से पूरी बिल्डिंग तक किराये का प्रबंधन करें।",
    "gu": "રૂમથી આખી બિલ્ડિંગ સુધી ભાડાનું સંચાલન કરો."
  },
  "Register": {
    "hi": "खाता बनाएँ",
    "gu": "ખાતું બનાવો"
  },
  "Add Property": {
    "hi": "प्रॉपर्टी जोड़ें",
    "gu": "મિલકત ઉમેરો"
  },
  "KYC & Agreement": {
    "hi": "KYC और अनुबंध",
    "gu": "KYC અને કરાર"
  },
  "Pay & Move In": {
    "hi": "भुगतान करें और रहें",
    "gu": "ચુકવણી કરો અને રહો"
  },
  "Ongoing Support": {
    "hi": "निरंतर सहायता",
    "gu": "સતત સહાય"
  },
  "Frequently Asked Questions": {
    "hi": "अक्सर पूछे जाने वाले सवाल",
    "gu": "વારંવાર પૂછાતા પ્રશ્નો"
  },
  "Watch Video Tour & Demo": {
    "hi": "वीडियो और डेमो देखें",
    "gu": "વિડિયો અને ડેમો જુઓ"
  },
  "Upload the landlord’s identity proof, the tenant’s identity proof and property proof, such as an electricity bill or property tax receipt. Use clear PDF or image files, up to 10 MB each. Our team will let you know if anything else is needed.": {
    "hi": "मालिक और किरायेदार का पहचान प्रमाण तथा संपत्ति का प्रमाण, जैसे बिजली बिल या संपत्ति कर रसीद अपलोड करें। स्पष्ट PDF या तस्वीर भेजें, हर फ़ाइल अधिकतम 10 MB हो। अतिरिक्त दस्तावेज़ चाहिए तो टीम बताएगी।",
    "gu": "માલિક અને ભાડુઆતના ઓળખ પુરાવા તથા મિલકતનો પુરાવો, જેમ કે વીજળીનું બિલ કે મિલકત વેરાની રસીદ અપલોડ કરો. સ્પષ્ટ PDF કે ફોટો મોકલો, દરેક ફાઇલ વધુમાં વધુ 10 MB હોય. વધારાના દસ્તાવેજો જોઈએ તો ટીમ જણાવશે."
  },
  "Your order appears in your dashboard with documents pending verification. Our team reviews them, assigns a legal partner in your city and checks the completed agreement before delivery.": {
    "hi": "ऑर्डर डैशबोर्ड में दस्तावेज़ जाँच की प्रतीक्षा में दिखेगा। टीम समीक्षा करके आपके शहर के कानूनी पार्टनर को काम सौंपती है और डिलीवरी से पहले तैयार अनुबंध जाँचती है।",
    "gu": "ઓર્ડર ડેશબોર્ડમાં દસ્તાવેજ ચકાસણીની રાહમાં દેખાશે. ટીમ સમીક્ષા કરીને તમારા શહેરના કાનૂની પાર્ટનરને કામ સોંપે છે અને ડિલિવરી પહેલાં તૈયાર કરાર ચકાસે છે."
  },
  "Yes. Choose hard copy before payment and enter your delivery address. You’ll see all additional printing and delivery charges before checkout. Courier details will appear in your dashboard after dispatch.": {
    "hi": "हाँ। भुगतान से पहले हार्ड कॉपी चुनें और डिलीवरी पता भरें। प्रिंटिंग और डिलीवरी के अतिरिक्त शुल्क भुगतान से पहले दिखेंगे। भेजे जाने पर कुरियर की जानकारी डैशबोर्ड में मिलेगी।",
    "gu": "હા. ચુકવણી પહેલાં હાર્ડ કોપી પસંદ કરો અને ડિલિવરી સરનામું ભરો. પ્રિન્ટિંગ અને ડિલિવરીના વધારાના શુલ્ક ચુકવણી પહેલાં દેખાશે. મોકલ્યા પછી કુરિયરની વિગતો ડેશબોર્ડમાં મળશે."
  },
  "You’ll see the reason in your order dashboard. Replace the requested document there and our team will review it again.": {
    "hi": "ऑर्डर डैशबोर्ड में कारण दिखेगा। वहाँ माँगा गया दस्तावेज़ बदलें; टीम दोबारा समीक्षा करेगी।",
    "gu": "ઓર્ડર ડેશબોર્ડમાં કારણ દેખાશે. ત્યાં માગેલો દસ્તાવેજ બદલો; ટીમ ફરી સમીક્ષા કરશે."
  },
  "Houses, Apartments, Flats": {
    "hi": "घर, अपार्टमेंट, फ्लैट",
    "gu": "ઘર, એપાર્ટમેન્ટ, ફ્લેટ"
  },
  "Offices, Shops, Showrooms": {
    "hi": "ऑफिस, दुकान, शोरूम",
    "gu": "ઓફિસ, દુકાન, શોરૂમ"
  },
  "Boys, Girls, Mixed": {
    "hi": "लड़के, लड़कियाँ, मिश्रित",
    "gu": "છોકરા, છોકરીઓ, મિશ્રિત"
  },
  "Shared Living Spaces": {
    "hi": "साझा रहने की जगह",
    "gu": "સાથે રહેવાની જગ્યા"
  },
  "Single & Multiple Beds": {
    "hi": "एक और कई बेड",
    "gu": "એક અને અનેક બેડ"
  },
  "Create your account as owner or tenant in under 60 seconds.": {
    "hi": "मालिक या किरायेदार के रूप में खाता बनाएँ।",
    "gu": "માલિક કે ભાડુઆત તરીકે ખાતું બનાવો."
  },
  "Add buildings, floors, rooms and configure rent & deposits.": {
    "hi": "बिल्डिंग, मंज़िल और कमरे जोड़ें; किराया और जमा राशि तय करें।",
    "gu": "બિલ્ડિંગ, માળ અને રૂમ ઉમેરો; ભાડું અને ડિપોઝિટ નક્કી કરો."
  },
  "Verify identity with Aadhaar KYC and eSign digital lease deed.": {
    "hi": "पहचान के दस्तावेज़ दें और किराया अनुबंध शुरू करें।",
    "gu": "ઓળખના દસ્તાવેજો આપો અને ભાડા કરાર શરૂ કરો."
  },
  "Pay deposit/rent via UPI and receive instant digital receipt.": {
    "hi": "जमा राशि और किराये का भुगतान तथा रसीदें सँभालें।",
    "gu": "ડિપોઝિટ અને ભાડાની ચુકવણી તથા રસીદો સંભાળો."
  },
  "Manage tickets, maintenance, mess menu & auto accounting.": {
    "hi": "शिकायतें, रखरखाव, भोजन मेन्यू और हिसाब सँभालें।",
    "gu": "ફરિયાદો, જાળવણી, ભોજન મેન્યૂ અને હિસાબ સંભાળો."
  },
  "For Property Owners & Managers": {
    "hi": "मालिक और प्रबंधक के लिए",
    "gu": "માલિક અને મેનેજર માટે"
  },
  "For Tenants & Residents": {
    "hi": "किरायेदार और निवासियों के लिए",
    "gu": "ભાડુઆત અને રહેવાસીઓ માટે"
  },
  "Secure, Compliant & Trusted": {
    "hi": "सुरक्षित और व्यवस्थित प्रबंधन",
    "gu": "સુરક્ષિત અને વ્યવસ્થિત સંચાલન"
  },
  "What Our Users Say": {
    "hi": "हमारे उपयोगकर्ताओं की राय",
    "gu": "અમારા વપરાશકર્તાઓના અભિપ્રાય"
  },
  "Owner Portal": {
    "hi": "मालिक पोर्टल",
    "gu": "માલિક પોર્ટલ"
  },
  "Tenant Login": {
    "hi": "किरायेदार लॉग इन",
    "gu": "ભાડુઆત લૉગ ઇન"
  },
  "List Property": {
    "hi": "प्रॉपर्टी जोड़ें",
    "gu": "મિલકત ઉમેરો"
  },
  "Browse Listings": {
    "hi": "लिस्टिंग देखें",
    "gu": "લિસ્ટિંગ જુઓ"
  },
  "Property city": {
    "hi": "संपत्ति का शहर",
    "gu": "મિલકતનું શહેર"
  },
  "Rental agreement service": {
    "hi": "किराया अनुबंध सेवा",
    "gu": "ભાડા કરાર સેવા"
  },
  "Create Rental Agreement": {
    "hi": "किराया अनुबंध बनाएँ",
    "gu": "નવો ભાડા કરાર બનાવો"
  },
  "1. Select Role": {
    "hi": "1. भूमिका चुनें",
    "gu": "૧. ભૂમિકા"
  },
  "2. Account Verification": {
    "hi": "2. खाता सत्यापन",
    "gu": "૨. એકાઉન્ટ"
  },
  "3. Property Details": {
    "hi": "3. संपत्ति विवरण",
    "gu": "૩. મિલકત"
  },
  "4. Parties (Owner & Tenant)": {
    "hi": "4. मालिक और किरायेदार",
    "gu": "૪. પક્ષકારો"
  },
  "5. Rent & Terms": {
    "hi": "5. किराया और शर्तें",
    "gu": "૫. ભાડું અને શરતો"
  },
  "6. Document Upload": {
    "hi": "6. दस्तावेज़ अपलोड",
    "gu": "૬. દસ્તાવેજ અપલોડ"
  },
  "7. Review & Delivery Selection": {
    "hi": "7. समीक्षा और डिलीवरी",
    "gu": "૭. ચકાસણી અને ડિલિવરી"
  },
  "8. Agreement Order Created": {
    "hi": "8. अनुबंध ऑर्डर बना",
    "gu": "૮. ઓર્ડર કન્ફર્મ"
  },
  "Who are you creating this for?": {
    "hi": "आप किसके लिए अनुबंध बना रहे हैं?",
    "gu": "તમારી યોગ્ય ભૂમિકા પસંદ કરો"
  },
  "Choose whether you are the Property Owner (Landlord), Tenant, or an authorized Kiosk partner. After selecting, you will confirm your account details.": {
    "hi": "अपनी भूमिका चुनें और आगे बढ़ें।",
    "gu": "તમે મકાનમાલિક છો, ભાડૂત છો કે સર્વિસ પોઈન્ટ ઑપરેટર છો તે પસંદ કરો."
  },
  "I'm the Property Owner": {
    "hi": "मैं संपत्ति का मालिक हूँ",
    "gu": "હું મકાનમાલિક છું"
  },
  "Prepare an agreement for your property.": {
    "hi": "अपनी संपत्ति के लिए अनुबंध तैयार करें।",
    "gu": "મોડ A: મકાનમાલિક દ્વારા કરાર નિર્માણ"
  },
  "I'm the Tenant": {
    "hi": "मैं किरायेदार हूँ",
    "gu": "હું ભાડૂત છું"
  },
  "Submit the details for your rented space.": {
    "hi": "किराये की जगह का विवरण दें।",
    "gu": "મોડ B: ભાડૂત બનાવીને માલિકને મોકલશે"
  },
  "Shop / Kiosk Assisted": {
    "hi": "दुकान / कियोस्क की सहायता",
    "gu": "સેવા કેન્દ્ર / Kiosk સહાય"
  },
  "Help a customer create their agreement.": {
    "hi": "ग्राहक का अनुबंध बनाने में सहायता करें।",
    "gu": "મોડ C: ઑપરેટર દ્વારા સહાયિત કરાર"
  },
  "Continue": {
    "hi": "आगे बढ़ें",
    "gu": "આગળ વધો (એકાઉન્ટ ચકાસણી)"
  },
  "Sign in to save your agreement": {
    "hi": "अनुबंध सहेजने के लिए लॉग इन करें",
    "gu": "એકાઉન્ટ અને ઓળખ ચકાસણી"
  },
  "Your account keeps your documents, payment and order updates together.": {
    "hi": "दस्तावेज़, भुगतान और ऑर्डर अपडेट सहेजने के लिए खाता बनाएँ या लॉग इन करें।",
    "gu": "કાયદેસર ભાડા કરાર માટે સાચી ઓળખ જરૂરી છે. કૃપા કરીને લોગિન કરો અથવા એકાઉન્ટ બનાવો."
  },
  "Property details": {
    "hi": "संपत्ति विवरण",
    "gu": "મિલકતની સંપૂર્ણ વિગતો"
  },
  "Enter the property details as recorded in municipal tax bills or society registers.": {
    "hi": "संपत्ति का पता और जानकारी भरें।",
    "gu": "કરારમાં જણાવવાની મિલકતનું સાચું સરનામું દાખલ કરો."
  },
  "Property Title / Category": {
    "hi": "संपत्ति का शीर्षक / प्रकार",
    "gu": "મિલકત વર્ગ"
  },
  "Complete Address with Landmark": {
    "hi": "पूरा पता और नज़दीकी पहचान",
    "gu": "સંપૂર્ણ સરનામું (લેન્ડમાર્ક સાથે)"
  },
  "Owner & Tenant Party Information": {
    "hi": "मालिक और किरायेदार का विवरण",
    "gu": "બંને પક્ષકારોની માહિતી"
  },
  "Details must match official Aadhaar or PAN documents for digital signature validity.": {
    "hi": "दोनों पक्षों का सही विवरण भरें।",
    "gu": "બંને પક્ષકારોના સાચા નામ અને આધાર સાથે લિંક કરેલા મોબાઈલ નંબર દાખલ કરો."
  },
  "Rent Terms & Duration": {
    "hi": "किराया और अवधि",
    "gu": "ભાડું, ડિપોઝિટ અને કરાર મુદત"
  },
  "Under Gujarat Stamp Act 1958 Article 30, stamp duty is calculated based on annual rent and security deposit.": {
    "hi": "किराया, जमा राशि और अवधि भरें।",
    "gu": "ગુજરાત સ્ટેમ્પ નિયમ મુજબ ૧૧ મહિનાના ભાડા કરાર માટે ₹૩૦૦ સ્ટેમ્પ ડ્યુટી લાગુ પડે છે."
  },
  "Submit your documents": {
    "hi": "अपने दस्तावेज़ जमा करें",
    "gu": "આધાર ઓળખ ચકાસણી"
  },
  "Final Review, Delivery Selection & Payment": {
    "hi": "अंतिम समीक्षा, डिलीवरी और भुगतान",
    "gu": "અંતિમ સમીક્ષા, ડિલિવરી પસંદગી અને ચુકવણી"
  },
  "Manage properties, tenants, rent and everyday operations from one place. Explore flats, PGs, hostels and co-living spaces across our marketplace.": {
    "hi": "एक ही जगह से संपत्ति, किरायेदार, किराया और रोज़मर्रा का काम सँभालें। मार्केटप्लेस में फ्लैट, PG, हॉस्टल और को-लिविंग खोजें।",
    "gu": "એક જ જગ્યાએથી મિલકત, ભાડુઆત, ભાડું અને રોજિંદું કામ સંભાળો. માર્કેટપ્લેસમાં ફ્લેટ, PG, હોસ્ટેલ અને કો-લિવિંગ શોધો."
  },
  "Explore Stays": {
    "hi": "रहने की जगह खोजें",
    "gu": "રહેવાની જગ્યા શોધો"
  },
  "+ List Free": {
    "hi": "प्रॉपर्टी जोड़ें",
    "gu": "મિલકત ઉમેરો"
  },
  "Manual": {
    "hi": "मार्गदर्शिका",
    "gu": "માર્ગદર્શિકા"
  },
  "Offers": {
    "hi": "ऑफ़र",
    "gu": "ઓફર"
  },
  "Tools": {
    "hi": "टूल्स",
    "gu": "ટૂલ્સ"
  },
  "Free Cloud OS": {
    "hi": "क्लाउड OS",
    "gu": "ક્લાઉડ OS"
  },
  "Owner": {
    "hi": "मालिक",
    "gu": "માલિક"
  },
  "Owner Login": {
    "hi": "मालिक लॉग इन",
    "gu": "માલિક લૉગ ઇન"
  },
  "Rental Management": {
    "hi": "किराया प्रबंधन",
    "gu": "ભાડા સંચાલન"
  },
  "Complete property and tenant management in one place.": {
    "hi": "संपत्ति और किरायेदार का प्रबंधन एक ही जगह।",
    "gu": "મિલકત અને ભાડુઆતનું સંચાલન એક જ જગ્યાએ."
  },
  "Online Rent Collection": {
    "hi": "ऑनलाइन किराया भुगतान",
    "gu": "ઓનલાઇન ભાડાની ચુકવણી"
  },
  "Digital payments, automated reminders, easy tracking.": {
    "hi": "डिजिटल भुगतान, रिमाइंडर और आसान ट्रैकिंग।",
    "gu": "ડિજિટલ ચુકવણી, રિમાઇન્ડર અને સરળ ટ્રેકિંગ."
  },
  "KYC & eSign": {
    "hi": "पहचान और अनुबंध",
    "gu": "ઓળખ અને કરાર"
  },
  "Verify tenants and sign agreements online.": {
    "hi": "पहचान के दस्तावेज़ और किराया अनुबंध सँभालें।",
    "gu": "ઓળખના દસ્તાવેજો અને ભાડા કરાર સંભાળો."
  },
  "Maintenance & Complaints": {
    "hi": "रखरखाव और शिकायतें",
    "gu": "જાળવણી અને ફરિયાદો"
  },
  "Handle issues, track progress, keep tenants happy.": {
    "hi": "समस्याएँ दर्ज करें और समाधान की प्रगति देखें।",
    "gu": "સમસ્યાઓ નોંધો અને ઉકેલની પ્રગતિ જુઓ."
  },
  "Reports & Accounting": {
    "hi": "रिपोर्ट और हिसाब",
    "gu": "રિપોર્ટ અને હિસાબ"
  },
  "Get insights with detailed reports and analytics.": {
    "hi": "विस्तृत रिपोर्ट से कारोबार का हिसाब देखें।",
    "gu": "વિગતવાર રિપોર્ટથી વ્યવસાયનો હિસાબ જુઓ."
  },
  "FOR PROPERTY OWNERS": {
    "hi": "संपत्ति मालिकों के लिए",
    "gu": "મિલકત માલિકો માટે"
  },
  "Manage Your Properties with Ease": {
    "hi": "अपनी संपत्ति आसानी से सँभालें",
    "gu": "તમારી મિલકત સરળતાથી સંભાળો"
  },
  "List & manage multiple properties & rooms": {
    "hi": "कई संपत्तियाँ और कमरे जोड़ें व सँभालें",
    "gu": "અનેક મિલકતો અને રૂમ ઉમેરો અને સંભાળો"
  },
  "Track rent payments, invoices & expenses": {
    "hi": "किराया, बिल और खर्च का हिसाब रखें",
    "gu": "ભાડું, બિલ અને ખર્ચનો હિસાબ રાખો"
  },
  "Manage tenants & staff with role permissions": {
    "hi": "किरायेदार और स्टाफ की भूमिकाएँ सँभालें",
    "gu": "ભાડુઆત અને સ્ટાફની ભૂમિકાઓ સંભાળો"
  },
  "Handle maintenance & complaints smoothly": {
    "hi": "रखरखाव और शिकायतें आसानी से सँभालें",
    "gu": "જાળવણી અને ફરિયાદો સરળતાથી સંભાળો"
  },
  "Get detailed reports & profit accounting": {
    "hi": "विस्तृत रिपोर्ट और लाभ का हिसाब पाएँ",
    "gu": "વિગતવાર રિપોર્ટ અને નફાનો હિસાબ મેળવો"
  },
  "FOR TENANTS": {
    "hi": "किरायेदारों के लिए",
    "gu": "ભાડુઆતો માટે"
  },
  "Find Your Perfect Stay": {
    "hi": "अपनी पसंद की जगह खोजें",
    "gu": "તમારી પસંદની જગ્યા શોધો"
  },
  "Search verified properties & listings": {
    "hi": "सत्यापित प्रॉपर्टी और लिस्टिंग खोजें",
    "gu": "ચકાસેલી મિલકતો અને લિસ્ટિંગ શોધો"
  },
  "Book & pay online with 0% brokerage": {
    "hi": "ऑनलाइन बुकिंग और भुगतान करें",
    "gu": "ઓનલાઇન બુકિંગ અને ચુકવણી કરો"
  },
  "Submit Aadhaar KYC and eSign agreement": {
    "hi": "पहचान के दस्तावेज़ और अनुबंध जमा करें",
    "gu": "ઓળખના દસ્તાવેજો અને કરાર સબમિટ કરો"
  },
  "Download receipts & track payments": {
    "hi": "रसीदें डाउनलोड करें और भुगतान देखें",
    "gu": "રસીદો ડાઉનલોડ કરો અને ચુકવણી જુઓ"
  },
  "Raise complaints & get quick support": {
    "hi": "शिकायत दर्ज करें और सहायता पाएँ",
    "gu": "ફરિયાદ નોંધો અને સહાય મેળવો"
  },
  "RETAIL & DOCUMENTATION": {
    "hi": "दुकान और दस्तावेज़ सेवाएँ",
    "gu": "દુકાન અને દસ્તાવેજ સેવાઓ"
  },
  "Kiosk Login for Shops": {
    "hi": "दुकान के लिए कियोस्क लॉग इन",
    "gu": "દુકાન માટે કિયોસ્ક લૉગ ઇન"
  },
  "Manage Rentals & Agreements at Your Shop": {
    "hi": "दुकान से किराया और अनुबंध सँभालें",
    "gu": "દુકાનથી ભાડું અને કરાર સંભાળો"
  },
  "Quick tenant registration": {
    "hi": "किरायेदार पंजीकरण",
    "gu": "ભાડુઆત નોંધણી"
  },
  "Agreement generation & e-stamp": {
    "hi": "अनुबंध का विवरण और दस्तावेज़",
    "gu": "કરારની વિગતો અને દસ્તાવેજો"
  },
  "еSign & document upload": {
    "hi": "दस्तावेज़ अपलोड",
    "gu": "દસ્તાવેજો અપલોડ"
  },
  "Print receipts & invoices": {
    "hi": "रसीदें और बिल प्रिंट करें",
    "gu": "રસીદો અને બિલ પ્રિન્ટ કરો"
  },
  "Kiosk Login": {
    "hi": "कियोस्क लॉग इन",
    "gu": "કિયોસ્ક લૉગ ઇન"
  },
  "PARTNER NETWORK": {
    "hi": "पार्टनर नेटवर्क",
    "gu": "પાર્ટનર નેટવર્ક"
  },
  "Kiosk Login for Minimum Brokerage": {
    "hi": "पार्टनर कियोस्क लॉग इन",
    "gu": "પાર્ટનર કિયોસ્ક લૉગ ઇન"
  },
  "Low Brokerage • High Convenience": {
    "hi": "आसान किराया प्रबंधन",
    "gu": "સરળ ભાડા સંચાલન"
  },
  "Manage properties & tenants": {
    "hi": "संपत्ति और किरायेदार सँभालें",
    "gu": "મિલકત અને ભાડુઆત સંભાળો"
  },
  "Digital agreement & eSign": {
    "hi": "डिजिटल अनुबंध और दस्तावेज़",
    "gu": "ડિજિટલ કરાર અને દસ્તાવેજો"
  },
  "Track commission earnings": {
    "hi": "कमीशन का हिसाब देखें",
    "gu": "કમિશનનો હિસાબ જુઓ"
  },
  "Easy dashboard access": {
    "hi": "आसान डैशबोर्ड एक्सेस",
    "gu": "સરળ ડેશબોર્ડ એક્સેસ"
  },
  "Your data, your privacy. We follow industry best practices to keep your information safe.": {
    "hi": "अपने दस्तावेज़ और जानकारी अपने खाते में सँभालें।",
    "gu": "તમારા દસ્તાવેજો અને માહિતી તમારા ખાતામાં સંભાળો."
  },
  "KYC Verification": {
    "hi": "पहचान सत्यापन",
    "gu": "ઓળખ ચકાસણી"
  },
  "Verified identity for all parties": {
    "hi": "पहचान के दस्तावेज़ों की जाँच",
    "gu": "ઓળખના દસ્તાવેજોની ચકાસણી"
  },
  "Data Encryption": {
    "hi": "डेटा सुरक्षा",
    "gu": "ડેટા સુરક્ષા"
  },
  "Bank-grade security standards": {
    "hi": "सुरक्षित खाता एक्सेस",
    "gu": "સુરક્ષિત ખાતા એક્સેસ"
  },
  "Secure Payments": {
    "hi": "सुरक्षित भुगतान",
    "gu": "સુરક્ષિત ચુકવણી"
  },
  "Encrypted UPI & card processing": {
    "hi": "UPI और कार्ड भुगतान",
    "gu": "UPI અને કાર્ડ ચુકવણી"
  },
  "Legal Compliance": {
    "hi": "अनुबंध प्रबंधन",
    "gu": "કરાર સંચાલન"
  },
  "As per Indian rental laws": {
    "hi": "दस्तावेज़ और अनुबंध एक साथ",
    "gu": "દસ્તાવેજો અને કરાર સાથે"
  },
  "Ready to get started?": {
    "hi": "शुरू करने के लिए तैयार हैं?",
    "gu": "શરૂ કરવા તૈયાર છો?"
  },
  "Join thousands of property owners and tenants who trust eRentKarar across India.": {
    "hi": "अपने किराये का प्रबंधन eRentKarar पर शुरू करें।",
    "gu": "તમારા ભાડાનું સંચાલન eRentKarar પર શરૂ કરો."
  },
  "Get Started Free →": {
    "hi": "खाता बनाएँ →",
    "gu": "ખાતું બનાવો →"
  },
  "Watch Demo": {
    "hi": "डेमो देखें",
    "gu": "ડેમો જુઓ"
  },
  "Find answers to common questions about our rental ecosystem.": {
    "hi": "किराया प्रबंधन से जुड़े सामान्य सवालों के जवाब पाएँ।",
    "gu": "ભાડા સંચાલનના સામાન્ય પ્રશ્નોના જવાબ મેળવો."
  },
  "How does eRentKarar Rental SaaS help property owners?": {
    "hi": "मालिकों को Rental OS से कैसे मदद मिलती है?",
    "gu": "માલિકોને Rental OSથી કેવી રીતે મદદ મળે છે?"
  },
  "What documents are required for tenant verification?": {
    "hi": "किरायेदार के कौन से दस्तावेज़ चाहिए?",
    "gu": "ભાડુઆતના કયા દસ્તાવેજો જોઈએ?"
  },
  "How is rent collected and settled?": {
    "hi": "किराये का भुगतान कैसे सँभालें?",
    "gu": "ભાડાની ચુકવણી કેવી રીતે સંભાળવી?"
  },
  "Can I manage multiple properties and buildings?": {
    "hi": "क्या कई संपत्तियाँ सँभाल सकते हैं?",
    "gu": "શું અનેક મિલકતો સંભાળી શકાય?"
  },
  "Can I try the platform before subscribing?": {
    "hi": "शुरू करने से पहले डेमो देख सकते हैं?",
    "gu": "શરૂ કરતાં પહેલાં ડેમો જોઈ શકાય?"
  },
  "What are the brokerage charges?": {
    "hi": "ब्रोकरेज शुल्क क्या हैं?",
    "gu": "બ્રોકરેજ શુલ્ક શું છે?"
  },
  "Is there a mobile app for tenants and managers?": {
    "hi": "मोबाइल पर इस्तेमाल कर सकते हैं?",
    "gu": "મોબાઇલ પર ઉપયોગ કરી શકાય?"
  },
  "Rental tools": {
    "hi": "किराये के टूल्स",
    "gu": "ભાડાના ટૂલ્સ"
  },
  "Rent receipts": {
    "hi": "किराये की रसीदें",
    "gu": "ભાડાની રસીદો"
  },
  "Electricity calculator": {
    "hi": "बिजली कैलकुलेटर",
    "gu": "વીજળી કેલ્ક્યુલેટર"
  },
  "Tenant verification form": {
    "hi": "किरायेदार सत्यापन फ़ॉर्म",
    "gu": "ભાડુઆત ચકાસણી ફોર્મ"
  },
  "Deposit settlement": {
    "hi": "जमा राशि का हिसाब",
    "gu": "ડિપોઝિટનો હિસાબ"
  },
  "Tenant portal": {
    "hi": "किरायेदार पोर्टल",
    "gu": "ભાડુઆત પોર્ટલ"
  },
  "Manage properties, rooms, beds, tenants, rent records, expenses and maintenance from your owner dashboard.": {
    "hi": "मालिक डैशबोर्ड से प्रॉपर्टी, कमरे, बेड, किरायेदार, किराया, खर्च और रखरखाव सँभालें।",
    "gu": "માલિક ડેશબોર્ડથી મિલકત, રૂમ, બેડ, ભાડુઆત, ભાડું, ખર્ચ અને જાળવણી સંભાળો."
  },
  "Requirements depend on the property and service. Upload clear identity and supporting proofs requested in your application. Your manager or our team reviews them.": {
    "hi": "दस्तावेज़ प्रॉपर्टी और सेवा पर निर्भर हैं। फ़ॉर्म में माँगे गए पहचान और अन्य प्रमाण स्पष्ट रूप से अपलोड करें। मैनेजर या टीम उनकी समीक्षा करेगी।",
    "gu": "દસ્તાવેજો મિલકત અને સેવા પર આધારિત છે. ફોર્મમાં માગેલા ઓળખ અને અન્ય પુરાવા સ્પષ્ટ રીતે અપલોડ કરો. મેનેજર કે ટીમ સમીક્ષા કરશે."
  },
  "Use your rental dashboard to follow invoices, recorded payments and receipts. Available payment methods and settlement details are shown in the relevant payment flow.": {
    "hi": "डैशबोर्ड में किराये के बिल, दर्ज भुगतान और रसीदें देखें। भुगतान के तरीके और सेटलमेंट का विवरण संबंधित भुगतान प्रक्रिया में दिखेगा।",
    "gu": "ડેશબોર્ડમાં ભાડાના બિલ, નોંધેલી ચુકવણી અને રસીદો જુઓ. ચુકવણીના વિકલ્પો અને સેટલમેન્ટની વિગતો સંબંધિત પ્રક્રિયામાં દેખાશે."
  },
  "Yes. Organise your properties into buildings, floors, rooms and beds, and manage tenants and staff access from your organisation dashboard.": {
    "hi": "हाँ। प्रॉपर्टी को बिल्डिंग, मंज़िल, कमरे और बेड में व्यवस्थित करें; संगठन के डैशबोर्ड से किरायेदार और स्टाफ का एक्सेस सँभालें।",
    "gu": "હા. મિલકતને બિલ્ડિંગ, માળ, રૂમ અને બેડમાં ગોઠવો; સંસ્થાના ડેશબોર્ડથી ભાડુઆત અને સ્ટાફનો એક્સેસ સંભાળો."
  },
  "Switch to Rental Agreement, enter your details, upload proofs and pay. Our admin verifies the documents, assigns a city legal partner and approves the prepared document before PDF or courier delivery.": {
    "hi": "Rental Agreement पर जाएँ, विवरण भरें, प्रमाण अपलोड करें और भुगतान करें। एडमिन दस्तावेज़ जाँचकर शहर के कानूनी पार्टनर को काम सौंपता है और PDF या कुरियर डिलीवरी से पहले तैयार अनुबंध स्वीकृत करता है।",
    "gu": "Rental Agreement પર જાઓ, વિગતો ભરો, પુરાવા અપલોડ કરો અને ચુકવણી કરો. એડમિન દસ્તાવેજો ચકાસીને શહેરના કાનૂની પાર્ટનરને કામ સોંપે છે અને PDF કે કુરિયર ડિલિવરી પહેલાં તૈયાર કરાર મંજૂર કરે છે."
  },
  "Use the walkthrough or Watch Demo to explore the interface. Contact our team to confirm the plan and services suitable for your properties.": {
    "hi": "इंटरफ़ेस समझने के लिए walkthrough या डेमो देखें। अपनी प्रॉपर्टी के लिए योजना और सेवाओं की पुष्टि टीम से करें।",
    "gu": "ઇન્ટરફેસ સમજવા walkthrough કે ડેમો જુઓ. તમારી મિલકત માટે યોજના અને સેવાઓની પુષ્ટિ ટીમ સાથે કરો."
  },
  "Check the listing and payment breakdown for applicable charges before booking. Agreement service and optional delivery charges are shown separately during agreement checkout.": {
    "hi": "बुकिंग से पहले लिस्टिंग और भुगतान विवरण में लागू शुल्क देखें। अनुबंध की सेवा और वैकल्पिक डिलीवरी का शुल्क अनुबंध भुगतान में अलग दिखता है।",
    "gu": "બુકિંગ પહેલાં લિસ્ટિંગ અને ચુકવણી વિગતોમાં લાગુ શુલ્ક જુઓ. કરારની સેવા અને વૈકલ્પિક ડિલિવરીનો શુલ્ક કરાર ચુકવણીમાં અલગ દેખાય છે."
  },
  "You can use the responsive website in a mobile browser to browse properties and access your owner or tenant portal.": {
    "hi": "मोबाइल ब्राउज़र में वेबसाइट से प्रॉपर्टी खोजें और मालिक या किरायेदार पोर्टल खोलें।",
    "gu": "મોબાઇલ બ્રાઉઝરમાં વેબસાઇટથી મિલકતો શોધો અને માલિક કે ભાડુઆત પોર્ટલ ખોલો."
  },
  "How do I create a rental agreement?": {
    "hi": "किराया अनुबंध कैसे बनाएँ?",
    "gu": "ભાડા કરાર કેવી રીતે બનાવવો?"
  },
  "Identity & agreements": {
    "hi": "पहचान और अनुबंध",
    "gu": "ઓળખ અને કરાર"
  },
  "Manage identity proofs and rental agreements.": {
    "hi": "पहचान के दस्तावेज़ और किराया अनुबंध सँभालें।",
    "gu": "ઓળખના દસ્તાવેજો અને ભાડા કરાર સંભાળો."
  },
  "Upload identity proofs and start your rental agreement.": {
    "hi": "पहचान के दस्तावेज़ दें और किराया अनुबंध शुरू करें।",
    "gu": "ઓળખના દસ્તાવેજો આપો અને ભાડા કરાર શરૂ કરો."
  },
  "Submit identity proofs and agreement documents": {
    "hi": "पहचान के दस्तावेज़ और अनुबंध जमा करें",
    "gu": "ઓળખના દસ્તાવેજો અને કરાર સબમિટ કરો"
  },
  "Agreement details & documents": {
    "hi": "अनुबंध का विवरण और दस्तावेज़",
    "gu": "કરારની વિગતો અને દસ્તાવેજો"
  },
  "Digital agreement & documents": {
    "hi": "डिजिटल अनुबंध और दस्तावेज़",
    "gu": "ડિજિટલ કરાર અને દસ્તાવેજો"
  },
  "Document upload": {
    "hi": "दस्तावेज़ अपलोड",
    "gu": "દસ્તાવેજો અપલોડ"
  },
  "More": {
    "hi": "और विकल्प",
    "gu": "વધુ વિકલ્પો"
  },
  "Get started": {
    "hi": "शुरू करें",
    "gu": "શરૂ કરો"
  },
  "Dashboard": {
    "hi": "डैशबोर्ड",
    "gu": "ડેશબોર્ડ"
  },
  "Sign out": {
    "hi": "लॉग आउट",
    "gu": "લૉગ આઉટ"
  },
  "Features": {
    "hi": "सुविधाएँ",
    "gu": "સુવિધાઓ"
  },
  "Solutions": {
    "hi": "समाधान",
    "gu": "ઉકેલો"
  },
  "Renew agreement": {
    "hi": "अनुबंध नवीनीकरण",
    "gu": "કરાર નવીનીકરણ"
  },
  "Existing agreement": {
    "hi": "मौजूदा अनुबंध",
    "gu": "હાલનો કરાર"
  },
  "Kiosk portal": {
    "hi": "कियोस्क पोर्टल",
    "gu": "કિયોસ્ક પોર્ટલ"
  },
  "Agreement AI": {
    "hi": "अनुबंध AI",
    "gu": "કરાર AI"
  }
};
export function useStorefrontCopy() { const {lang} = useLanguage(); return (text: string) => lang === "en" ? text : copy[text]?.[lang] || text; }
