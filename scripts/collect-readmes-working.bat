@echo off
echo === README.md Collection Script ===
echo.

REM Check if dry-run mode
if "%1"=="dry-run" (
    echo Running in DRY RUN mode - no files will be moved
    echo.
    set MODE=dry-run
) else (
    echo Running in LIVE mode - files will be moved
    echo.
    set MODE=live
)

REM Create target folder if it doesn't exist
if not exist "readmes" (
    if "%MODE%"=="live" (
        mkdir readmes
        echo Created folder: readmes
    ) else (
        echo [DRY RUN] Would create folder: readmes
    )
)

echo.
echo Searching for README.md files...
echo.

REM Find and process README files
set counter=0
for /r "." %%f in (README.md) do (
    set /a counter+=1

    REM Get relative path
    set "fullpath=%%f"
    set "filename=%%~nf"

    REM Skip if already in readmes folder
    echo %%f | findstr /i "\\readmes\\" >nul
    if errorlevel 1 (

        REM Skip excluded directories
        echo %%f | findstr /i "\\node_modules\\" >nul
        if errorlevel 1 (
            echo %%f | findstr /i "\\.git\\" >nul
            if errorlevel 1 (
                echo %%f | findstr /i "\\archive\\" >nul
                if errorlevel 1 (
                    echo %%f | findstr /i "backup" >nul
                    if errorlevel 1 (

                        REM Generate new filename based on path
                        set "relpath=%%f"
                        set "relpath=!relpath:%cd%\=!"
                        set "relpath=!relpath:\README.md=!"

                        if "!relpath!"=="README" (
                            set "newname=main-readme.md"
                        ) else (
                            set "newname=!relpath!"
                            set "newname=!newname:\=-!"
                            set "newname=!newname: =?!"
                            set "newname=!newname!.md"
                        )

                        echo !counter!. !relpath!\README.md
                        echo    -^> readmes\!newname!

                        if "!MODE!"=="live" (
                            move "%%f" "readmes\!newname!" >nul 2>&1
                            if errorlevel 1 (
                                echo    Error moving file
                            ) else (
                                echo    Moved successfully
                            )
                        ) else (
                            echo    [DRY RUN] Would move file
                        )

                        echo.
                    )
                )
            )
        )
    )
)

if "!MODE!"=="dry-run" (
    echo DRY RUN COMPLETED - No files were actually moved
    echo Run without parameters to execute the moves
) else (
    echo COLLECTION COMPLETED - All README.md files have been moved
)

echo.
echo === Script Complete ===
echo Press any key to exit...
pause >nul
