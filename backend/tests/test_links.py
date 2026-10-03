import pytest
from app.services.link_analyzer import analyze_link, evaluate_all_links

def test_typosquatting_detection():
    analysis = analyze_link("http://sbi-kyc-verify.xyz/update")
    assert analysis.has_typosquatting is True
    assert "SBI" in (analysis.typosquat_target or "")
    assert analysis.tld_risk == "dangerous"
    assert analysis.is_suspicious is True

def test_url_shortener_detection():
    analysis = analyze_link("https://bit.ly/claim-reward-now")
    assert analysis.is_shortened is True
    assert analysis.is_suspicious is True

def test_raw_ip_detection():
    analysis = analyze_link("http://192.168.1.105:8080/login.php")
    assert analysis.is_ip_address is True
    assert analysis.is_suspicious is True

def test_official_domain_safe():
    analysis = analyze_link("https://onlinesbi.sbi/portal/index.html")
    assert analysis.has_typosquatting is False
    assert analysis.is_suspicious is False

def test_apk_in_url():
    analysis = analyze_link("http://paytm-security.live/download/app.apk")
    assert any(".apk" in d.lower() for d in analysis.details)
    assert analysis.is_suspicious is True
