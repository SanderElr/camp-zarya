@echo off
chcp 65001 >nul
title Camp Zarya - Save to GitHub
cd /d "%~dp0"

echo ========================================================
echo   CAMP ZARYA: SYNC WITH GITHUB
echo ========================================================
echo.

echo [1/3] Adding files...
git add .

set "commit_msg=Game update: %date% %time%"
echo [2/3] Local commit...
git commit -m "%commit_msg%"

echo.
echo [3/3] Sending to GitHub...
git push -u origin main
if %ERRORLEVEL% EQU 0 goto :success

echo.
echo ========================================================
echo   GitHub authorization required!
echo   Opening browser for login...
echo ========================================================
echo.
git credential-manager github login

echo.
echo Retrying push to GitHub...
git push -u origin main
if %ERRORLEVEL% EQU 0 goto :success

echo.
echo ========================================================
echo   [ERROR] Push failed.
echo ========================================================
goto :end

:success
echo.
echo ========================================================
echo   [SUCCESS] Game saved on PC and uploaded to GitHub!
echo ========================================================

:end
echo.
pause
