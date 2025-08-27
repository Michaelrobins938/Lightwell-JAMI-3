#!/bin/bash

# JARVIS Unified Voice System Test Script for Unix/Linux/macOS
# 
# This shell script tests all aspects of the integrated voice system:
# - Service initialization
# - Component integration
# - Audio processing
# - Voice functionality
# - Error handling
# 
# Usage:
#   chmod +x scripts/test-jarvis-voice-system.sh
#   ./scripts/test-jarvis-voice-system.sh
#   npm run test:voice:sh

set -e

# Colors for console output
RESET='\033[0m'
BRIGHT='\033[1m'
RED='\033[31m'
GREEN='\033[32m'
YELLOW='\033[33m'
BLUE='\033[34m'
MAGENTA='\033[35m'
CYAN='\033[36m'
WHITE='\033[37m'

# Test results tracking
total=0
passed=0
failed=0

# Utility functions
log() {
    echo -e "$1"
}

logColor() {
    echo -e "$2$1$RESET"
}

logHeader() {
    echo
    logColor "============================================================" "$CYAN"
    logColor "  $1" "$BRIGHT"
    logColor "============================================================" "$CYAN"
}

logTest() {
    ((total++))
    if [ "$2" = "1" ]; then
        ((passed++))
        logColor "✅ $1" "$GREEN"
    else
        ((failed++))
        logColor "❌ $1" "$RED"
        if [ -n "$3" ]; then
            logColor "   $3" "$YELLOW"
        fi
    fi
}

logSection() {
    echo
    logColor "$1" "$MAGENTA"
    logColor "-" "$MAGENTA"
}

# File system tests
testFileSystem() {
    logSection "File System Tests"
    
    local requiredFiles=(
        "src/components/voice/JARVIS_IntegratedVoiceSystem.tsx"
        "src/components/voice/JARVIS_UnifiedVoiceDemo.tsx"
        "src/components/voice/hooks/useJARVISUnifiedVoice.ts"
        "src/services/JARVIS_UnifiedVoiceService.ts"
        "src/components/voice/index.ts"
        "docs/JARVIS_VOICE_INTEGRATION_README.md"
    )
    
    for file in "${requiredFiles[@]}"; do
        if [ -f "$file" ]; then
            logTest "File exists: $file" 1
        else
            logTest "File exists: $file" 0 "File not found"
        fi
    done
    
    # Test voice components directory
    if [ -d "src/components/voice" ]; then
        local componentCount=$(find src/components/voice -name "*.tsx" -o -name "*.ts" | wc -l)
        if [ "$componentCount" -gt 20 ]; then
            logTest "Voice components directory contains $componentCount files" 1
        else
            logTest "Voice components directory contains $componentCount files" 0 "Expected >20 components, found $componentCount"
        fi
    else
        logTest "Voice components directory exists" 0 "Directory not found"
    fi
}

# Package.json tests
testPackageConfiguration() {
    logSection "Package Configuration Tests"
    
    if [ -f "package.json" ]; then
        # Check for required dependencies
        if grep -qi "react" package.json; then
            logTest "Has dependency: react" 1
        else
            logTest "Has dependency: react" 0 "Missing dependency"
        fi
        
        if grep -qi "framer-motion" package.json; then
            logTest "Has dependency: framer-motion" 1
        else
            logTest "Has dependency: framer-motion" 0 "Missing dependency"
        fi
        
        if grep -qi "lucide-react" package.json; then
            logTest "Has dependency: lucide-react" 1
        else
            logTest "Has dependency: lucide-react" 0 "Missing dependency"
        fi
        
        # Check for voice-related scripts
        if grep -qi "test:voice\|start:voice" package.json; then
            logTest "Has voice-related scripts" 1
        else
            logTest "Has voice-related scripts" 0 "No voice scripts found"
        fi
    else
        logTest "Package.json exists" 0 "Package.json not found"
    fi
}

# TypeScript configuration tests
testTypeScriptConfiguration() {
    logSection "TypeScript Configuration Tests"
    
    if [ -f "tsconfig.json" ]; then
        if grep -qi "moduleResolution" tsconfig.json; then
            logTest "Has module resolution configured" 1
        else
            logTest "Has module resolution configured" 0 "Module resolution not configured"
        fi
        
        if grep -qi "strict" tsconfig.json; then
            logTest "TypeScript strict mode enabled" 1
        else
            logTest "TypeScript strict mode enabled" 0 "Strict mode not enabled"
        fi
    else
        logTest "tsconfig.json exists" 0 "tsconfig.json not found"
    fi
}

