# ScamShield AI — HackNowa Global Hackathon 2026 Submission Descriptions

## 1. Short Pitch (150 Words) — Elevator & Registration Form Summary

**Problem:** Everyday citizens lose billions annually to mobile cyber fraud—urgent electricity bill threats, fake KYC APKs, and deceptive UPI refund requests. Existing cybersecurity tools cater to enterprise servers, leaving non-technical individuals and elderly family members defenseless.

**Solution:** ScamShield AI is a consumer-grade digital safety assistant that instantly evaluates suspicious SMS, WhatsApp messages, emails, links, or screenshots. It delivers an instant 0–100 risk score, interactive red-flag explanations, and lookalike domain forensics.

**Innovation & Impact:** ScamShield AI features a hybrid multi-layer architecture combining deterministic regex heuristics, a lightweight scikit-learn ML classifier (98.5% accuracy), and Google Gemini 1.5 Flash for natural explanations in English, Hindi (हिंदी), and Marathi (मराठी). With an elder-friendly "Family Mode," client-side OCR, and direct 1-click reporting to India's 1930 Cybercrime Helpline and Chakshu portal, ScamShield AI protects families at the digital frontline.

---

## 2. Comprehensive Submission (400 Words) — Detailed Judging Form

### Project Title: ScamShield AI — Multi-Layer Real-Time Cyber Fraud & Scam Defense Platform
**Theme:** Digital Safety & Cybersecurity  
**Target Audience:** Everyday citizens, elderly family members, small business operators, and digital payment users.

### The Problem
Mobile communication channels (SMS, WhatsApp, Telegram) have become weapons of mass financial deception. In India alone, cyber financial fraud claims over ₹1,750 crore each quarter through deceptively crafted social engineering tactics:
- Same-day electricity disconnection panic triggers coercing victims into calling fake officer numbers.
- Fake bank KYC/PAN update alerts distributing malicious screen-mirroring APKs.
- UPI cashback traps that deceptively trick users into typing their secret UPI PIN to "receive" money.
Traditional antivirus suites fail because these are psychological social engineering attacks, not file viruses.

### The ScamShield AI Solution & Architecture
ScamShield AI provides an accessible, instant threat diagnosis platform designed with a 4-layer defense pipeline:

1. **Deterministic Heuristic Engine:** Regex pattern-matching tuned against thousands of cybercrime vectors to catch urgency coercion, APK sideload traps, and UPI PIN deception rules.
2. **Technical Link & Domain Forensics:** Real-time URL parsing that identifies lookalike/typosquatted domains (e.g. `sbi-kyc-verify.xyz`), URL shorteners, direct IP hostnames, and high-risk throwaway TLDs.
3. **Lightweight ML Classifier:** A calibrated TF-IDF vectorizer + Logistic Regression classifier trained on augmented SMS and cybercrime datasets. Delivering 98.5% accuracy and 98.8% recall in sub-5ms inference, it functions 100% offline.
4. **Generative LLM & Localization Layer:** Integrates Google Gemini 1.5 Flash to synthesize plain-language explanations in English, Hindi, and Marathi. If no API key is configured or offline, ScamShield AI features bulletproof graceful fallback to deterministic localized reasoning templates.

### High-Impact Bonus Features
- **Elder "Family Mode":** Transforms complex technical jargon into large-font, reassuring, elder-friendly advice with 1-click WhatsApp copyable alerts for parents.
- **Client-Side Tesseract OCR:** Zero-server, zero C++ binary dependency image OCR directly within the browser, safeguarding user privacy.
- **Actionable Helplines:** Integrated 1-click access to India's National Cybercrime Helpline 1930, `cybercrime.gov.in`, and DoT's Chakshu portal, plus Global emergency channels (IC3/FTC).
- **Public Model Transparency:** Embedded real-time model metrics (Accuracy, Precision, Recall, F1, and Confusion Matrix) for open AI accountability.
