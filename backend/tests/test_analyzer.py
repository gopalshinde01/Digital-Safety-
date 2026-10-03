import pytest
from app.schemas.analysis import AnalysisRequest
from app.services.analyzer_service import analyzer_service

def test_full_pipeline_scam_detection():
    req = AnalysisRequest(
        text="Dear customer your electricity power will be disconnected tonight at 9:30 PM call 9876543210 or visit http://electricity-bill-pay.xyz/bill.apk",
        language="en",
        region="india"
    )
    res = analyzer_service.analyze(req)
    assert res.verdict == "Scam"
    assert res.risk_score >= 80
    assert len(res.highlighted_phrases) > 0
    assert len(res.link_analysis) > 0
    assert "1930" in res.emergency_helplines.values() or "1930" in str(res.emergency_helplines)

def test_full_pipeline_safe_detection():
    req = AnalysisRequest(
        text="Hi team, the project sync has been moved to 3 PM tomorrow. See you all in the conference room.",
        language="en",
        region="india"
    )
    res = analyzer_service.analyze(req)
    assert res.verdict == "Safe"
    assert res.risk_score <= 30
    assert len(res.highlighted_phrases) == 0

def test_hindi_localization():
    req = AnalysisRequest(
        text="Enter your UPI PIN to claim Rs 5000 cashback immediately: http://cashback-paytm.top",
        language="hi",
        region="india"
    )
    res = analyzer_service.analyze(req)
    assert res.verdict == "Scam"
    assert res.language == "hi"
    assert len(res.recommended_actions) > 0
    # Checks that Hindi text is returned
    assert any("पैसे" in act or "क्लिक" in act or "पिन" in act or "UPI" in act for act in res.recommended_actions)

def test_marathi_localization():
    req = AnalysisRequest(
        text="Your account is blocked. Update PAN card now: http://sbi-verify.xyz",
        language="mr",
        region="india"
    )
    res = analyzer_service.analyze(req)
    assert res.language == "mr"
    assert res.verdict == "Scam"
    assert any("क्लिक" in act or "पैसे" in act or "तपासा" in act for act in res.recommended_actions)
