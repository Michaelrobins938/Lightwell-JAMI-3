# 🧪 JARVIS Voice System Testing Guide

This guide covers all the executable scripts available for testing the integrated JARVIS Unified Voice System.

## 📋 Overview

The testing suite provides multiple executable formats to verify that all voice functionality has been properly integrated under the JARVIS system:

- **Node.js Script** - Cross-platform JavaScript execution
- **PowerShell Script** - Windows-specific testing with enhanced features
- **Batch File** - Windows command prompt compatibility
- **Shell Script** - Unix/Linux/macOS compatibility

## 🚀 Quick Start

### Prerequisites
- Node.js installed (for Node.js script)
- npm/yarn package manager
- All dependencies installed (`npm install`)

### Run All Tests
```bash
# Using npm scripts (recommended)
npm run test:voice        # Node.js script
npm run test:voice:ps     # PowerShell script (Windows)
npm run test:voice:bat    # Batch file (Windows)
npm run test:voice:sh     # Shell script (Unix/Linux/macOS)
```

## 📁 Script Details

### 1. Node.js Script (`scripts/test-jarvis-voice-system.js`)

**Best for:** Cross-platform development, CI/CD pipelines, automated testing

**Features:**
- ✅ Cross-platform compatibility
- ✅ Rich console output with colors
- ✅ Comprehensive error reporting
- ✅ Easy integration with build tools
- ✅ JSON output support (future enhancement)

**Usage:**
```bash
# Direct execution
node scripts/test-jarvis-voice-system.js

# Via npm
npm run test:voice

# With Node.js options
node --max-old-space-size=4096 scripts/test-jarvis-voice-system.js
```

**Output Example:**
```
============================================================
  JARVIS Unified Voice System - Integration Test Suite
============================================================
Testing complete integration of all voice functionality...

File System Tests
-----------------
✅ File exists: src/components/voice/JARVIS_IntegratedVoiceSystem.tsx
✅ File exists: src/components/voice/JARVIS_UnifiedVoiceDemo.tsx
✅ File exists: src/components/voice/hooks/useJARVISUnifiedVoice.ts
...
```

### 2. PowerShell Script (`scripts/test-jarvis-voice-system.ps1`)

**Best for:** Windows development, PowerShell automation, detailed Windows testing

**Features:**
- ✅ Windows-optimized testing
- ✅ PowerShell-specific features
- ✅ Enhanced error handling
- ✅ Output file support
- ✅ Verbose logging options

**Usage:**
```powershell
# Direct execution
.\scripts\test-jarvis-voice-system.ps1

# Via npm
npm run test:voice:ps

# With parameters
.\scripts\test-jarvis-voice-system.ps1 -Verbose -OutputFile "test-results.txt"

# Help
.\scripts\test-jarvis-voice-system.ps1 -h
```

**Parameters:**
- `-Verbose`: Detailed logging
- `-Quick`: Skip time-consuming tests
- `-OutputFile <path>`: Save results to file

### 3. Batch File (`scripts/test-jarvis-voice-system.bat`)

**Best for:** Windows command prompt, simple Windows testing, non-PowerShell environments

**Features:**
- ✅ Windows command prompt compatibility
- ✅ No PowerShell execution policy issues
- ✅ Simple execution
- ✅ Color-coded output
- ✅ Interactive pause at end

**Usage:**
```cmd
# Direct execution
scripts\test-jarvis-voice-system.bat

# Via npm
npm run test:voice:bat

# With help
scripts\test-jarvis-voice-system.bat help
```

### 4. Shell Script (`scripts/test-jarvis-voice-system.sh`)

**Best for:** Unix/Linux/macOS development, CI/CD on Linux servers, Docker containers

**Features:**
- ✅ Unix/Linux/macOS compatibility
- ✅ Bash scripting features
- ✅ POSIX compliance
- ✅ Easy integration with shell workflows
- ✅ Git-friendly line endings

**Usage:**
```bash
# Make executable and run
chmod +x scripts/test-jarvis-voice-system.sh
./scripts/test-jarvis-voice-system.sh

# Via npm
npm run test:voice:sh

# With help
./scripts/test-jarvis-voice-system.sh --help
```

## 🧪 Test Categories

All scripts test the same comprehensive set of functionality:

### File System Tests
- ✅ Required file existence
- ✅ Component directory structure
- ✅ File count validation

### Package Configuration Tests
- ✅ Dependencies verification
- ✅ Script availability
- ✅ Package.json integrity

### TypeScript Configuration Tests
- ✅ Module resolution
- ✅ Strict mode settings
- ✅ Compiler options

### Component Structure Tests
- ✅ React imports
- ✅ Hook integration
- ✅ Component exports
- ✅ Voice component imports

### Service Integration Tests
- ✅ EventEmitter inheritance
- ✅ JARVIS service imports
- ✅ Luna service imports
- ✅ Audio processing
- ✅ WebSocket support

