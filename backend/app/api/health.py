from fastapi import APIRouter
from app.services.ml_classifier import ml_service
from app.services.llm_service import llm_service
from app.core.config import settings

router = APIRouter(tags=["Health"])

@router.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "ml_model_loaded": ml_service.is_loaded,
        "gemini_llm_active": llm_service.is_available(),
        "mode": "Hybrid AI (ML + Rules + LLM)" if llm_service.is_available() else "Local Hybrid (ML + Rules)"
    }
