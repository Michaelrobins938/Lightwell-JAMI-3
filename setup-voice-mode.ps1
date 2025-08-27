# Voice Mode Integration Setup Script
# This script helps set up and test the voice mode integration

Write-Host "Setting up Voice Mode Integration..." -ForegroundColor Green

# Check if .env.local exists
if (!(Test-Path ".env.local")) {
    Write-Host ".env.local not found. Creating template..." -ForegroundColor Yellow
    
    $envContent = @"
# OpenAI API Configuration
OPENAI_API_KEY=sk-your-api-key-here

# ChatGPT WebSocket Endpoint (optional)
NEXT_PUBLIC_CHATGPT_ENDPOINT=wss://api.openai.com/v1/chat/completions

# Voice Mode Configuration
NEXT_PUBLIC_VOICE_MODE_ENABLED=true
NEXT_PUBLIC_DEFAULT_VOICE=ember
"@
    
    $envContent | Out-File -FilePath ".env.local" -Encoding UTF8
    Write-Host "Created .env.local template" -ForegroundColor Green
    Write-Host "Please edit .env.local and add your OpenAI API key" -ForegroundColor Cyan
} else {
    Write-Host ".env.local already exists" -ForegroundColor Green
}

# Check if voice-mode directory exists
if (Test-Path "src/voice-mode") {
    Write-Host "Voice mode directory found" -ForegroundColor Green
} else {
    Write-Host "Voice mode directory not found!" -ForegroundColor Red
    Write-Host "Please ensure the voice-mode folder is copied to src/voice-mode" -ForegroundColor Yellow
    exit 1
}

# Check for required dependencies
Write-Host "Checking dependencies..." -ForegroundColor Cyan

$packageJson = Get-Content "package.json" | ConvertFrom-Json
$dependencies = $packageJson.dependencies

$requiredDeps = @("openai", "framer-motion", "react", "react-dom")
$missingDeps = @()

foreach ($dep in $requiredDeps) {
    if ($dependencies.PSObject.Properties.Name -notcontains $dep) {
        $missingDeps += $dep
    }
}

if ($missingDeps.Count -gt 0) {
    Write-Host "Missing dependencies: $($missingDeps -join ', ')" -ForegroundColor Yellow
    Write-Host "Installing missing dependencies..." -ForegroundColor Cyan
    npm install $missingDeps
} else {
    Write-Host "All required dependencies are installed" -ForegroundColor Green
}

# Check TypeScript compilation
Write-Host "Checking TypeScript compilation..." -ForegroundColor Cyan
try {
    npx tsc --noEmit
    Write-Host "TypeScript compilation successful" -ForegroundColor Green
} catch {
    Write-Host "TypeScript compilation failed. Please fix the errors above." -ForegroundColor Red
}

Write-Host ""
Write-Host "Voice Mode Integration Setup Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Edit .env.local and add your OpenAI API key" -ForegroundColor White
Write-Host "2. Run 'npm run dev' to start the development server" -ForegroundColor White
Write-Host "3. Navigate to http://localhost:3000/chat" -ForegroundColor White
Write-Host "4. Click the voice mode button (purple button with sound waves) in the input bar" -ForegroundColor White
Write-Host "5. Test the voice mode functionality" -ForegroundColor White
Write-Host ""
Write-Host "Features available:" -ForegroundColor Cyan
Write-Host "- Voice orb with real-time audio visualization" -ForegroundColor White
Write-Host "- PCM16 audio processing" -ForegroundColor White
Write-Host "- ChatGPT protocol integration" -ForegroundColor White
Write-Host "- Multiple voice personalities" -ForegroundColor White
Write-Host "- Real-time audio streaming" -ForegroundColor White
