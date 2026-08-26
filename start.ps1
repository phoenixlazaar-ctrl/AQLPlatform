# PowerShell Launcher for AQL Platform
Write-Host "===================================================================" -ForegroundColor Cyan
Write-Host "  منصة AQL للتعليم التكيفي للقرآن الكريم (Adaptive Quran Learning)" -ForegroundColor Green
Write-Host "===================================================================" -ForegroundColor Cyan
Write-Host "  الرابط المحلي: http://127.0.0.1:8000" -ForegroundColor Yellow
Write-Host "===================================================================" -ForegroundColor Cyan

Start-Process "http://127.0.0.1:8000"
py run.py
