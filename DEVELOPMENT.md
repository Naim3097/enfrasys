# Development Setup Guide

## Prerequisites

1. **Node.js** (v16 or higher)
2. **Firebase CLI** - Install globally:
   ```powershell
   npm install -g firebase-tools
   ```

## Quick Start

### Option 1: Automated Setup (Recommended)
```powershell
# Run the development script
.\start-dev.ps1
```

### Option 2: Manual Setup

1. **Install dependencies:**
   ```powershell
   npm install
   ```

2. **Login to Firebase:**
   ```powershell
   firebase login
   ```

3. **Initialize Firebase project:**
   ```powershell
   firebase init
   ```
   - Select Firestore, Functions, and Hosting
   - Use existing project or create new one
   - Accept defaults for most options

4. **Start Firebase Emulators:**
   ```powershell
   firebase emulators:start --only auth,firestore
   ```

5. **In another terminal, start React app:**
   ```powershell
   npm start
   ```

## Configuration

### Firebase Configuration
1. Copy your Firebase project configuration from the Firebase Console
2. Update `.env.local` with your project details:
   ```
   REACT_APP_FIREBASE_API_KEY=your-api-key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   REACT_APP_FIREBASE_PROJECT_ID=your-project-id
   # ... etc
   ```

### Development vs Production
- **Development**: Uses Firebase emulators (localhost)
- **Production**: Uses live Firebase services

## Testing the Application

### Default Test Account
For testing in the emulator, you can create any email/password combination.

### Test Data
1. **Create Suppliers**: Add some test suppliers first
2. **Create Parts**: Add some parts with SKUs and prices
3. **Create Purchase Orders**: Test stock increment
4. **Create Invoices**: Test stock decrement
5. **Stock Count**: Test manual stock reconciliation

## Available URLs

- **React App**: http://localhost:3000
- **Firebase Emulator UI**: http://localhost:4000
- **Firestore Emulator**: http://localhost:8080
- **Auth Emulator**: http://localhost:9099

## Troubleshooting

### Port Conflicts
If ports are in use, update `firebase.json`:
```json
{
  "emulators": {
    "auth": { "port": 9099 },
    "firestore": { "port": 8080 },
    "ui": { "enabled": true, "port": 4000 }
  }
}
```

### Firebase CLI Issues
```powershell
# Update Firebase CLI
npm update -g firebase-tools

# Clear cache
firebase logout
firebase login
```

### React Build Issues
```powershell
# Clear cache and reinstall
Remove-Item node_modules -Recurse -Force
Remove-Item package-lock.json -Force
npm install
```

## Deployment

### Build for Production
```powershell
npm run build
```

### Deploy to Firebase
```powershell
firebase deploy
```

## Project Structure

```
src/
├── components/          # Reusable components
├── contexts/           # React contexts (Auth)
├── pages/              # Page components
├── services/           # Data service layer
├── config/             # Configuration files
├── App.js              # Main app component
└── index.js            # Entry point
```

## Features Implemented

✅ Authentication (Firebase Auth)  
✅ Parts Management (CRUD)  
✅ Suppliers Management (CRUD)  
✅ Purchase Orders (with stock increment)  
✅ Invoices (with stock decrement)  
✅ Stock Count (manual reconciliation)  
✅ Dashboard (overview & low stock alerts)  
✅ Responsive Design  
✅ Real-time updates  
✅ Form validation  
✅ Error handling  
✅ Toast notifications  

## Next Steps

1. **Security Rules**: Customize Firestore rules in `firestore.rules`
2. **Cloud Functions**: Add business logic in `functions/index.js`
3. **UI Enhancements**: Improve styling and add more interactive features
4. **Reports**: Add reporting and analytics
5. **Export/Import**: Add data export/import functionality
