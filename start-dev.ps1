# PowerShell script to start the development environment
Write-Host "🚀 Starting Sparepart Management System Development Environment" -ForegroundColor Green
Write-Host ""

# Check if Firebase CLI is installed
try {
    $firebaseVersion = firebase --version 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Firebase CLI is installed: $firebaseVersion" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Firebase CLI not found. Installing..." -ForegroundColor Red
    Write-Host "Please run: npm install -g firebase-tools" -ForegroundColor Yellow
    exit 1
}

# Check if dependencies are installed
if (!(Test-Path "node_modules")) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
    npm install
}

Write-Host ""
Write-Host "🔥 Starting Firebase Emulators..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "firebase emulators:start --only auth,firestore"

Write-Host "⏳ Waiting 5 seconds for emulators to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

Write-Host ""
Write-Host "⚛️  Starting React Development Server..." -ForegroundColor Cyan
Write-Host "🌐 Application will be available at: http://localhost:3000" -ForegroundColor Green
Write-Host "🔧 Firebase Emulator UI: http://localhost:4000" -ForegroundColor Green
Write-Host ""

npm start
