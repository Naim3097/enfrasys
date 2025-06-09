# BYKI LITE - Vercel Environment Variables Setup (PowerShell)
# This script helps set up environment variables in Vercel
# Prerequisites: npm install -g vercel, vercel login, vercel link

Write-Host "🚀 BYKI LITE - Vercel Environment Setup" -ForegroundColor Green
Write-Host "=======================================" -ForegroundColor Green

# Firebase configuration
$env_vars = @{
    "REACT_APP_FIREBASE_API_KEY" = "AIzaSyBloaW6TgHLVPO9HcCtlsQcLl9J32SY9UQ"
    "REACT_APP_FIREBASE_AUTH_DOMAIN" = "sparepart-management-system.firebaseapp.com"
    "REACT_APP_FIREBASE_PROJECT_ID" = "sparepart-management-system"
    "REACT_APP_FIREBASE_STORAGE_BUCKET" = "sparepart-management-system.firebasestorage.app"
    "REACT_APP_FIREBASE_MESSAGING_SENDER_ID" = "673702003106"
    "REACT_APP_FIREBASE_APP_ID" = "1:673702003106:web:4d379e315659d0bc6c72fb"
    "REACT_APP_USE_EMULATOR" = "false"
}

Write-Host "`n📋 Environment variables to set:" -ForegroundColor Yellow
foreach ($key in $env_vars.Keys) {
    Write-Host "$key=$($env_vars[$key])" -ForegroundColor Cyan
}

Write-Host "`n🔧 Setting up environment variables in Vercel..." -ForegroundColor Yellow

foreach ($key in $env_vars.Keys) {
    $value = $env_vars[$key]
    Write-Host "`n📝 Setting $key" -ForegroundColor Green
    Write-Host "Value: $value" -ForegroundColor Gray
    
    # Set environment variable for production
    try {
        $result = vercel env add $key production
        Write-Host "✅ $key set successfully" -ForegroundColor Green
    }
    catch {
        Write-Host "❌ Failed to set $key" -ForegroundColor Red
        Write-Host $_.Exception.Message -ForegroundColor Red
    }
}

Write-Host "`n✅ Environment variables setup complete!" -ForegroundColor Green
Write-Host "`n📋 Next steps:" -ForegroundColor Yellow
Write-Host "1. Go to Firebase Console (https://console.firebase.google.com)" -ForegroundColor White
Write-Host "2. Select your project: sparepart-management-system" -ForegroundColor White
Write-Host "3. Go to Authentication > Settings > Authorized domains" -ForegroundColor White
Write-Host "4. Add your Vercel domain (e.g., bykilite.vercel.app)" -ForegroundColor White
Write-Host "5. Deploy your project: vercel --prod" -ForegroundColor White
Write-Host "`n🎉 Your BYKI LITE app should now work on Vercel!" -ForegroundColor Green
