# Luna Node.js Installation Script for Windows
# This script will download and install Node.js if not already present

Write-Host "Luna Development Environment Setup" -ForegroundColor Cyan
Write-Host "Installing Node.js for Luna Autonomous Design Agent..." -ForegroundColor Yellow

# Check if Node.js is already installed
try {
    $nodeVersion = node --version 2>$null
    if ($nodeVersion) {
        Write-Host "Node.js is already installed: $nodeVersion" -ForegroundColor Green
        Write-Host "Proceeding with Luna agent setup..." -ForegroundColor Yellow
        exit 0
    }
} catch {
    Write-Host "Node.js not found, proceeding with installation..." -ForegroundColor Yellow
}

# Download Node.js installer
Write-Host "Downloading Node.js installer..." -ForegroundColor Blue
$nodeVersion = "20.11.0"
$nodeUrl = "https://nodejs.org/dist/v$nodeVersion/node-v$nodeVersion-x64.msi"
$installerPath = "$env:TEMP\nodejs-installer.msi"

try {
    Invoke-WebRequest -Uri $nodeUrl -OutFile $installerPath -UseBasicParsing
    Write-Host "Download completed" -ForegroundColor Green
} catch {
    Write-Host "Failed to download Node.js installer" -ForegroundColor Red
    Write-Host "Please download Node.js manually from: https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# Install Node.js silently
Write-Host "Installing Node.js..." -ForegroundColor Blue
try {
    Start-Process -FilePath "msiexec.exe" -ArgumentList "/i `"$installerPath`" /quiet /norestart" -Wait
    Write-Host "Node.js installation completed" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to install Node.js" -ForegroundColor Red
    Write-Host "Please install Node.js manually from: https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# Clean up installer
Remove-Item $installerPath -Force -ErrorAction SilentlyContinue

# Refresh environment variables
Write-Host "🔄 Refreshing environment variables..." -ForegroundColor Blue
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

# Verify installation
try {
    $nodeVersion = node --version
    $npmVersion = npm --version
    Write-Host "✅ Node.js installation verified:" -ForegroundColor Green
    Write-Host "   Node.js: $nodeVersion" -ForegroundColor White
    Write-Host "   npm: $npmVersion" -ForegroundColor White
} catch {
    Write-Host "❌ Node.js installation verification failed" -ForegroundColor Red
    Write-Host "Please restart your terminal and try again" -ForegroundColor Yellow
    exit 1
}

Write-Host "🎉 Node.js installation completed successfully!" -ForegroundColor Green
Write-Host "You can now run: node luna-agent-bootstrap.js" -ForegroundColor Cyan 