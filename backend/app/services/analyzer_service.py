from datetime import datetime
from typing import List, Dict, Any
from app.schemas.analysis import AnalysisRequest, AnalysisResponse, RedFlagItem, LinkAnalysis
from app.services.heuristic_engine import scan_heuristics
from app.services.link_analyzer import evaluate_all_links
from app.services.ml_classifier import ml_service
from app.services.llm_service import llm_service
from app.services.localization import get_localized_data

class AnalyzerService:
    def analyze(self, request: AnalysisRequest) -> AnalysisResponse:
        text = request.text.strip()
        lang = request.language if request.language in ["en", "hi", "mr"] else "en"
        region = request.region or "india"

        # 1. Heuristic Scan
        red_flags, heuristic_score = scan_heuristics(text)

        # 2. Link & Domain Forensics
        link_analyses, link_risk_score = evaluate_all_links(text)

        # 3. Machine Learning Inference
        ml_prob = ml_service.predict_scam_probability(text)
        ml_risk_component = ml_prob * 100.0

        # 4. Ensemble Scoring
        # Default Weights: ML (35%), Links (35%), Heuristics (30%)
        # If no links are present in text, reallocate weights to ML (55%) and Heuristics (45%)
        if not link_analyses:
            raw_score = (0.55 * ml_risk_component) + (0.45 * heuristic_score)
        else:
            raw_score = (0.35 * ml_risk_component) + (0.35 * link_risk_score) + (0.30 * heuristic_score)

        # 5. Critical Safety Overrides (Guardrails)
        has_critical_upi = any(f.category == "upi_trap" for f in red_flags)
        has_critical_apk = any(f.category == "malware_apk" for f in red_flags) or any(".apk" in d for l in link_analyses for d in l.details)
        has_extortion = any(f.category == "extortion" for f in red_flags)
        
        if has_critical_upi or has_critical_apk:
            raw_score = max(raw_score, 88.0)
        elif has_extortion:
            raw_score = max(raw_score, 92.0)
        elif not red_flags and not any(l.is_suspicious for l in link_analyses) and ml_prob < 0.15:
            # Clear safe message
            raw_score = min(raw_score, 15.0)

        final_score = int(round(min(100.0, max(0.0, raw_score))))

        # 6. Verdict Classification
        if final_score <= 30:
            verdict = "Safe"
            risk_level = "Low"
        elif final_score <= 65:
            verdict = "Suspicious"
            risk_level = "Medium"
        else:
            verdict = "Scam"
            risk_level = "High"

        # 7. Localization Data
        locale_data = get_localized_data(language=lang, region=region)

        # 8. LLM Enhancement (with bulletproof offline fallback)
        ai_provider = "Local Hybrid (Offline ML + Heuristics)"
        summary = locale_data["verdict_summaries"].get(verdict, "")
        family_summary = locale_data["family_mode"].get(verdict, "")
        recommended_actions = list(locale_data["recommended_actions"])
        what_not_to_do = list(locale_data["what_not_to_do"])

        if llm_service.is_available():
            flag_names = [f.phrase for f in red_flags]
            urls = [l.url for l in link_analyses]
            llm_result = llm_service.generate_explanation(
                text=text,
                verdict=verdict,
                risk_score=final_score,
                red_flags=flag_names,
                urls=urls,
                language=lang
            )
            if llm_result:
                ai_provider = "Hybrid (Local ML + Heuristics + Gemini 1.5 Flash)"
                if "verdict_summary" in llm_result and llm_result["verdict_summary"]:
                    summary = llm_result["verdict_summary"]
                if "family_mode_warning" in llm_result and llm_result["family_mode_warning"]:
                    family_summary = llm_result["family_mode_warning"]
                if "specific_advice" in llm_result and isinstance(llm_result["specific_advice"], list):
                    # Prepend specific LLM advice
                    recommended_actions = llm_result["specific_advice"] + recommended_actions[:3]

        # Filter or adjust family summary if request specifically asks for Family Mode
        if request.family_mode and not family_summary:
            family_summary = locale_data["family_mode"].get(verdict, "")

        return AnalysisResponse(
            verdict=verdict,
            risk_score=final_score,
            risk_level=risk_level,
            summary=summary,
            highlighted_phrases=red_flags,
            link_analysis=link_analyses,
            recommended_actions=recommended_actions[:5],
            what_not_to_do=what_not_to_do[:4],
            emergency_helplines=locale_data["helplines"],
            family_mode_summary=family_summary,
            ml_scam_probability=ml_prob,
            heuristic_score=heuristic_score,
            analyzed_at=datetime.utcnow().isoformat() + "Z",
            language=lang,
            ai_provider=ai_provider
        )

analyzer_service = AnalyzerService()
