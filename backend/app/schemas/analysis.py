from pydantic import BaseModel, Field
from typing import List, Optional, Dict

class AnalysisRequest(BaseModel):
    text: str = Field(..., description="Message text or OCR extracted content", min_length=2)
    language: str = Field("en", description="Target language: 'en', 'hi', or 'mr'")
    family_mode: bool = Field(False, description="Flag for elder-friendly simplified explanations")
    region: str = Field("india", description="Emergency helpline context: 'india' or 'global'")

class RedFlagItem(BaseModel):
    phrase: str
    category: str
    explanation: str
    severity: str = "high"  # low, medium, high

class LinkAnalysis(BaseModel):
    url: str
    domain: str
    is_suspicious: bool
    is_shortened: bool
    is_ip_address: bool
    has_typosquatting: bool
    typosquat_target: Optional[str] = None
    tld: str
    tld_risk: str  # safe, risky, dangerous
    details: List[str]

class AnalysisResponse(BaseModel):
    verdict: str  # Safe, Suspicious, Scam
    risk_score: int  # 0 to 100
    risk_level: str  # Low, Medium, High
    summary: str
    highlighted_phrases: List[RedFlagItem]
    link_analysis: List[LinkAnalysis]
    recommended_actions: List[str]
    what_not_to_do: List[str]
    emergency_helplines: Dict[str, str]
    family_mode_summary: Optional[str] = None
    ml_scam_probability: float
    heuristic_score: int
    analyzed_at: str
    language: str
    ai_provider: str

class OCRRequest(BaseModel):
    image_base64: str = Field(..., description="Base64 encoded image string")
    language: str = "en"

class OCRResponse(BaseModel):
    extracted_text: str
    confidence: float
    provider: str

class StatsResponse(BaseModel):
    total_scams_analyzed_today: int
    top_scam_types: List[Dict[str, str]]
    scam_of_the_week: Dict[str, str]
    model_metrics: Dict[str, float]
