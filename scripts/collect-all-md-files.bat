@echo off
echo === Comprehensive .md File Collection Script ===
echo.

REM Check if dry-run mode
if "%1"=="dry-run" (
    echo Running in DRY RUN mode - no files will be moved
    echo.
    powershell -ExecutionPolicy Bypass -File "%~dp0collect-all-md-files.ps1" -DryRun
) else if "%1"=="organize" (
    echo Running with category organization
    echo.
    powershell -ExecutionPolicy Bypass -File "%~dp0collect-all-md-files.ps1" -OrganizeByCategory
) else if "%1"=="dry-run-organize" (
    echo Running in DRY RUN mode with category organization
    echo.
    powershell -ExecutionPolicy Bypass -File "%~dp0collect-all-md-files.ps1" -DryRun -OrganizeByCategory
) else (
    echo Running in LIVE mode - files will be moved
    echo.
    powershell -ExecutionPolicy Bypass -File "%~dp0collect-all-md-files.ps1"
)

echo.
echo === Script Complete ===
echo Press any key to exit...
pause >nul