### Documentation Tests
- ✅ README sections
- ✅ Architecture documentation
- ✅ Usage examples
- ✅ File structure docs

### Build System Tests
- ✅ Node modules
- ✅ Build scripts
- ✅ Development scripts

### Integration Completeness Tests
- ✅ Export verification
- ✅ Component availability
- ✅ Demo component
- ✅ Multiple view support

### Performance & Optimization Tests
- ✅ Cleanup logic
- ✅ useCallback usage
- ✅ Error handling

## 📊 Understanding Results

### Success Indicators
- **🎉 All tests passed**: System is fully integrated and ready
- **✅ Most tests passed**: Minor issues to address
- **⚠️ Several tests failed**: Review integration carefully

### Success Rate Thresholds
- **80%+**: System is ready for use
- **60-79%**: System needs attention
- **<60%**: System requires significant work

### Common Issues & Solutions

#### Missing Files
```
❌ File exists: src/components/voice/JARVIS_IntegratedVoiceSystem.tsx
   File not found
```
**Solution:** Run the integration process to create missing components

#### Missing Dependencies
```
❌ Has dependency: framer-motion
   Missing dependency
```
**Solution:** Run `npm install` to install missing packages

#### Export Issues
```
❌ Exports VoiceInterface
   Missing export: VoiceInterface
```
**Solution:** Check `src/components/voice/index.ts` for missing exports

#### TypeScript Errors
```
❌ TypeScript strict mode enabled
   Strict mode not enabled
```
**Solution:** Update `tsconfig.json` to enable strict mode

## 🔧 Customization

### Adding Custom Tests

Each script can be extended with custom test functions:

**Node.js Example:**
```javascript
function testCustomFeature() {
    logSection('Custom Feature Tests');
    
    // Your custom test logic here
    const customFile = 'src/custom/feature.ts';
    const exists = fs.existsSync(customFile);
    logTest(`Custom feature exists: ${customFile}`, exists);
}

// Add to main() function
testCustomFeature();
```

**PowerShell Example:**
```powershell
function Test-CustomFeature {
    Write-Section "Custom Feature Tests"
    
    # Your custom test logic here
    $customFile = "src\custom\feature.ts"
    $exists = Test-Path $customFile
    Write-Test "Custom feature exists: $customFile" $exists
}

# Add to Main function
Test-CustomFeature
```

### Environment-Specific Testing

Add environment checks to your tests:

```javascript
// Node.js
if (process.env.NODE_ENV === 'production') {
    testProductionFeatures();
}

// PowerShell
if ($env:NODE_ENV -eq 'production') {
    Test-ProductionFeatures
}
```

## 🚀 Integration with CI/CD

### GitHub Actions Example
```yaml
name: Test JARVIS Voice System
on: [push, pull_request]
jobs:
  test:
    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        os: [ubuntu-latest, windows-latest, macos-latest]
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run test:voice
```

### Docker Integration
```dockerfile
# Test stage
FROM node:18-alpine AS test
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run test:voice:sh
```

## 📈 Performance Monitoring

### Test Execution Times
Monitor how long tests take to identify performance regressions:

```bash
# Time execution
time npm run test:voice

# PowerShell timing
Measure-Command { npm run test:voice:ps }
```

### Memory Usage
```bash
# Node.js memory profiling
node --inspect scripts/test-jarvis-voice-system.js

# PowerShell memory check
Get-Process | Where-Object {$_.ProcessName -eq "powershell"}
```

## 🐛 Troubleshooting

### Common Script Issues

#### Permission Denied (Unix/Linux/macOS)
```bash
chmod +x scripts/test-jarvis-voice-system.sh
```

#### PowerShell Execution Policy (Windows)
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

#### Node.js Version Issues
```bash
# Check version
node --version

# Use nvm for version management
nvm use 18
```

#### Missing Dependencies
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

### Debug Mode

Enable verbose logging:

**Node.js:**
```bash
DEBUG=* npm run test:voice
```

**PowerShell:**
```powershell
npm run test:voice:ps -Verbose
```

**Shell:**
```bash
bash -x scripts/test-jarvis-voice-system.sh
```

## 📚 Additional Resources

- [JARVIS Voice Integration README](./JARVIS_VOICE_INTEGRATION_README.md)
- [Voice System Architecture](./JARVIS_VOICE_ARCHITECTURE.md)
- [Component API Reference](./VOICE_COMPONENT_API.md)

## 🤝 Support

If you encounter issues with the testing scripts:

1. **Check the troubleshooting section above**
2. **Verify your environment meets prerequisites**
3. **Run with verbose logging for detailed output**
4. **Check the integration README for system requirements**
5. **Open an issue with detailed error information**

---

**Happy Testing! 🎉**

Your JARVIS Unified Voice System is now fully testable across all major platforms and environments.

