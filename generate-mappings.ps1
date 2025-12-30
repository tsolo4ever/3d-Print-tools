# Simple wrapper to generate firmware mappings
# Run: .\generate-mappings.ps1 or right-click -> Run with PowerShell

Write-Host ""
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "  Firmware Mapping Generator" -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "This will scan 'new configs/' for .h files" -ForegroundColor Yellow
Write-Host "and generate complete mappings automatically." -ForegroundColor Yellow
Write-Host ""
Write-Host "Press Ctrl+C to cancel, or" -ForegroundColor Red
Pause

Write-Host ""
Write-Host "Starting mapping generation..." -ForegroundColor Green
Write-Host ""

python firmware-helper/process-all-mappings.py --scan

Write-Host ""
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "  Done!" -ForegroundColor Green
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Generated mappings are in: assets/data/maps/" -ForegroundColor Yellow
Write-Host ""
Pause
