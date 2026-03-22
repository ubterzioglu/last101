@echo off
REM =====================================================
REM LOCAL DEVELOPMENT HELPER (Windows)
REM Start local development server
REM =====================================================

echo.
echo 🚀 Starting local development server...
echo.

REM Check if Python is available
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Python not found!
    echo Install Python: https://python.org
    pause
    exit /b 1
)

REM Check current directory
if not exist "index.html" (
    echo ⚠️  Warning: index.html not found
    echo Are you in the almanya101 root directory?
    echo.
    pause
)

REM Start server
echo 📂 Serving files from: %CD%
echo 🌐 Server running at:
echo.
echo    http://localhost:8000
echo    http://127.0.0.1:8000
echo.
echo 📄 Pages:
echo    http://localhost:8000/index.html
echo    http://localhost:8000/rehber/providers.html
echo    http://localhost:8000/admin/providers.html
echo.
echo ⚠️  Note: API routes (/api/*) won't work locally
echo    Use Vercel CLI for API testing: vercel dev
echo.
echo Press Ctrl+C to stop
echo.

REM Start Python HTTP server
python -m http.server 8000
