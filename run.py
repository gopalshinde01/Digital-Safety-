"""
ScamShield AI - Single-Command Cross-Platform Launcher
Runs both the FastAPI backend and React frontend concurrently.
Usage: python run.py
"""

import os
import sys
import subprocess
import time
import webbrowser
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent
BACKEND_DIR = ROOT_DIR / "backend"
FRONTEND_DIR = ROOT_DIR / "frontend"

def find_python():
    venv_py = ROOT_DIR / ".venv" / ("Scripts" if sys.platform == "win32" else "bin") / ("python.exe" if sys.platform == "win32" else "python")
    if venv_py.exists():
        return str(venv_py)
    return sys.executable

def main():
    print("=" * 60)
    print("        SCAMSHIELD AI - LOCAL RUNNER (HACKNOWA 2026)        ")
    print("=" * 60)

    py_exe = find_python()
    npm_cmd = "npm.cmd" if sys.platform == "win32" else "npm"

    print(f"[*] Using Python: {py_exe}")
    print("[*] Launching Backend on http://127.0.0.1:8000 ...")

    backend_proc = subprocess.Popen(
        [py_exe, "-m", "uvicorn", "app.main:app", "--host", "127.0.0.1", "--port", "8000", "--reload"],
        cwd=str(BACKEND_DIR)
    )

    time.sleep(2)

    print("[*] Launching Frontend on http://localhost:5173 ...")
    frontend_proc = subprocess.Popen(
        [npm_cmd, "run", "dev"],
        cwd=str(FRONTEND_DIR)
    )

    time.sleep(3)
    print("\n" + "=" * 60)
    print("🚀 ScamShield AI is running!")
    print("   • Frontend: http://localhost:5173")
    print("   • Backend:  http://127.0.0.1:8000/docs")
    print("Press Ctrl+C to terminate both servers.")
    print("=" * 60 + "\n")

    try:
        webbrowser.open("http://localhost:5173")
    except Exception:
        pass

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\nShutting down ScamShield AI...")
        backend_proc.terminate()
        frontend_proc.terminate()
        backend_proc.wait()
        frontend_proc.wait()
        print("Shutdown complete. Stay safe!")

if __name__ == "__main__":
    main()
