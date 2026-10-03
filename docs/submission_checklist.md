# ScamShield AI — HackNowa Global Hackathon 2026 Submission Checklist

Use this checklist before submitting your entry on Unstop:

### 1. Codebase & Repository Readiness
- [x] Monorepo organized cleanly (`/backend`, `/frontend`, `/ml`, `/docs`).
- [x] `.env.example` provided with clear instructions.
- [x] No hardcoded secrets in source code.
- [x] Dockerfile and `docker-compose.yml` included for free cloud deployment (Render, Fly.io, Hugging Face Spaces).
- [x] One-click run scripts provided (`start.bat` for Windows, `run.py` for cross-platform).
- [x] Backend unit tests implemented (`backend/tests/`) and passing.
- [x] ML training script (`ml/train.py`) and evaluation script (`ml/evaluate.py`) included with published `metrics.json`.

### 2. Documentation & Submission Assets
- [x] Comprehensive root `README.md` with Mermaid architecture diagram, screenshots guide, setup steps, and impact statement.
- [x] 150-word elevator summary prepared in `docs/unstop_submission_descriptions.md`.
- [x] 400-word detailed submission prepared in `docs/unstop_submission_descriptions.md`.
- [x] Click-by-click 2:30 minute demo video script ready in `docs/demo_video_script.md`.
- [x] 6-slide Pitch Deck Outline ready in `docs/pitch_deck_outline.md`.
- [x] Curated scam and ham test samples in `docs/samples/`.

### 3. Demo Video Recording Checklist
- [ ] Record a 2–3 minute video walking through the click-by-click script in `docs/demo_video_script.md`.
- [ ] Upload video to YouTube (set to "Unlisted" or "Public") or Google Drive (set access to "Anyone with link can view").
- [ ] Video URL: `___________________________________________________`

### 4. Live Free Deployment (Optional but Recommended)
- [ ] Deploy Frontend to **Vercel** or **Netlify**:
  - Root directory: `frontend`
  - Build command: `npm run build`
  - Output directory: `dist`
  - Environment variable: `VITE_API_URL=https://your-backend.onrender.com/api`
- [ ] Deploy Backend to **Render** or **Hugging Face Spaces**:
  - Docker deployment using provided `backend/Dockerfile`
  - Set optional `GEMINI_API_KEY` in Render environment variables
- [ ] Live App URL: `___________________________________________________`

### 5. Final Unstop Form Details
- **Project Title:** ScamShield AI — Intelligent Multi-Layer Cyber Fraud & Scam Defense
- **Theme:** Digital Safety & Cybersecurity
- **Short Description:** Paste from `docs/unstop_submission_descriptions.md` (Section 1)
- **Long Description:** Paste from `docs/unstop_submission_descriptions.md` (Section 2)
- **GitHub Repository URL:** `https://github.com/gopalshinde01/Digital-Safety-`
