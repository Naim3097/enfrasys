@echo off
echo 🚀 Starting Sparepart Management System Development Environment
echo.

REM Check if Firebase CLI is installed
firebase --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Firebase CLI not found. Please install it first:
    echo npm install -g firebase-tools
    pause
    exit /b 1
)

echo ✅ Firebase CLI is installed

REM Check if dependencies are installed
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    call npm install
)

echo.
echo 🔥 Starting Firebase Emulators...
start "Firebase Emulators" cmd /k "firebase emulators:start --only auth,firestore"

echo ⏳ Waiting 5 seconds for emulators to start...
timeout /t 5 /nobreak >nul

echo.
echo ⚛️  Starting React Development Server...
echo 🌐 Application will be available at: http://localhost:3000
echo 🔧 Firebase Emulator UI: http://localhost:4000
echo.

call npm start
