import re
from urllib.parse import urlparse
from typing import List, Dict, Any, Tuple
from app.schemas.analysis import LinkAnalysis

SUSPICIOUS_TLDS = {
    ".xyz", ".top", ".tk", ".ml", ".ga", ".cf", ".gq", ".buzz", ".icu",
    ".download", ".work", ".site", ".vip", ".click", ".link", ".online",
    ".live", ".info", ".rest", ".club", ".monster", ".space", ".cfd"
}

SHORTENED_DOMAINS = {
    "bit.ly", "tinyurl.com", "t.co", "is.gd", "cutt.ly", "rb.gy",
    "ow.ly", "rebrand.ly", "goo.gl", "tiny.cc", "soo.gd", "s.id"
}

TARGET_BRANDS = [
    ("sbi", "State Bank of India (SBI)"),
    ("hdfc", "HDFC Bank"),
    ("icici", "ICICI Bank"),
    ("axis", "Axis Bank"),
    ("pnb", "Punjab National Bank"),
    ("kotak", "Kotak Mahindra Bank"),
    ("paytm", "Paytm"),
    ("phonepe", "PhonePe"),
    ("gpay", "Google Pay"),
    ("googlepay", "Google Pay"),
    ("bhim", "BHIM UPI"),
    ("jio", "Reliance Jio"),
    ("airtel", "Bharti Airtel"),
    ("bsnl", "BSNL"),
    ("amazon", "Amazon"),
    ("flipkart", "Flipkart"),
    ("netflix", "Netflix"),
    ("electricity", "State Electricity Board"),
    ("mahavitaran", "Mahavitaran Power Corp"),
    ("bses", "BSES Delhi Power"),
    ("uppcl", "UP Power Corporation"),
    ("irctc", "IRCTC Indian Railways"),
    ("incometax", "Income Tax Department"),
    ("epfo", "EPFO Provident Fund")
]

OFFICIAL_DOMAINS = {
    "onlinesbi.sbi", "sbi.co.in", "hdfcbank.com", "icicibank.com",
    "axisbank.com", "pnbindia.in", "kotak.com", "paytm.com",
    "phonepe.com", "pay.google.com", "jio.com", "airtel.in",
    "amazon.in", "amazon.com", "flipkart.com", "netflix.com",
    "irctc.co.in", "incometax.gov.in", "epfindia.gov.in",
    "cybercrime.gov.in", "sancharsaathi.gov.in", "cowin.gov.in"
}

URL_REGEX = re.compile(
    r"(?:https?://|www\.)[a-zA-Z0-9.\-_]+(?:\.[a-zA-Z]{2,})+(?:/[^\s]*)?",
    re.IGNORECASE
)

IP_REGEX = re.compile(
    r"^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(?::\d+)?$"
)

def extract_urls(text: str) -> List[str]:
    """Finds all URLs and naked domains in text."""
    matches = URL_REGEX.findall(text)
    # Also find loose domains with known extensions like bit.ly/abc or sbi-pan.xyz
    loose_regex = re.compile(r"\b([a-zA-Z0-9-]+\.(?:xyz|top|tk|live|online|site|icu|buzz|apk|link|info)(?:/[^\s]*)?)\b", re.IGNORECASE)
    loose_matches = loose_regex.findall(text)
    
    all_urls = []
    for m in matches + loose_matches:
        url = m.strip(".,;:()[]{}'\"")
        if not url.startswith("http://") and not url.startswith("https://"):
            url = "http://" + url
        if url not in all_urls:
            all_urls.append(url)
    return all_urls

def analyze_link(url: str) -> LinkAnalysis:
    parsed = urlparse(url)
    netloc = parsed.netloc.lower().split(":")[0]
    path = parsed.path.lower()
    
    # Check IP
    is_ip = bool(IP_REGEX.match(netloc))
    
    # Check Shortener
    is_shortened = any(netloc == short or netloc.endswith("." + short) for short in SHORTENED_DOMAINS)
    
    # Check Suspicious TLD
    tld_match = None
    for tld in SUSPICIOUS_TLDS:
        if netloc.endswith(tld):
            tld_match = tld
            break
            
    tld_risk = "safe"
    if tld_match:
        tld_risk = "dangerous"
    elif netloc.endswith(".gov.in") or netloc.endswith(".nic.in") or netloc.endswith(".edu"):
        tld_risk = "safe"
    else:
        tld_parts = netloc.split(".")
        tld_match = "." + tld_parts[-1] if len(tld_parts) > 1 else ""

    # Check Typosquatting / Brand Impersonation
    has_typosquatting = False
    target_brand_name = None
    
    is_official = netloc in OFFICIAL_DOMAINS or any(netloc.endswith("." + off) for off in OFFICIAL_DOMAINS)
    
    if not is_official:
        for brand_key, brand_label in TARGET_BRANDS:
            # If domain contains brand name but is NOT the official domain
            if brand_key in netloc or brand_key in path:
                has_typosquatting = True
                target_brand_name = brand_label
                break

    details = []
    is_suspicious = False

    if is_ip:
        is_suspicious = True
        details.append("Host is a direct raw IP address instead of a legitimate registered domain name.")

    if is_shortened:
        is_suspicious = True
        details.append("Link is obfuscated through a URL shortener to hide the real destination.")

    if tld_risk == "dangerous":
        is_suspicious = True
        details.append(f"Domain uses high-risk Top Level Domain '{tld_match}' commonly associated with throwaway phishing campaigns.")

    if has_typosquatting:
        is_suspicious = True
        details.append(f"Domain appears to impersonate or look like '{target_brand_name}', but is not hosted on an official domain.")

    if path.endswith(".apk") or ".apk" in path:
        is_suspicious = True
        details.append("Direct download of an Android Application Package (.APK) detected. High risk of spyware, screen-mirroring, or banking trojan.")

    if "@" in parsed.netloc:
        is_suspicious = True
        details.append("URL contains '@' symbol, which web browsers interpret to redirect traffic, bypassing the displayed prefix.")

    if not is_suspicious and not is_official:
        details.append("Domain does not match known high-profile threat signatures, but verify independently before entering credentials.")
    elif is_official:
        details.append("Domain matches a verified official corporate or government portal.")

    return LinkAnalysis(
        url=url,
        domain=netloc,
        is_suspicious=is_suspicious,
        is_shortened=is_shortened,
        is_ip_address=is_ip,
        has_typosquatting=has_typosquatting,
        typosquat_target=target_brand_name,
        tld=tld_match or ".com",
        tld_risk=tld_risk,
        details=details
    )

def evaluate_all_links(text: str) -> Tuple[List[LinkAnalysis], int]:
    """Analyzes all links in text and returns (analyses, link_risk_score 0-100)"""
    urls = extract_urls(text)
    if not urls:
        return [], 0
        
    analyses = [analyze_link(u) for u in urls]
    
    score = 0
    for a in analyses:
        if a.is_ip_address:
            score += 35
        if a.has_typosquatting:
            score += 40
        if a.tld_risk == "dangerous":
            score += 30
        if a.is_shortened:
            score += 25
        if any(".apk" in d for d in a.details):
            score += 45
            
    # Normalize score to 0-100
    score = min(100, score)
    return analyses, score
