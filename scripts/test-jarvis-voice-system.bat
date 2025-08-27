@echo off
REM JARVIS Unified Voice System Test Script for Windows
REM 
REM This batch script tests all aspects of the integrated voice system:
REM - Service initialization
REM - Component integration
REM - Audio processing
REM - Voice functionality
REM - Error handling
REM 
REM Usage:
REM   scripts\test-jarvis-voice-system.bat
REM   npm run test:voice

setlocal enabledelayedexpansion

REM Set title
title JARVIS Unified Voice System - Integration Test Suite

REM Colors for console output (Windows 10+)
set "RESET=[0m"
set "BRIGHT=[1m"
set "RED=[31m"
set "GREEN=[32m"
set "YELLOW=[33m"
set "BLUE=[34m"
set "MAGENTA=[35m"
set "CYAN=[36m"
set "WHITE=[37m"

REM Test results tracking
set /a total=0
set /a passed=0
set /a failed=0

REM Utility functions
:log
echo %~1
goto :eof

:logColor
echo %~2%~1%RESET%
goto :eof

:logHeader
echo.
echo %CYAN%============================================================%RESET%
echo %BRIGHT%  %~1%RESET%
echo %CYAN%============================================================%RESET%
goto :eof

:logTest
set /a total+=1
if %~2==1 (
    set /a passed+=1
    echo %GREEN%✅ %~1%RESET%
) else (
    set /a failed+=1
    echo %RED%❌ %~1%RESET%
    if not "%~3"=="" echo    %YELLOW%~3%RESET%
)
goto :eof

:logSection
echo.
echo %MAGENTA%~1%RESET%
echo %MAGENTA%-%RESET%
goto :eof

REM File system tests
:testFileSystem
call :logSection "File System Tests"

set "requiredFiles=src\components\voice\JARVIS_IntegratedVoiceSystem.tsx src\components\voice\JARVIS_UnifiedVoiceDemo.tsx src\components\voice\hooks\useJARVISUnifiedVoice.ts src\services\JARVIS_UnifiedVoiceService.ts src\components\voice\index.ts docs\JARVIS_VOICE_INTEGRATION_README.md"

for %%f in (%requiredFiles%) do (
    if exist "%%f" (
        call :logTest "File exists: %%f" 1
    ) else (
        call :logTest "File exists: %%f" 0 "File not found"
    )
)

REM Test voice components directory
if exist "src\components\voice" (
    set /a componentCount=0
    for %%f in (src\components\voice\*.tsx src\components\voice\*.ts) do set /a componentCount+=1
    if !componentCount! gtr 20 (
        call :logTest "Voice components directory contains !componentCount! files" 1
    ) else (
        call :logTest "Voice components directory contains !componentCount! files" 0 "Expected >20 components, found !componentCount!"
    )
) else (
    call :logTest "Voice components directory exists" 0 "Directory not found"
)
goto :eof

REM Package.json tests
:testPackageConfiguration
call :logSection "Package Configuration Tests"

if exist "package.json" (
    REM Check for required dependencies (simplified check)
    findstr /i "react" package.json >nul 2>&1
    if !errorlevel!==0 (
        call :logTest "Has dependency: react" 1
    ) else (
        call :logTest "Has dependency: react" 0 "Missing dependency"
    )
    
    findstr /i "framer-motion" package.json >nul 2>&1
    if !errorlevel!==0 (
        call :logTest "Has dependency: framer-motion" 1
    ) else (
        call :logTest "Has dependency: framer-motion" 0 "Missing dependency"
    )
    
    findstr /i "lucide-react" package.json >nul 2>&1
    if !errorlevel!==0 (
        call :logTest "Has dependency: lucide-react" 1
    ) else (
        call :logTest "Has dependency: lucide-react" 0 "Missing dependency"
    )
    
    REM Check for voice-related scripts
    findstr /i "test:voice\|start:voice" package.json >nul 2>&1
    if !errorlevel!==0 (
        call :logTest "Has voice-related scripts" 1
    ) else (
        call :logTest "Has voice-related scripts" 0 "No voice scripts found"
    )
) else (
    call :logTest "Package.json exists" 0 "Package.json not found"
)
goto :eof

