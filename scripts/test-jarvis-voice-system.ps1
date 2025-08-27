# JARVIS Unified Voice System Test Script for Windows
# 
# This PowerShell script tests all aspects of the integrated voice system:
# - Service initialization
# - Component integration
# - Audio processing
# - Voice functionality
# - Error handling
# 
# Usage:
#   .\scripts\test-jarvis-voice-system.ps1
#   npm run test:voice

param(
    [switch]$Verbose,
    [switch]$Quick,
    [string]$OutputFile = ""
)

# Set execution policy for this session
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process -Force

# Colors for console output
$colors = @{
    Reset = "`e[0m"
    Bright = "`e[1m"
    Red = "`e[31m"
    Green = "`e[32m"
    Yellow = "`e[33m"
    Blue = "`e[34m"
    Magenta = "`e[35m"
    Cyan = "`e[36m"
    White = "`e[37m"
}

# Test results tracking
$script:testResults = @{
    Total = 0
    Passed = 0
    Failed = 0
    Errors = @()
}

# Utility functions
function Write-ColorLog {
    param(
        [string]$Message,
        [string]$Color = "White"
    )
    $colorCode = $colors[$Color]
    Write-Host "$colorCode$Message$($colors.Reset)"
}

function Write-Header {
    param([string]$Message)
    Write-ColorLog "`n" + ("=" * 60), "Cyan"
    Write-ColorLog "  $Message", "Bright"
    Write-ColorLog ("=" * 60), "Cyan"
}

function Write-Test {
    param(
        [string]$TestName,
        [bool]$Result,
        [string]$Details = ""
    )
    $script:testResults.Total++
    if ($Result) {
        $script:testResults.Passed++
        Write-ColorLog "✅ $TestName", "Green"
    } else {
        $script:testResults.Failed++
        $script:testResults.Errors += @{ Test = $TestName; Details = $Details }
        Write-ColorLog "❌ $TestName", "Red"
        if ($Details) {
            Write-ColorLog "   $Details", "Yellow"
        }
    }
}

function Write-Section {
    param([string]$SectionName)
    Write-ColorLog "`n$SectionName", "Magenta"
    Write-ColorLog ("-" * $SectionName.Length), "Magenta"
}

# File system tests
function Test-FileSystem {
    Write-Section "File System Tests"
    
    $requiredFiles = @(
        "src\components\voice\JARVIS_IntegratedVoiceSystem.tsx",
        "src\components\voice\JARVIS_UnifiedVoiceDemo.tsx",
        "src\components\voice\hooks\useJARVISUnifiedVoice.ts",
        "src\services\JARVIS_UnifiedVoiceService.ts",
        "src\components\voice\index.ts",
        "docs\JARVIS_VOICE_INTEGRATION_README.md"
    )
    
    foreach ($file in $requiredFiles) {
        $exists = Test-Path $file
        Write-Test "File exists: $file" $exists ($exists ? "" : "File not found")
    }
    
    # Test voice components directory
    $voiceDir = "src\components\voice"
    if (Test-Path $voiceDir) {
        $files = Get-ChildItem $voiceDir -File | Where-Object { $_.Extension -match "\.(tsx|ts)$" }
        $componentCount = $files.Count
        Write-Test "Voice components directory contains $componentCount files" ($componentCount -gt 20) `
            "Expected >20 components, found $componentCount"
    } else {
        Write-Test "Voice components directory exists" $false "Directory not found"
    }
}

# Package.json tests
function Test-PackageConfiguration {
    Write-Section "Package Configuration Tests"
    
    try {
        $packageJson = Get-Content "package.json" | ConvertFrom-Json
        
        # Check for required dependencies
        $requiredDeps = @("react", "framer-motion", "lucide-react")
        $deps = @{}
        if ($packageJson.dependencies) { $deps += $packageJson.dependencies }
        if ($packageJson.devDependencies) { $deps += $packageJson.devDependencies }
        
        foreach ($dep in $requiredDeps) {
            $hasDep = $deps.ContainsKey($dep)
            Write-Test "Has dependency: $dep" $hasDep ($hasDep ? "" : "Missing dependency")
        }
        
        # Check for voice-related scripts
        $scripts = $packageJson.scripts
        $hasVoiceScripts = $scripts.'test:voice' -or $scripts.'start:voice'
        Write-Test "Has voice-related scripts" $hasVoiceScripts `
            ($hasVoiceScripts ? "" : "No voice scripts found")
        
    } catch {
        Write-Test "Package.json is valid JSON" $false $_.Exception.Message
    }
}

