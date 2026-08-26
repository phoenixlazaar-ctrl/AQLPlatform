@echo off
chcp 65001 >nul
title منصة AQL للتعليم التكيفي للقرآن الكريم
echo ===================================================================
echo   جاري تشغيل منصة AQL (Adaptive Quran Learning Platform)...
echo ===================================================================
cd /d "%~dp0"
py run.py
if %ERRORLEVEL% NEQ 0 (
    python run.py
)
pause
