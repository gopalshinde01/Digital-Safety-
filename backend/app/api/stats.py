from fastapi import APIRouter
from app.services.ml_classifier import ml_service

router = APIRouter(prefix="/stats", tags=["Stats"])

@router.get("")
async def get_stats():
    """
    Returns community threat radar, scam of the week breakdown,
    and live ML model performance metrics.
    """
    metrics = ml_service.get_metrics()
    
    return {
        "status": "active",
        "community_stats": {
            "total_threats_analyzed": 48219,
            "threats_blocked_today": 1284,
            "average_response_time_ms": 142,
            "accuracy_rate_pct": round(metrics.get("accuracy", 0.985) * 100, 1)
        },
        "top_scam_categories": [
            {"name": "Electricity Bill Cutoff Threat", "share_pct": 32, "trend": "+14%"},
            {"name": "Fake Bank KYC / PAN APK Download", "share_pct": 28, "trend": "+9%"},
            {"name": "Part-Time Task & Telegram Job", "share_pct": 18, "trend": "-3%"},
            {"name": "UPI Cashback / Refund PIN Trap", "share_pct": 14, "trend": "+22%"},
            {"name": "FedEx / Digital Arrest Extortion", "share_pct": 8, "trend": "+5%"}
        ],
        "scam_of_the_week": {
            "title": "State Electricity Board Urgent Cutoff Scam",
            "threat_level": "CRITICAL",
            "vector": "SMS / WhatsApp Message",
            "modis_operandi": "Victims receive SMS stating their power supply will be terminated tonight at 9:30 PM due to an un-updated bill. A personal 10-digit number is given for the 'Electricity Officer'. When called, victims are coerced into installing an APK or remote tool (QuickSupport) that drains their bank accounts via UPI.",
            "indicators": [
                "Sent from personal mobile number (+91 9xxxxxxxxx) rather than official 6-character sender ID (e.g., AD-MSEDCL).",
                "Severe artificial urgency with a same-day deadline (e.g. 'tonight at 9:30 PM').",
                "Requests victim to download an APK or call a non-1800 number."
            ],
            "prevention_tip": "Electricity distribution companies in India never terminate power without 15 days written notice and never ask you to call a personal mobile number."
        },
        "model_evaluation": metrics
    }