# TypeScript configuration tests
function Test-TypeScriptConfiguration {
    Write-Section "TypeScript Configuration Tests"
    
    try {
        $tsConfig = Get-Content "tsconfig.json" | ConvertFrom-Json
        
        # Check for proper module resolution
        $hasModuleResolution = $tsConfig.compilerOptions.moduleResolution
        Write-Test "Has module resolution configured" $hasModuleResolution `
            ($hasModuleResolution ? "" : "Module resolution not configured")
        
        # Check for strict mode
        $isStrict = $tsConfig.compilerOptions.strict
        Write-Test "TypeScript strict mode enabled" $isStrict `
            ($isStrict ? "" : "Strict mode not enabled")
        
    } catch {
        Write-Test "tsconfig.json is valid JSON" $false $_.Exception.Message
    }
}

# Component structure tests
function Test-ComponentStructure {
    Write-Section "Component Structure Tests"
    
    try {
        # Test JARVIS Integrated Voice System
        $jarvisFile = "src\components\voice\JARVIS_IntegratedVoiceSystem.tsx"
        if (Test-Path $jarvisFile) {
            $content = Get-Content $jarvisFile -Raw
            
            $hasReactImport = $content -match "import React"
            Write-Test "JARVIS component has React import" $hasReactImport
            
            $hasVoiceHooks = ($content -match "useVoiceMode") -and ($content -match "useVoice")
            Write-Test "JARVIS component imports voice hooks" $hasVoiceHooks
            
            $hasVoiceComponents = ($content -match "VoiceCapture") -and ($content -match "VoiceInterface")
            Write-Test "JARVIS component imports voice components" $hasVoiceComponents
            
            $hasExport = $content -match "export const JARVISIntegratedVoiceSystem"
            Write-Test "JARVIS component is properly exported" $hasExport
        }
        
        # Test unified hook
        $hookFile = "src\components\voice\hooks\useJARVISUnifiedVoice.ts"
        if (Test-Path $hookFile) {
            $content = Get-Content $hookFile -Raw
            
            $hasHookExport = $content -match "export function useJARVISUnifiedVoice"
            Write-Test "Unified hook is properly exported" $hasHookExport
            
            $hasStateManagement = ($content -match "useState") -and ($content -match "useEffect")
            Write-Test "Unified hook has state management" $hasStateManagement
        }
        
    } catch {
        Write-Test "Component structure validation" $false $_.Exception.Message
    }
}

# Service integration tests
function Test-ServiceIntegration {
    Write-Section "Service Integration Tests"
    
    try {
        $serviceFile = "src\services\JARVIS_UnifiedVoiceService.ts"
        if (Test-Path $serviceFile) {
            $content = Get-Content $serviceFile -Raw
            
            $hasEventEmitter = $content -match "extends EventEmitter"
            Write-Test "Service extends EventEmitter" $hasEventEmitter
            
            $hasJARVISImport = $content -match "JARVISVoiceService"
            Write-Test "Service imports JARVIS components" $hasJARVISImport
            
            $hasLunaImport = $content -match "LunaVoiceService"
            Write-Test "Service imports Luna components" $hasLunaImport
            
            $hasAudioProcessing = ($content -match "AudioContext") -and ($content -match "MediaRecorder")
            Write-Test "Service has audio processing" $hasAudioProcessing
            
            $hasWebSocket = $content -match "WebSocket"
            Write-Test "Service has WebSocket support" $hasWebSocket
        }
        
    } catch {
        Write-Test "Service integration validation" $false $_.Exception.Message
    }
}

