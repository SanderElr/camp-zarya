@echo off
chcp 65001 >nul
title Лагерь Заря - Сервер для телефона
cd /d "%~dp0"
where node >nul 2>nul
if %errorlevel% equ 0 (
    node server.js
    pause
    exit /b
)
where python >nul 2>nul
if %errorlevel% equ 0 (
    echo Node.js не найден, запускаем через Python 8080...
    python -m http.server 8080
    pause
    exit /b
)
echo Ошибка: не найден ни Node.js, ни Python для запуска локального сервера.
pause