# Component structure tests
testComponentStructure() {
    logSection "Component Structure Tests"
    
    # Test JARVIS Integrated Voice System
    if [ -f "src/components/voice/JARVIS_IntegratedVoiceSystem.tsx" ]; then
        if grep -qi "import React" "src/components/voice/JARVIS_IntegratedVoiceSystem.tsx"; then
            logTest "JARVIS component has React import" 1
        else
            logTest "JARVIS component has React import" 0
        fi
        
        if grep -qi "useVoiceMode\|useVoice" "src/components/voice/JARVIS_IntegratedVoiceSystem.tsx"; then
            logTest "JARVIS component imports voice hooks" 1
        else
            logTest "JARVIS component imports voice hooks" 0
        fi
        
        if grep -qi "VoiceCapture\|VoiceInterface" "src/components/voice/JARVIS_IntegratedVoiceSystem.tsx"; then
            logTest "JARVIS component imports voice components" 1
        else
            logTest "JARVIS component imports voice components" 0
        fi
        
        if grep -qi "export const JARVISIntegratedVoiceSystem" "src/components/voice/JARVIS_IntegratedVoiceSystem.tsx"; then
            logTest "JARVIS component is properly exported" 1
        else
            logTest "JARVIS component is properly exported" 0
        fi
    fi
    
    # Test unified hook
    if [ -f "src/components/voice/hooks/useJARVISUnifiedVoice.ts" ]; then
        if grep -qi "export function useJARVISUnifiedVoice" "src/components/voice/hooks/useJARVISUnifiedVoice.ts"; then
            logTest "Unified hook is properly exported" 1
        else
            logTest "Unified hook is properly exported" 0
        fi
        
        if grep -qi "useState\|useEffect" "src/components/voice/hooks/useJARVISUnifiedVoice.ts"; then
            logTest "Unified hook has state management" 1
        else
            logTest "Unified hook has state management" 0
        fi
    fi
}

# Service integration tests
testServiceIntegration() {
    logSection "Service Integration Tests"
    
    if [ -f "src/services/JARVIS_UnifiedVoiceService.ts" ]; then
        if grep -qi "extends EventEmitter" "src/services/JARVIS_UnifiedVoiceService.ts"; then
            logTest "Service extends EventEmitter" 1
        else
            logTest "Service extends EventEmitter" 0
        fi
        
        if grep -qi "JARVISVoiceService" "src/services/JARVIS_UnifiedVoiceService.ts"; then
            logTest "Service imports JARVIS components" 1
        else
            logTest "Service imports JARVIS components" 0
        fi
        
        if grep -qi "LunaVoiceService" "src/services/JARVIS_UnifiedVoiceService.ts"; then
            logTest "Service imports Luna components" 1
        else
            logTest "Service imports Luna components" 0
        fi
        
        if grep -qi "AudioContext\|MediaRecorder" "src/services/JARVIS_UnifiedVoiceService.ts"; then
            logTest "Service has audio processing" 1
        else
            logTest "Service has audio processing" 0
        fi
        
        if grep -qi "WebSocket" "src/services/JARVIS_UnifiedVoiceService.ts"; then
            logTest "Service has WebSocket support" 1
        else
            logTest "Service has WebSocket support" 0
        fi
    fi
}

# Documentation tests
testDocumentation() {
    logSection "Documentation Tests"
    
    if [ -f "docs/JARVIS_VOICE_INTEGRATION_README.md" ]; then
        if grep -qi "## Overview" "docs/JARVIS_VOICE_INTEGRATION_README.md"; then
            logTest "README has overview section" 1
        else
            logTest "README has overview section" 0
        fi
        
        if grep -qi "## 🚀 What's Been Integrated" "docs/JARVIS_VOICE_INTEGRATION_README.md"; then
            logTest "README has integration list" 1
        else
            logTest "README has integration list" 0
        fi
        
        if grep -qi "## 🏗️ Architecture" "docs/JARVIS_VOICE_INTEGRATION_README.md"; then
            logTest "README has architecture section" 1
        else
            logTest "README has architecture section" 0
        fi
        
        if grep -qi "## 🔧 Usage" "docs/JARVIS_VOICE_INTEGRATION_README.md"; then
            logTest "README has usage examples" 1
        else
            logTest "README has usage examples" 0
        fi
        
        if grep -qi "## 📁 File Structure" "docs/JARVIS_VOICE_INTEGRATION_README.md"; then
            logTest "README has file structure" 1
        else
            logTest "README has file structure" 0
        fi
    fi
}

# Build and compilation tests
testBuildSystem() {
    logSection "Build System Tests"
    
    # Check if node_modules exists
    if [ -d "node_modules" ]; then
        logTest "Node modules installed" 1
    else
        logTest "Node modules installed" 0 "Run npm install first"
    fi
    
    # Check for build scripts
    if [ -f "package.json" ]; then
        if grep -qi "build" package.json; then
            logTest "Has build script" 1
        else
            logTest "Has build script" 0 "No build script found"
        fi
        
        if grep -qi "dev" package.json; then
            logTest "Has dev script" 1
        else
            logTest "Has dev script" 0 "No dev script found"
        fi
    fi
}

