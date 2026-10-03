from fastapi import APIRouter, HTTPException, Depends
from app.schemas.analysis import AnalysisRequest, AnalysisResponse
from app.services.analyzer_service import analyzer_service

router = APIRouter(prefix="/analyze", tags=["Analysis"])

@router.post("", response_model=AnalysisResponse)
async def analyze_message(request: AnalysisRequest):
    """
    Analyzes input text (SMS / WhatsApp message / link / email / OCR text)
    using a multi-layer hybrid approach:
    1. Heuristic regex & threat signatures
    2. URL, typosquatting & domain risk forensics
    3. Scikit-learn TF-IDF + Logistic Regression ML classifier
    4. Optional Gemini 1.5 Flash LLM for multilingual reasoning
    """
    if not request.text or len(request.text.strip()) < 2:
        raise HTTPException(status_code=400, detail="Text payload cannot be empty.")
    
    try:
        response = analyzer_service.analyze(request)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal analysis error: {str(e)}")
