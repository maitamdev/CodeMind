# Start AI Service
$ErrorActionPreference = "Stop"

Write-Host "Starting AI Roadmap Generator Service..." -ForegroundColor Cyan

# Ensure we are in the right directory
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
if ((Get-Location).Path -ne $scriptDir) {
    Set-Location $scriptDir
}

# Create virtual environment if it doesn't exist
if (-not (Test-Path ".\venv")) {
    Write-Host "Creating virtual environment..." -ForegroundColor Yellow
    python -m venv venv
}

# Activate virtual environment
Write-Host "Activating virtual environment..." -ForegroundColor Yellow
$activateScript = ".\venv\Scripts\Activate.ps1"
if (Test-Path $activateScript) {
    . $activateScript
} else {
    Write-Host "Failed to find activate script at $activateScript" -ForegroundColor Red
    exit 1
}

# Install requirements
Write-Host "Installing/Verifying dependencies..." -ForegroundColor Yellow
pip install -r requirements.txt

# Start the service
Write-Host "Starting FastAPI server on port 8000..." -ForegroundColor Green
python main.py
