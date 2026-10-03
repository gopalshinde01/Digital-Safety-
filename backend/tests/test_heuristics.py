import pytest
from app.services.heuristic_engine import scan_heuristics

def test_electricity_scam_heuristics():
    msg = "Dear consumer your electricity power will be disconnected tonight at 9:30 PM call electricity officer at 9876543210 immediately."
    flags, score = scan_heuristics(msg)
    assert len(flags) >= 2
    categories = [f.category for f in flags]
    assert "urgency" in categories
    assert score >= 50

def test_upi_pin_fraud_heuristics():
    msg = "Approved Rs 5000 cashback! Enter your 6-digit UPI PIN to receive money directly in bank."
    flags, score = scan_heuristics(msg)
    categories = [f.category for f in flags]
    assert "upi_trap" in categories
    assert score >= 50

def test_malware_apk_heuristics():
    msg = "Update your SBI NetBanking. Download and install SBI-Update.apk now to restore service."
    flags, score = scan_heuristics(msg)
    categories = [f.category for f in flags]
    assert "malware_apk" in categories
    assert score >= 50

def test_benign_message_heuristics():
    msg = "Hey Rahul, let's meet at 5 PM near the coffee shop."
    flags, score = scan_heuristics(msg)
    assert len(flags) == 0
    assert score == 0
