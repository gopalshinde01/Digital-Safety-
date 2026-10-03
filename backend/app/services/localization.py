from typing import Dict, List, Any

LOCALIZED_CONTENT: Dict[str, Dict[str, Any]] = {
    "en": {
        "verdicts": {
            "Safe": "Safe / Low Risk",
            "Suspicious": "Suspicious / Caution Advised",
            "Scam": "Confirmed Scam / High Risk"
        },
        "verdict_summaries": {
            "Safe": "No obvious scam indicators or deceptive patterns detected. The message appears to be standard communication.",
            "Suspicious": "Contains potential indicators of coercion, unsolicited urgency, or unrecognized links. Exercise caution before responding.",
            "Scam": "CRITICAL RISK: Multiple malicious indicators detected (coercive urgency, deceptive links, or financial entrapment). High probability of cyber fraud."
        },
        "family_mode": {
            "Safe": "✅ Everything looks okay. However, remember never to share secret passwords or banking OTPs with anyone.",
            "Suspicious": "⚠️ Please be careful. Do not click any links or send money until you verify with a family member.",
            "Scam": "🛑 DANGER — FRAUD ALERT! This message is trying to trick you. Do NOT click anything, do NOT enter your UPI PIN, and do NOT send any money. Immediately call your son, daughter, or a trusted family member to take a look."
        },
        "recommended_actions": [
            "Do not click on any links or download attached .APK files.",
            "Never enter your UPI PIN to receive money or accept refunds.",
            "Verify service status directly through the provider's official verified app or portal.",
            "Block the sender number and do not respond to threats or countdown timers.",
            "Report fraudulent messages to the Chakshu Portal (sancharsaathi.gov.in)."
        ],
        "what_not_to_do": [
            "DO NOT share OTPs, CVV, or NetBanking passwords with anyone claiming to be bank or electricity staff.",
            "DO NOT install remote-access apps like AnyDesk, TeamViewer, or RustDesk on request.",
            "DO NOT call back the 10-digit mobile number provided in the message body.",
            "DO NOT transfer money to 'verify' an account or claim lottery prizes."
        ],
        "helplines": {
            "National Cybercrime Helpline": "1930",
            "Cybercrime Reporting Portal": "https://cybercrime.gov.in",
            "Chakshu Suspected Fraud Reporting": "https://sancharsaathi.gov.in/sfc/",
            "National Consumer Helpline": "1915"
        },
        "global_helplines": {
            "US FBI Internet Crime Complaint Center (IC3)": "https://www.ic3.gov",
            "US FTC Fraud Reporting": "https://reportfraud.ftc.gov",
            "UK Action Fraud Helpline": "0300 123 2040",
            "Australia Scamwatch": "https://www.scamwatch.gov.au"
        }
    },
    "hi": {
        "verdicts": {
            "Safe": "सुरक्षित / कम जोखिम",
            "Suspicious": "संदिग्ध / सावधानी आवश्यक",
            "Scam": "पुष्ट धोखाधड़ी / उच्च जोखिम"
        },
        "verdict_summaries": {
            "Safe": "कोई स्पष्ट धोखाधड़ी या दुर्भावनापूर्ण पैटर्न नहीं मिला। यह संदेश सामान्य प्रतीत होता है।",
            "Suspicious": "इस संदेश में जल्दबाजी, दबाव या अपरिचित लिंक के संकेत हैं। कोई भी कदम उठाने से पहले जांच करें।",
            "Scam": "गंभीर जोखिम: इस संदेश में धोखाधड़ी, फर्जी लिंक या वित्तीय जाल के स्पष्ट संकेत पाए गए हैं। यह साइबर फ्रॉड है।"
        },
        "family_mode": {
            "Safe": "✅ यह संदेश सुरक्षित लग रहा है। फिर भी अपना पासवर्ड या OTP कभी किसी को न बताएं।",
            "Suspicious": "⚠️ कृपया सावधान रहें। किसी भी लिंक को न छुएं और परिवार के किसी सदस्य से पूछकर ही आगे बढ़ें।",
            "Scam": "🛑 खतरा — यह फ्रॉड है! यह मैसेज आपको ठगने के लिए भेजा गया है। किसी भी लिंक पर क्लिक न करें, UPI PIN बिल्कुल न डालें और तुरंत अपने बच्चों या किसी भरोसेमंद व्यक्ति को यह मैसेज दिखाएं।"
        },
        "recommended_actions": [
            "किसी भी लिंक पर क्लिक न करें और न ही कोई APK फाइल डाउनलोड करें।",
            "पैसे या रिफंड पाने के लिए कभी भी अपना UPI PIN न डालें।",
            "बिजली बिल या बैंक खाते की स्थिति केवल आधिकारिक ऐप या वेबसाइट पर जाकर ही जांचें।",
            "संदेश भेजने वाले नंबर को तुरंत ब्लॉक करें और किसी भी धमकी से न डरें।",
            "संदिग्ध नंबर की शिकायत दूरसंचार विभाग के 'चक्षु' (Chakshu) पोर्टल पर करें।"
        ],
        "what_not_to_do": [
            "बैंक या बिजली अधिकारी बताकर कॉल करने वाले किसी भी व्यक्ति को OTP या पासवर्ड न दें।",
            "किसी के कहने पर AnyDesk, TeamViewer या QuickSupport जैसी स्क्रीन-शेयरिंग ऐप डाउनलोड न करें।",
            "मैसेज में दिए गए 10 अंकों के व्यक्तिगत मोबाइल नंबर पर कॉल न करें।",
            "लॉटरी या इनाम का दावा करने के लिए कोई भी अग्रिम शुल्क न भेजें।"
        ],
        "helplines": {
            "राष्ट्रीय साइबर अपराध हेल्पलाइन": "1930",
            "साइबर अपराध रिपोर्टिंग पोर्टल": "https://cybercrime.gov.in",
            "चक्षु संदिग्ध धोखाधड़ी रिपोर्टिंग": "https://sancharsaathi.gov.in/sfc/",
            "राष्ट्रीय उपभोक्ता हेल्पलाइन": "1915"
        },
        "global_helplines": {
            "US FBI Internet Crime Center": "https://www.ic3.gov",
            "US FTC Fraud Reporting": "https://reportfraud.ftc.gov"
        }
    },
    "mr": {
        "verdicts": {
            "Safe": "सुरक्षित / कमी धोका",
            "Suspicious": "संशयास्पद / खबरदारी बाळगा",
            "Scam": "खात्रीशीर फसवणूक / मोठा धोका"
        },
        "verdict_summaries": {
            "Safe": "या मेसेजमध्ये कोणताही संशयास्पद किंवा फसवणुकीचा पॅटर्न आढळला नाही. हा सामान्य संदेश वाटतो.",
            "Suspicious": "या मेसेजमध्ये घाईगडबड, दबाव किंवा अनोळखी लिंकचे संकेत आहेत. पुढे जाण्यापूर्वी काळजीपूर्वक खात्री करा.",
            "Scam": "अतिधोकादायक: या संदेशामध्ये आर्थिक फसवणूक, बनावट लिंक किंवा धमकीचे स्पष्ट पुरावे आढळले आहेत. हा सायबर फ्रॉड आहे."
        },
        "family_mode": {
            "Safe": "✅ हा मेसेज ठीक वाटतो. तरीही आपला बँक पिन किंवा OTP कोणालाही सांगू नका.",
            "Suspicious": "⚠️ कृपया काळजी घ्या. कोणतीही लिंक उघडू नका आणि घरातील सदस्यांशी चर्चा करा.",
            "Scam": "🛑 मोठा धोका — हा फ्रॉड मेसेज आहे! हा मेसेज तुम्हाला फसवण्यासाठी आला आहे. कोणत्याही लिंकवर क्लिक करू नका, UPI PIN अजिबात टाकू नका आणि ताबडतोब घरातील मुले किंवा विश्वासू नातेवाईकांना हा मेसेज दाखवा."
        },
        "recommended_actions": [
            "कोणत्याही संशयास्पद लिंकवर क्लिक करू नका किंवा APK फाइल डाउनलोड करू नका.",
            "पैसे किंवा कॅशबॅक मिळवण्यासाठी कधीही तुमचा UPI PIN टाकू नका.",
            "महावितरण वीज बिल किंवा बँक खात्याची माहिती केवळ अधिकृत ॲप किंवा शाखेत जाऊन तपासा.",
            "मेसेज पाठवणाऱ्या नंबरला लगेच ब्लॉक करा आणि कोणत्याही धमकीला घाबरू नका.",
            "फसवणूक करणाऱ्या नंबरची तक्रार दूरसंचार विभागाच्या 'चक्षू' (Chakshu) पोर्टलवर करा."
        ],
        "what_not_to_do": [
            "बँक अधिकारी किंवा वीज कर्मचारी सांगणाऱ्या कोणालाही आपला OTP, पासवर्ड किंवा CVV देऊ नका.",
            "कोणाच्याही सांगण्यावरून AnyDesk, TeamViewer किंवा RustDesk ॲप इन्स्टॉल करू नका.",
            "मेसेजमध्ये दिलेल्या कोणत्याही मोबाईल नंबरवर परत फोन करू नका.",
            "लॉटरी किंवा बक्षीस मिळवण्यासाठी कोणतेही पैसे भरू नका."
        ],
        "helplines": {
            "राष्ट्रीय सायबर गुन्हे हेल्पलाइन": "1930",
            "सायबर क्राईम रिपोर्टिंग पोर्टल": "https://cybercrime.gov.in",
            "चक्षू संशयास्पद फसवणूक पोर्टल": "https://sancharsaathi.gov.in/sfc/",
            "राष्ट्रीय ग्राहक हेल्पलाइन": "1915"
        },
        "global_helplines": {
            "US FBI Internet Crime Center": "https://www.ic3.gov",
            "US FTC Fraud Reporting": "https://reportfraud.ftc.gov"
        }
    }
}

def get_localized_data(language: str = "en", region: str = "india") -> Dict[str, Any]:
    lang = language.lower() if language.lower() in LOCALIZED_CONTENT else "en"
    data = LOCALIZED_CONTENT[lang].copy()
    
    if region.lower() == "global":
        data["helplines"] = data.get("global_helplines", LOCALIZED_CONTENT["en"]["global_helplines"])
    
    return data
