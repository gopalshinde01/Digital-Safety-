import re
from typing import List, Dict, Any, Tuple
from app.schemas.analysis import RedFlagItem

# High-impact heuristic rule patterns
THREAT_PATTERNS = [
    # 1. Urgent Time Coercion / Service Cutoff
    {
        "category": "urgency",
        "pattern": r"(?:disconnected tonight|power (?:cut|supply cut)|will be disconnected|suspended (?:today|within \d+ hours)|account (?:has been |is )?(?:blocked|frozen|deactivated|suspended)|immediate(?:ly)? contact|urgent(?:ly)?|within 24 hours|deadline)",
        "explanation": "High-pressure urgency forces victims to panic and act impulsively without verifying legitimacy.",
        "severity": "high",
        "weight": 35
    },
    # 2. UPI PIN Deception Trap (Crucial for India)
    {
        "category": "upi_trap",
        "pattern": r"(?:enter (?:your )?(?:\d-digit )?UPI PIN (?:to )?(?:receive|claim|accept|get|approve)|receive money.*(?:enter.*pin|upi)|approve refund.*pin|cashback.*(?:enter.*pin|claim)|refund.*google ?pay|phonepe.*cashback|paytm.*refund)",
        "explanation": "CRITICAL FRAUD: You NEVER need to enter a UPI PIN to receive money or cashback. Entering your PIN transfers money OUT of your account.",
        "severity": "critical",
        "weight": 55
    },
    # 3. Fake KYC / PAN Expiry Phishing
    {
        "category": "credential_harvesting",
        "pattern": r"(?:update (?:your )?PAN (?:card)?|KYC (?:document )?(?:has )?expired|incomplete KYC|Aadhaar (?:verification|linkage)|restor(?:e|ing) service.*(?:pan|kyc)|reward points.*expir(?:e|ing))",
        "explanation": "Banks and utility providers in India NEVER send SMS links or APKs to update KYC or PAN details.",
        "severity": "high",
        "weight": 40
    },
    # 4. Malicious APK / Remote Access Trojan
    {
        "category": "malware_apk",
        "pattern": r"(?:\.apk|download.*(?:app|apk)|install.*(?:anydesk|teamviewer|rustdesk|quicksupport)|screen-?sharing|verification app)",
        "explanation": "Requests to sideload APK files or remote-control tools (AnyDesk/TeamViewer) allow scammers to read OTPs and drain bank accounts.",
        "severity": "critical",
        "weight": 50
    },
    # 5. Work-from-Home / Part-Time Task Fraud
    {
        "category": "job_scam",
        "pattern": r"(?:part-?time (?:online )?job|earn Rs\.?\s?\d+.*(?:daily|per day)|rating hotels|liking (?:youtube )?videos|vip investment channel|work from home.*(?:housewives|students)|telegram.*@)",
        "explanation": "Classic Task/Telegram Ponzi scam. Initial small payouts lure victims into paying large 'prepaid task' sums that cannot be withdrawn.",
        "severity": "high",
        "weight": 35
    },
    # 6. Digital Arrest / Law Enforcement Extortion
    {
        "category": "extortion",
        "pattern": r"(?:seized by.*customs|arrest warrant|money laundering|narcotics.*mdma|customs department|delhi police.*crime branch|skype.*verification|digital arrest|fir (?:registered|filed))",
        "explanation": "Indian law enforcement, CBI, and Customs NEVER conduct arrests over Skype/WhatsApp video calls or demand security deposits.",
        "severity": "critical",
        "weight": 50
    },
    # 7. Lottery & Unrealistic Rewards
    {
        "category": "lottery_prize",
        "pattern": r"(?:won (?:Rs\.?\s?)?\d+.*(?:lakhs|crore)|kbc.*lucky draw|kaun banega crorepati|lottery code|registration fee.*claim|guaranteed \d+% profit)",
        "explanation": "Fabricated lottery wins requiring advance registration/processing fees are advance-fee fraud.",
        "severity": "high",
        "weight": 40
    },
    # 8. Unofficial Support Contact Numbers
    {
        "category": "contact_spoofing",
        "pattern": r"(?:(?:call|contact|whatsapp)\s+(?:electricity officer|power officer|officer|manager|helpdesk)?\s*(?:at|on)?\s*(?:\+91|91)?\s*[6-9]\d{9})",
        "explanation": "Electricity boards and banks use official 1800 toll-free lines or shortcodes, never personal 10-digit mobile numbers.",
        "severity": "medium",
        "weight": 30
    }
]

def scan_heuristics(text: str) -> Tuple[List[RedFlagItem], int]:
    """
    Scans input text against cybersecurity heuristics.
    Returns (List of RedFlagItems, Heuristic Risk Score 0-100).
    """
    red_flags: List[RedFlagItem] = []
    total_score = 0
    matched_categories = set()

    for item in THREAT_PATTERNS:
        matches = re.finditer(item["pattern"], text, re.IGNORECASE)
        for match in matches:
            matched_phrase = match.group(0).strip()
            cat = item["category"]
            
            # Avoid repeating exact same category & phrase
            if not any(f.phrase.lower() == matched_phrase.lower() for f in red_flags):
                red_flags.append(RedFlagItem(
                    phrase=matched_phrase,
                    category=cat,
                    explanation=item["explanation"],
                    severity=item["severity"]
                ))
                
                if cat not in matched_categories:
                    total_score += item["weight"]
                    matched_categories.add(cat)
                    
    # Cap total score at 100
    capped_score = min(100, total_score)
    return red_flags, capped_score
