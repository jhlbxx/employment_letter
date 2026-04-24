@echo off
cd /d %~dp0

echo ======================================================
echo    Employment Letter Packaging Tool (EXE)
echo ======================================================
echo.

echo [1/3] Installing necessary packaging tools...
call npm install

echo.
echo [2/3] Building the application...
call npm run build

echo.
echo [3/3] Packaging into .exe (Portable)...
call npx electron-builder --win portable

echo.
echo ------------------------------------------------------
echo  Packaging Complete!
echo  Check the "dist_electron" folder for your .exe file.
echo ------------------------------------------------------
echo.
pause