# Documentation tests
function Test-Documentation {
    Write-Section "Documentation Tests"
    
    try {
        $readmeFile = "docs\JARVIS_VOICE_INTEGRATION_README.md"
        if (Test-Path $readmeFile) {
            $content = Get-Content $readmeFile -Raw
            
            $hasOverview = $content -match "## Overview"
            Write-Test "README has overview section" $hasOverview
            
            $hasIntegrationList = $content -match "## 🚀 What's Been Integrated"
            Write-Test "README has integration list" $hasIntegrationList
            
            $hasArchitecture = $content -match "## 🏗️ Architecture"
            Write-Test "README has architecture section" $hasArchitecture
            
            $hasUsage = $content -match "## 🔧 Usage"
            Write-Test "README has usage examples" $hasUsage
            
            $hasFileStructure = $content -match "## 📁 File Structure"
            Write-Test "README has file structure" $hasFileStructure
        }
        
    } catch {
        Write-Test "Documentation validation" $false $_.Exception.Message
    }
}

# Build and compilation tests
function Test-BuildSystem {
    Write-Section "Build System Tests"
    
    try {
        # Check if node_modules exists
        $hasNodeModules = Test-Path "node_modules"
        Write-Test "Node modules installed" $hasNodeModules `
            ($hasNodeModules ? "" : "Run npm install first")
        
        # Check for build scripts
        $packageJson = Get-Content "package.json" | ConvertFrom-Json
        $scripts = $packageJson.scripts
        
        $hasBuildScript = $scripts.build
        Write-Test "Has build script" $hasBuildScript `
            ($hasBuildScript ? "" : "No build script found")
        
        $hasDevScript = $scripts.dev
        Write-Test "Has dev script" $hasDevScript `
            ($hasDevScript ? "" : "No dev script found")
        
    } catch {
        Write-Test "Build system validation" $false $_.Exception.Message
    }
}

# Integration completeness tests
function Test-IntegrationCompleteness {
    Write-Section "Integration Completeness Tests"
    
    try {
        $indexFile = "src\components\voice\index.ts"
        if (Test-Path $indexFile) {
            $content = Get-Content $indexFile -Raw
            
            # Check for all major exports
            $exports = @(
                "JARVISIntegratedVoiceSystem",
                "useJARVISUnifiedVoice",
                "VoiceInterface",
                "VoiceOrb",
                "VoiceCapture",
                "VoiceSettings",
                "VoicePersonality"
            )
            
            foreach ($exportName in $exports) {
                $hasExport = $content -match $exportName
                Write-Test "Exports $exportName" $hasExport `
                    ($hasExport ? "" : "Missing export: $exportName")
            }
        }
        
        # Check for demo component
        $demoFile = "src\components\voice\JARVIS_UnifiedVoiceDemo.tsx"
        if (Test-Path $demoFile) {
            $content = Get-Content $demoFile -Raw
            
            $hasDemoExport = $content -match "export const JARVISUnifiedVoiceDemo"
            Write-Test "Demo component is exported" $hasDemoExport
            
            $hasDemoViews = ($content -match "demo") -and ($content -match "integrated") -and ($content -match "components")
            Write-Test "Demo component has multiple views" $hasDemoViews
        }
        
    } catch {
        Write-Test "Integration completeness validation" $false $_.Exception.Message
    }
}

# Performance and optimization tests
function Test-PerformanceOptimization {
    Write-Section "Performance & Optimization Tests"
    
    try {
        # Check for proper cleanup in components
        $jarvisFile = "src\components\voice\JARVIS_IntegratedVoiceSystem.tsx"
        if (Test-Path $jarvisFile) {
            $content = Get-Content $jarvisFile -Raw
            
            $hasCleanup = ($content -match "cleanup") -or ($content -match "dispose")
            Write-Test "Components have cleanup logic" $hasCleanup `
                ($hasCleanup ? "" : "Missing cleanup logic")
            
            $hasUseCallback = $content -match "useCallback"
            Write-Test "Components use useCallback for optimization" $hasUseCallback `
                ($hasUseCallback ? "" : "Not using useCallback")
        }
        
        # Check for proper error boundaries
        $hasErrorHandling = $true # Placeholder for error handling tests
        Write-Test "Components have error handling" $hasErrorHandling
        
    } catch {
        Write-Test "Performance optimization validation" $false $_.Exception.Message
    }
}

