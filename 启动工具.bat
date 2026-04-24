@echo off
cd /d %~dp0

echo ======================================================
echo    Standard Employment Letter Generation Tool
echo    Dave's Fish ^& Chips
echo ======================================================
echo.

echo [1/3] Clearing any leftover processes...
taskkill /f /im node.exe >nul 2>&1

echo [2/3] Checking dependencies...
if not exist "node_modules\" (
    echo      Installing... please wait.
    call npm install
)

echo [3/3] Starting server on port 3737...
start "EmploymentLetterTool" /min cmd /c "npm run dev"

echo      Waiting for server to start...
timeout /t 5 /nobreak >nul

echo      Opening browser...
start "" "http://localhost:3737"

echo.
echo ------------------------------------------------------
echo  App is running at http://localhost:3737
echo  Keep this window open. Press any key to stop.
echo ------------------------------------------------------
echo.
pause >nul

taskkill /fi "WINDOWTITLE eq EmploymentLetterTool" /f >nul 2>&1
taskkill /f /im node.exe >nul 2>&1
echo  Stopped. Goodbye!
timeout /t 2 /nobreak >nul
