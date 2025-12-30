@echo off
REM Simple wrapper to generate firmware mappings
REM Just double-click this file or run: generate-mappings.bat

echo.
echo ===============================================
echo   Firmware Mapping Generator
echo ===============================================
echo.
echo This will scan "new configs/" for .h files
echo and generate complete mappings automatically.
echo.
echo Press Ctrl+C to cancel, or
pause

echo.
echo Starting mapping generation...
echo.

python firmware-helper/process-all-mappings.py --scan

echo.
echo ===============================================
echo   Done!
echo ===============================================
echo.
echo Generated mappings are in: assets/data/maps/
echo.
pause
