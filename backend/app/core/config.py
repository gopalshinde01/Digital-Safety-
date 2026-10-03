import os
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List
from pathlib import Path

class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        case_sensitive=True,
        env_file=".env",
        extra="ignore"
    )
    
    PROJECT_NAME: str = "ScamShield AI"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    APP_ENV: str = os.getenv("APP_ENV", "development")
    
    # AI / LLM Configuration
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    GEMINI_MODEL: str = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")
    
    # Server Configuration
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", 8000))
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "*"
    ]
    
    # Paths
    BASE_DIR: Path = Path(__file__).resolve().parent.parent.parent
    ML_DIR: Path = BASE_DIR.parent / "ml"
    MODELS_DIR: Path = ML_DIR / "models"

settings = Settings()
