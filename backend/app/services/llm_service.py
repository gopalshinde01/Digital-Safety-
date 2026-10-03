import os
import json
import logging
import requests
from typing import Optional, Dict, Any, List
from app.core.config import settings

logger = logging.getLogger(__name__)

class LLMService:
    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY or os.environ.get("GEMINI_API_KEY", "")
        self.model = settings.GEMINI_MODEL or "gemini-1.5-flash"

    def update_api_key(self, new_key: str):
        self.api_key = new_key.strip()

    def is_available(self) -> bool:
        return bool(self.api_key and len(self.api_key.strip()) > 5)

    def generate_explanation(
        self,
        text: str,
        verdict: str,
        risk_score: int,
        red_flags: List[str],
        urls: List[str],
        language: str = "en"
    ) -> Optional[Dict[str, Any]]:
        """
        Uses the Gemini REST API directly to generate deep contextual reasoning
        and natural multilingual explanations.
        Returns None if LLM is unavailable or fails, triggering instant fallback.
        """
        if not self.is_available():
            return None

        endpoint = f"https://generativelanguage.googleapis.com/v1beta/models/{self.model}:generateContent?key={self.api_key}"

        prompt = f"""
You are ScamShield AI, an expert cybersecurity analyst for mobile and consumer cyber fraud.
Analyze the following suspicious message and provide a concise, user-friendly security verdict in JSON format.

INPUT MESSAGE:
"{text}"

CURRENT SYSTEM DETECTIONS:
- Preliminary Verdict: {verdict}
- Calculated Risk Score: {risk_score}/100
- Detected Red Flag Signals: {', '.join(red_flags) if red_flags else 'None'}
- Extracted Links: {', '.join(urls) if urls else 'None'}
- Target Language: {language} (en=English, hi=Hindi, mr=Marathi)

REQUIREMENTS:
Respond ONLY with a valid JSON object with the following schema:
{{
  "verdict_summary": "1-2 sentences explaining why this message is safe/suspicious/scam in {language}",
  "plain_language_why": "Clear bullet points or short explanation for normal everyday citizens",
  "family_mode_warning": "Ultra-simple 1-sentence warning suitable for elderly grandparents who don't understand tech jargon",
  "specific_advice": ["1-3 customized safety instructions for this specific scam tactic"]
}}
Ensure the entire text inside the JSON values is translated naturally into {language} (Hindi if 'hi', Marathi if 'mr', English if 'en').
Do not include markdown code fence formatting (```json); return pure JSON text only.
"""
        payload = {
            "contents": [
                {
                    "parts": [
                        {"text": prompt}
                    ]
                }
            ],
            "generationConfig": {
                "temperature": 0.2,
                "responseMimeType": "application/json"
            }
        }

        try:
            resp = requests.post(endpoint, json=payload, timeout=8)
            if resp.status_code != 200:
                logger.warning(f"Gemini API returned status {resp.status_code}: {resp.text[:150]}. Using offline rules.")
                return None

            data = resp.json()
            candidates = data.get("candidates", [])
            if not candidates:
                return None

            content_text = candidates[0].get("content", {}).get("parts", [{}])[0].get("text", "").strip()
            
            # Clean possible markdown fence
            if content_text.startswith("```json"):
                content_text = content_text[7:]
            if content_text.startswith("```"):
                content_text = content_text[3:]
            if content_text.endswith("```"):
                content_text = content_text[:-3]

            parsed_json = json.loads(content_text.strip())
            return parsed_json
        except Exception as e:
            logger.warning(f"Gemini REST request error: {e}. Gracefully falling back to offline rules.")
            return None

llm_service = LLMService()