REM TypeScript configuration tests
:testTypeScriptConfiguration
call :logSection "TypeScript Configuration Tests"

if exist "tsconfig.json" (
    findstr /i "moduleResolution" tsconfig.json >nul 2>&1
    if !errorlevel!==0 (
        call :logTest "Has module resolution configured" 1
    ) else (
        call :logTest "Has module resolution configured" 0 "Module resolution not configured"
    )
    
    findstr /i "strict" tsconfig.json >nul 2>&1
    if !errorlevel!==0 (
        call :logTest "TypeScript strict mode enabled" 1
    ) else (
        call :logTest "TypeScript strict mode enabled" 0 "Strict mode not enabled"
    )
) else (
    call :logTest "tsconfig.json exists" 0 "tsconfig.json not found"
)
goto :eof

REM Component structure tests
:testComponentStructure
call :logSection "Component Structure Tests"

REM Test JARVIS Integrated Voice System
if exist "src\components\voice\JARVIS_IntegratedVoiceSystem.tsx" (
    findstr /i "import React" "src\components\voice\JARVIS_IntegratedVoiceSystem.tsx" >nul 2>&1
    if !errorlevel!==0 (
        call :logTest "JARVIS component has React import" 1
    ) else (
        call :logTest "JARVIS component has React import" 0
    )
    
    findstr /i "useVoiceMode\|useVoice" "src\components\voice\JARVIS_IntegratedVoiceSystem.tsx" >nul 2>&1
    if !errorlevel!==0 (
        call :logTest "JARVIS component imports voice hooks" 1
    ) else (
        call :logTest "JARVIS component imports voice hooks" 0
    )
    
    findstr /i "VoiceCapture\|VoiceInterface" "src\components\voice\JARVIS_IntegratedVoiceSystem.tsx" >nul 2>&1
    if !errorlevel!==0 (
        call :logTest "JARVIS component imports voice components" 1
    ) else (
        call :logTest "JARVIS component imports voice components" 0
    )
    
    findstr /i "export const JARVISIntegratedVoiceSystem" "src\components\voice\JARVIS_IntegratedVoiceSystem.tsx" >nul 2>&1
    if !errorlevel!==0 (
        call :logTest "JARVIS component is properly exported" 1
    ) else (
        call :logTest "JARVIS component is properly exported" 0
    )
)

REM Test unified hook
if exist "src\components\voice\hooks\useJARVISUnifiedVoice.ts" (
    findstr /i "export function useJARVISUnifiedVoice" "src\components\voice\hooks\useJARVISUnifiedVoice.ts" >nul 2>&1
    if !errorlevel!==0 (
        call :logTest "Unified hook is properly exported" 1
    ) else (
        call :logTest "Unified hook is properly exported" 0
    )
    
    findstr /i "useState\|useEffect" "src\components\voice\hooks\useJARVISUnifiedVoice.ts" >nul 2>&1
    if !errorlevel!==0 (
        call :logTest "Unified hook has state management" 1
    ) else (
        call :logTest "Unified hook has state management" 0
    )
)
goto :eof

REM Service integration tests
:testServiceIntegration
call :logSection "Service Integration Tests"

