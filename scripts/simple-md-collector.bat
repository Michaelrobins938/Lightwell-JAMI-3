@echo off
echo === Simple .md File Collection ===
echo.
echo This will collect ALL .md files from your project into the docs/ folder
echo.
echo Press any key to continue or Ctrl+C to cancel...
pause >nul

echo.
echo Starting collection process...
echo.

powershell -ExecutionPolicy Bypass -File "%~dp0simple-md-collector.ps1"

echo.
echo === Process Complete ===
echo Press any key to exit...
pause >nul