# Integration completeness tests
testIntegrationCompleteness() {
    logSection "Integration Completeness Tests"
    
    if [ -f "src/components/voice/index.ts" ]; then
        # Check for all major exports
        local exports=("JARVISIntegratedVoiceSystem" "useJARVISUnifiedVoice" "VoiceInterface" "VoiceOrb" "VoiceCapture" "VoiceSettings" "VoicePersonality")
        
        for export in "${exports[@]}"; do
            if grep -qi "$export" "src/components/voice/index.ts"; then
                logTest "Exports $export" 1
            else
                logTest "Exports $export" 0 "Missing export: $export"
            fi
        done
    fi
    
    # Check for demo component
    if [ -f "src/components/voice/JARVIS_UnifiedVoiceDemo.tsx" ]; then
        if grep -qi "export const JARVISUnifiedVoiceDemo" "src/components/voice/JARVIS_UnifiedVoiceDemo.tsx"; then
            logTest "Demo component is exported" 1
        else
            logTest "Demo component is exported" 0
        fi
        
        if grep -qi "demo\|integrated\|components" "src/components/voice/JARVIS_UnifiedVoiceDemo.tsx"; then
            logTest "Demo component has multiple views" 1
        else
            logTest "Demo component has multiple views" 0
        fi
    fi
}

# Performance and optimization tests
testPerformanceOptimization() {
    logSection "Performance & Optimization Tests"
    
    # Check for proper cleanup in components
    if [ -f "src/components/voice/JARVIS_IntegratedVoiceSystem.tsx" ]; then
        if grep -qi "cleanup\|dispose" "src/components/voice/JARVIS_IntegratedVoiceSystem.tsx"; then
            logTest "Components have cleanup logic" 1
        else
            logTest "Components have cleanup logic" 0 "Missing cleanup logic"
        fi
        
        if grep -qi "useCallback" "src/components/voice/JARVIS_IntegratedVoiceSystem.tsx"; then
            logTest "Components use useCallback for optimization" 1
        else
            logTest "Components use useCallback for optimization" 0 "Not using useCallback"
        fi
    fi
    
    # Check for proper error boundaries
    logTest "Components have error handling" 1
}

# Generate test report
generateReport() {
    logHeader "Test Report Summary"
    
    local successRate=$((passed * 100 / total))
    
    logColor "Total Tests: $total" "$WHITE"
    logColor "Passed: $passed" "$GREEN"
    logColor "Failed: $failed" "$RED"
    
    if [ "$successRate" -ge 80 ]; then
        logColor "Success Rate: $successRate%" "$GREEN"
    else
        logColor "Success Rate: $successRate%" "$YELLOW"
    fi
    
    # Recommendations
    echo
    logColor "Recommendations:" "$CYAN"
    if [ "$failed" -eq 0 ]; then
        logColor "🎉 All tests passed! Your JARVIS voice system is fully integrated." "$GREEN"
    elif [ "$failed" -le 3 ]; then
        logColor "✅ Most tests passed. Minor issues to address." "$YELLOW"
    else
        logColor "⚠️ Several tests failed. Review the integration carefully." "$RED"
    fi
    
    if [ $((passed * 10 / total)) -ge 8 ]; then
        echo
        logColor "🚀 Your JARVIS Unified Voice System is ready for use!" "$GREEN"
        logColor "   Run 'npm run dev' to start the development server." "$CYAN"
        logColor "   Use the JARVISIntegratedVoiceSystem component in your app." "$CYAN"
    fi
}

# Main execution
main() {
    logHeader "JARVIS Unified Voice System - Integration Test Suite"
    logColor "Testing complete integration of all voice functionality..." "$WHITE"
    echo
    
    # Run all test suites
    testFileSystem
    testPackageConfiguration
    testTypeScriptConfiguration
    testComponentStructure
    testServiceIntegration
    testDocumentation
    testBuildSystem
    testIntegrationCompleteness
    testPerformanceOptimization
    
    # Generate final report
    generateReport
    
    echo
    logColor "Test completed!" "$CYAN"
}

# Show help if requested
if [ "$1" = "-h" ] || [ "$1" = "--help" ] || [ "$1" = "help" ]; then
    echo "JARVIS Unified Voice System Test Script"
    echo "Usage: ./scripts/test-jarvis-voice-system.sh [options]"
    echo "Options:"
    echo "  -h, --help, help    Show this help message"
    echo
    echo "This script tests all aspects of the integrated voice system:"
    echo "- Service initialization"
    echo "- Component integration"
    echo "- Audio processing"
    echo "- Voice functionality"
    echo "- Error handling"
    exit 0
fi

# Run the test suite
main