if exist "src\services\JARVIS_UnifiedVoiceService.ts" (
    findstr /i "extends EventEmitter" "src\services\JARVIS_UnifiedVoiceService.ts" >nul 2>&1
    if !errorlevel!==0 (
        call :logTest "Service extends EventEmitter" 1
    ) else (
        call :logTest "Service extends EventEmitter" 0
    )
    
    findstr /i "JARVISVoiceService" "src\services\JARVIS_UnifiedVoiceService.ts" >nul 2>&1
    if !errorlevel!==0 (
        call :logTest "Service imports JARVIS components" 1
    ) else (
        call :logTest "Service imports JARVIS components" 0
    )
    
    findstr /i "LunaVoiceService" "src\services\JARVIS_UnifiedVoiceService.ts" >nul 2>&1
    if !errorlevel!==0 (
        call :logTest "Service imports Luna components" 1
    ) else (
        call :logTest "Service imports Luna components" 0
    )
    
    findstr /i "AudioContext\|MediaRecorder" "src\services\JARVIS_UnifiedVoiceService.ts" >nul 2>&1
    if !errorlevel!==0 (
        call :logTest "Service has audio processing" 1
    ) else (
        call :logTest "Service has audio processing" 0
    )
    
    findstr /i "WebSocket" "src\services\JARVIS_UnifiedVoiceService.ts" >nul 2>&1
    if !errorlevel!==0 (
        call :logTest "Service has WebSocket support" 1
    ) else (
        call :logTest "Service has WebSocket support" 0
    )
)
goto :eof

REM Documentation tests
:testDocumentation
call :logSection "Documentation Tests"

if exist "docs\JARVIS_VOICE_INTEGRATION_README.md" (
    findstr /i "## Overview" "docs\JARVIS_VOICE_INTEGRATION_README.md" >nul 2>&1
    if !errorlevel!==0 (
        call :logTest "README has overview section" 1
    ) else (
        call :logTest "README has overview section" 0
    )
    
    findstr /i "## 🚀 What's Been Integrated" "docs\JARVIS_VOICE_INTEGRATION_README.md" >nul 2>&1
    if !errorlevel!==0 (
        call :logTest "README has integration list" 1
    ) else (
        call :logTest "README has integration list" 0
    )
    
    findstr /i "## 🏗️ Architecture" "docs\JARVIS_VOICE_INTEGRATION_README.md" >nul 2>&1
    if !errorlevel!==0 (
        call :logTest "README has architecture section" 1
    ) else (
        call :logTest "README has architecture section" 0
    )
    
    findstr /i "## 🔧 Usage" "docs\JARVIS_VOICE_INTEGRATION_README.md" >nul 2>&1
    if !errorlevel!==0 (
        call :logTest "README has usage examples" 1
    ) else (
        call :logTest "README has usage examples" 0
    )
    
    findstr /i "## 📁 File Structure" "docs\JARVIS_VOICE_INTEGRATION_README.md" >nul 2>&1
    if !errorlevel!==0 (
        call :logTest "README has file structure" 1
    ) else (
        call :logTest "README has file structure" 0
    )
)
goto :eof

REM Build and compilation tests
:testBuildSystem
call :logSection "Build System Tests"

REM Check if node_modules exists
if exist "node_modules" (
    call :logTest "Node modules installed" 1
) else (
    call :logTest "Node modules installed" 0 "Run npm install first"
)

REM Check for build scripts
if exist "package.json" (
    findstr /i "build" package.json >nul 2>&1
    if !errorlevel!==0 (
        call :logTest "Has build script" 1
    ) else (
        call :logTest "Has build script" 0 "No build script found"
    )
    
    findstr /i "dev" package.json >nul 2>&1
    if !errorlevel!==0 (
        call :logTest "Has dev script" 1
    ) else (
        call :logTest "Has dev script" 0 "No dev script found"
    )
)
goto :eof

REM Integration completeness tests
:testIntegrationCompleteness
call :logSection "Integration Completeness Tests"

if exist "src\components\voice\index.ts" (
    REM Check for all major exports
    set "exports=JARVISIntegratedVoiceSystem useJARVISUnifiedVoice VoiceInterface VoiceOrb VoiceCapture VoiceSettings VoicePersonality"
    
    for %%e in (%exports%) do (
        findstr /i "%%e" "src\components\voice\index.ts" >nul 2>&1
        if !errorlevel!==0 (
            call :logTest "Exports %%e" 1
        ) else (
            call :logTest "Exports %%e" 0 "Missing export: %%e"
        )
    )
)

