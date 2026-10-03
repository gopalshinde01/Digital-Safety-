@echo off
echo =======================================================
echo          STARTING SCAMSHIELD AI (HACKNOWA 2026)
echo =======================================================

cd /d "%~dp0"

echo [1/3] Checking Python virtual environment...
if exist ".venv\Scripts\python.exe" (
    set "PYTHON_EXE=.venv\Scripts\python.exe"
) else (
    set "PYTHON_EXE=python"
)

echo [2/3] Launching ScamShield AI Backend on http://localhost:8000 ...
start "ScamShield-Backend" cmd /k "cd backend && ..\%PYTHON_EXE% -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload"

timeout /t 2 /nobreak >nul

echo [3/3] Launching ScamShield AI Frontend on http://localhost:5173 ...
start "ScamShield-Frontend" cmd /k "cd frontend && npm run dev"

timeout /t 3 /nobreak >nul
echo Opening ScamShield AI in your browser...
start http://localhost:5173

echo =======================================================
echo ScamShield AI is now live!
echo Frontend: http://localhost:5173
echo Backend:  http://localhost:8000/docs
echo =======================================================
