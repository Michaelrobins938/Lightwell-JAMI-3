# Audio Pipeline Debug Script for Windows PowerShell
# Run this to see exactly where your audio pipeline is breaking
# 
# Usage: .\scripts\test-audio-pipeline.ps1

Write-Host "🔍 Audio Pipeline Debug Script Starting..." -ForegroundColor Cyan
Write-Host ""

# Configuration - update these with your actual values
$CONFIG = @{
    apiKey = $env:OPENAI_API_KEY
    model = "gpt-4o-realtime-preview"
    voice = "ember"
}

Write-Host "📋 Configuration:" -ForegroundColor Yellow
Write-Host "   Model: $($CONFIG.model)"
Write-Host "   Voice: $($CONFIG.voice)"
Write-Host "   API Key: $($CONFIG.apiKey ? '***' + $CONFIG.apiKey.Substring($CONFIG.apiKey.Length - 4) : 'NOT SET')"
Write-Host ""

if (-not $CONFIG.apiKey) {
    Write-Host "❌ Please set OPENAI_API_KEY environment variable" -ForegroundColor Red
    Write-Host "   Set-Item -Path Env:OPENAI_API_KEY -Value 'your-api-key-here'" -ForegroundColor Yellow
    exit 1
}

# Test 1: Basic API Connection
Write-Host "🧪 Test 1: API Connection" -ForegroundColor Green
Write-Host ("─" * 50) -ForegroundColor Gray

try {
    Write-Host "🔌 Testing OpenAI API connection..." -ForegroundColor Yellow
    
    $headers = @{
        "Authorization" = "Bearer $($CONFIG.apiKey)"
        "Content-Type" = "application/json"
    }
    
    $response = Invoke-RestMethod -Uri "https://api.openai.com/v1/models" -Headers $headers -Method Get
    
    Write-Host "✅ API connection successful" -ForegroundColor Green
    Write-Host "📊 Available models: $($response.data.Count)" -ForegroundColor Cyan
    
    # Look for realtime models
    $realtimeModels = $response.data | Where-Object { $_.id -like "*realtime*" -or $_.id -like "*gpt-4o*" }
    
    if ($realtimeModels) {
        Write-Host "🎯 Realtime models found:" -ForegroundColor Green
        foreach ($model in $realtimeModels) {
            Write-Host "   - $($model.id)" -ForegroundColor Cyan
        }
    } else {
        Write-Host "⚠️ No realtime models found" -ForegroundColor Yellow
        Write-Host "💡 First few available models:" -ForegroundColor Gray
        $response.data | Select-Object -First 5 | ForEach-Object {
            Write-Host "   - $($_.id)" -ForegroundColor Gray
        }
    }
    
} catch {
    Write-Host "❌ API connection failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Test 2: Session Creation
Write-Host "🧪 Test 2: Session Creation" -ForegroundColor Green
Write-Host ("─" * 50) -ForegroundColor Gray

try {
    Write-Host "🎯 Testing session creation with audio enabled..." -ForegroundColor Yellow
    
    $sessionPayload = @{
        type = "session.create"
        session = @{
            model = $CONFIG.model
            voice = $CONFIG.voice
            modalities = @("audio", "text")
            audio = @{
                input = @{
                    type = "microphone"
                    sampling_rate = 16000
                }
                output = @{
                    type = "speaker"
                    sampling_rate = 24000
                }
            }
        }
    }
    
    Write-Host "📤 Session payload:" -ForegroundColor Cyan
    $sessionPayload | ConvertTo-Json -Depth 10 | Write-Host
    
    $response = Invoke-RestMethod -Uri "https://api.openai.com/v1/realtime" -Headers $headers -Method Post -Body ($sessionPayload | ConvertTo-Json -Depth 10 -Compress)
    
    Write-Host "✅ Session created successfully" -ForegroundColor Green
    Write-Host "📄 Session data:" -ForegroundColor Cyan
    $response | ConvertTo-Json -Depth 10 | Write-Host
    
} catch {
    Write-Host "❌ Session creation failed: $($_.Exception.Message)" -ForegroundColor Red
    
    if ($_.Exception.Response) {
        $statusCode = $_.Exception.Response.StatusCode
        Write-Host "📡 HTTP Status: $statusCode" -ForegroundColor Yellow
        
        try {
            $errorResponse = $_.Exception.Response.GetResponseStream()
            $reader = New-Object System.IO.StreamReader($errorResponse)
            $errorBody = $reader.ReadToEnd()
            Write-Host "📄 Error details: $errorBody" -ForegroundColor Red
        } catch {
            Write-Host "📄 Could not read error details" -ForegroundColor Yellow
        }
    }
}

Write-Host ""

# Test 3: Audio Processing Simulation
Write-Host "🧪 Test 3: Audio Processing Simulation" -ForegroundColor Green
Write-Host ("─" * 50) -ForegroundColor Gray

try {
    Write-Host "🎵 Testing audio processing pipeline..." -ForegroundColor Yellow
    
    # Simulate a base64 audio chunk
    $mockBase64Audio = "UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT"
    
    Write-Host "🔊 Mock audio chunk (base64): $($mockBase64Audio.Substring(0, 50))..." -ForegroundColor Cyan
    
    # Test base64 decoding
    try {
        $bytes = [Convert]::FromBase64String($mockBase64Audio)
        Write-Host "✅ Base64 decoded successfully" -ForegroundColor Green
        Write-Host "📏 Binary length: $($bytes.Length) bytes" -ForegroundColor Cyan
        Write-Host "🎵 Audio format: Valid" -ForegroundColor Green
    } catch {
        Write-Host "❌ Base64 decoding failed: $($_.Exception.Message)" -ForegroundColor Red
    }
    
    # Test buffer creation
    try {
        $buffer = New-Object byte[] 1024
        Write-Host "✅ Audio buffer created" -ForegroundColor Green
        Write-Host "📦 Buffer size: $($buffer.Length) bytes" -ForegroundColor Cyan
    } catch {
        Write-Host "❌ Audio buffer creation failed: $($_.Exception.Message)" -ForegroundColor Red
    }
    
} catch {
    Write-Host "❌ Audio processing test failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Summary
Write-Host "🏁 Diagnostics Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Summary:" -ForegroundColor Yellow
Write-Host "   • Check the results above to see where your pipeline breaks" -ForegroundColor White
Write-Host "   • If API connection fails, check your API key" -ForegroundColor White
Write-Host "   • If session creation fails, check the payload format" -ForegroundColor White
Write-Host "   • If audio processing fails, check the base64 handling" -ForegroundColor White
Write-Host "   • If no realtime models found, check your OpenAI account access" -ForegroundColor White
Write-Host ""
Write-Host "💡 Next steps:" -ForegroundColor Cyan
Write-Host "   1. Fix any issues identified above" -ForegroundColor White
Write-Host "   2. Run the test again to verify fixes" -ForegroundColor White
Write-Host "   3. Check your browser console for additional WebSocket logs" -ForegroundColor White