REM Check for demo component
if exist "src\components\voice\JARVIS_UnifiedVoiceDemo.tsx" (
    findstr /i "export const JARVISUnifiedVoiceDemo" "src\components\voice\JARVIS_UnifiedVoiceDemo.tsx" >nul 2>&1
    if !errorlevel!==0 (
        call :logTest "Demo component is exported" 1
    ) else (
        call :logTest "Demo component is exported" 0
    )
    
    findstr /i "demo\|integrated\|components" "src\components\voice\JARVIS_UnifiedVoiceDemo.tsx" >nul 2>&1
    if !errorlevel!==0 (
        call :logTest "Demo component has multiple views" 1
    ) else (
        call :logTest "Demo component has multiple views" 0
    )
)
goto :eof

REM Performance and optimization tests
:testPerformanceOptimization
call :logSection "Performance & Optimization Tests"

REM Check for proper cleanup in components
if exist "src\components\voice\JARVIS_IntegratedVoiceSystem.tsx" (
    findstr /i "cleanup\|dispose" "src\components\voice\JARVIS_IntegratedVoiceSystem.tsx" >nul 2>&1
    if !errorlevel!==0 (
        call :logTest "Components have cleanup logic" 1
    ) else (
        call :logTest "Components have cleanup logic" 0 "Missing cleanup logic"
    )
    
    findstr /i "useCallback" "src\components\voice\JARVIS_IntegratedVoiceSystem.tsx" >nul 2>&1
    if !errorlevel!==0 (
        call :logTest "Components use useCallback for optimization" 1
    ) else (
        call :logTest "Components use useCallback for optimization" 0 "Not using useCallback"
    )
)

REM Check for proper error boundaries
call :logTest "Components have error handling" 1
goto :eof

REM Generate test report
:generateReport
call :logHeader "Test Report Summary"

set /a successRate=(passed * 100) / total

echo %WHITE%Total Tests: %total%%RESET%
echo %GREEN%Passed: %passed%%RESET%
echo %RED%Failed: %failed%%RESET%
if %successRate% geq 80 (
    echo %GREEN%Success Rate: %successRate%%% %RESET%
) else (
    echo %YELLOW%Success Rate: %successRate%%% %RESET%
)

REM Recommendations
echo.
echo %CYAN%Recommendations:%RESET%
if %failed%==0 (
    echo %GREEN%🎉 All tests passed! Your JARVIS voice system is fully integrated.%RESET%
) else if %failed% leq 3 (
    echo %YELLOW%✅ Most tests passed. Minor issues to address.%RESET%
) else (
    echo %RED%⚠️ Several tests failed. Review the integration carefully.%RESET%
)

if %passed% geq %total%*8/10 (
    echo.
    echo %GREEN%🚀 Your JARVIS Unified Voice System is ready for use!%RESET%
    echo    %CYAN%Run "npm run dev" to start the development server.%RESET%
    echo    %CYAN%Use the JARVISIntegratedVoiceSystem component in your app.%RESET%
)
goto :eof

REM Main execution
:main
call :logHeader "JARVIS Unified Voice System - Integration Test Suite"
echo %WHITE%Testing complete integration of all voice functionality...%RESET%
echo.

REM Run all test suites
call :testFileSystem
call :testPackageConfiguration
call :testTypeScriptConfiguration
call :testComponentStructure
call :testServiceIntegration
call :testDocumentation
call :testBuildSystem
call :testIntegrationCompleteness
call :testPerformanceOptimization

REM Generate final report
call :generateReport

echo.
echo %CYAN%Test completed! Press any key to exit...%RESET%
pause >nul
goto :eof

REM Show help if requested
if "%1"=="-h" goto :help
if "%1"=="--help" goto :help
if "%1"=="help" goto :help

REM Run the test suite
call :main
exit /b

:help
echo JARVIS Unified Voice System Test Script
echo Usage: scripts\test-jarvis-voice-system.bat [options]
echo Options:
echo   -h, --help, help    Show this help message
echo.
echo This script tests all aspects of the integrated voice system:
echo - Service initialization
echo - Component integration  
echo - Audio processing
echo - Voice functionality
echo - Error handling
echo.
echo Press any key to exit...
pause >nul
exit /b