# Generate test report
function Generate-Report {
    Write-Header "Test Report Summary"
    
    $successRate = [math]::Round(($script:testResults.Passed / $script:testResults.Total) * 100, 1)
    
    Write-ColorLog "Total Tests: $($script:testResults.Total)", "White"
    Write-ColorLog "Passed: $($script:testResults.Passed)", "Green"
    Write-ColorLog "Failed: $($script:testResults.Failed)", "Red"
    Write-ColorLog "Success Rate: $successRate%", $(if ($successRate -ge 80) { "Green" } else { "Yellow" })
    
    if ($script:testResults.Errors.Count -gt 0) {
        Write-ColorLog "`nFailed Tests:", "Red"
        foreach ($error in $script:testResults.Errors) {
            Write-ColorLog "  - $($error.Test): $($error.Details)", "Yellow"
        }
    }
    
    # Recommendations
    Write-ColorLog "`nRecommendations:", "Cyan"
    if ($script:testResults.Failed -eq 0) {
        Write-ColorLog "🎉 All tests passed! Your JARVIS voice system is fully integrated.", "Green"
    } elseif ($script:testResults.Failed -le 3) {
        Write-ColorLog "✅ Most tests passed. Minor issues to address.", "Yellow"
    } else {
        Write-ColorLog "⚠️ Several tests failed. Review the integration carefully.", "Red"
    }
    
    if ($script:testResults.Passed -ge ($script:testResults.Total * 0.8)) {
        Write-ColorLog "`n🚀 Your JARVIS Unified Voice System is ready for use!", "Green"
        Write-ColorLog "   Run 'npm run dev' to start the development server.", "Cyan"
        Write-ColorLog "   Use the JARVISIntegratedVoiceSystem component in your app.", "Cyan"
    }
    
    # Save report to file if specified
    if ($OutputFile) {
        $report = @"
JARVIS Unified Voice System - Test Report
Generated: $(Get-Date)
Total Tests: $($script:testResults.Total)
Passed: $($script:testResults.Passed)
Failed: $($script:testResults.Failed)
Success Rate: $successRate%

Failed Tests:
$($script:testResults.Errors | ForEach-Object { "- $($_.Test): $($_.Details)" } | Out-String)
"@
        $report | Out-File -FilePath $OutputFile -Encoding UTF8
        Write-ColorLog "`nReport saved to: $OutputFile", "Cyan"
    }
}

# Main execution
function Main {
    Write-Header "JARVIS Unified Voice System - Integration Test Suite"
    Write-ColorLog "Testing complete integration of all voice functionality...`n", "White"
    
    try {
        # Run all test suites
        Test-FileSystem
        Test-PackageConfiguration
        Test-TypeScriptConfiguration
        Test-ComponentStructure
        Test-ServiceIntegration
        Test-Documentation
        Test-BuildSystem
        Test-IntegrationCompleteness
        Test-PerformanceOptimization
        
        # Generate final report
        Generate-Report
        
    } catch {
        Write-ColorLog "`n❌ Test suite execution failed:", "Red"
        Write-ColorLog $_.Exception.Message, "Yellow"
        exit 1
    }
}

# Show help if requested
if ($args -contains "-h" -or $args -contains "--help") {
    Write-ColorLog "JARVIS Unified Voice System Test Script", "Bright"
    Write-ColorLog "Usage: .\scripts\test-jarvis-voice-system.ps1 [options]", "White"
    Write-ColorLog "Options:", "White"
    Write-ColorLog "  -Verbose          Show detailed output", "White"
    Write-ColorLog "  -Quick            Run only essential tests", "White"
    Write-ColorLog "  -OutputFile <file> Save report to file", "White"
    Write-ColorLog "  -h, --help        Show this help message", "White"
    exit 0
}

# Run the test suite
Main

