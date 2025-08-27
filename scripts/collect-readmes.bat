@echo off
REM Batch script to run the PowerShell README collection script
REM Usage: collect-readmes.bat [dry-run]

echo === README.md Collection Script ===
echo.

if "%1"=="dry-run" (
    echo Running in DRY RUN mode - no files will be moved
    echo.
    powershell -ExecutionPolicy Bypass -File "%~dp0collect-readmes.ps1" -DryRun
) else (
    echo Running in LIVE mode - files will be moved
    echo.
    powershell -ExecutionPolicy Bypass -File "%~dp0collect-readmes.ps1"
)

echo.
echo === Script Complete ===
pause
