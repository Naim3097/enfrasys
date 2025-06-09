# BYKI LITE - Vercel Deployment Guide

## 🚀 Quick Setup (Automated)

### Option 1: PowerShell Script (Windows)
```powershell
# Run the automated setup script
./setup-vercel-env.ps1
```

### Option 2: Node.js Script (Cross-platform)
```bash
# Install Vercel CLI if not already installed
npm install -g vercel

# Run the setup script
node vercel-env-setup.js
```

## 📋 Manual Setup Steps

### 1. Install Vercel CLI
```bash
npm install -g vercel
```

### 2. Login to Vercel
```bash
vercel login
```

### 3. Link Your Project
```bash
# In your project directory
vercel link

# Follow the prompts:
# - Link to existing project? Y
# - Select your project or create new one
```

### 4. Set Environment Variables (CRITICAL)

**⚠️ IMPORTANT: These environment variables are REQUIRED for Firebase to work on Vercel**

Run these commands one by one:

```bash
# Firebase API Key
vercel env add REACT_APP_FIREBASE_API_KEY
# Enter: AIzaSyBloaW6TgHLVPO9HcCtlsQcLl9J32SY9UQ

# Firebase Auth Domain  
vercel env add REACT_APP_FIREBASE_AUTH_DOMAIN
# Enter: sparepart-management-system.firebaseapp.com

# Firebase Project ID
vercel env add REACT_APP_FIREBASE_PROJECT_ID  
# Enter: sparepart-management-system

# Firebase Storage Bucket
vercel env add REACT_APP_FIREBASE_STORAGE_BUCKET
# Enter: sparepart-management-system.firebasestorage.app

# Firebase Messaging Sender ID
vercel env add REACT_APP_FIREBASE_MESSAGING_SENDER_ID
# Enter: 673702003106

# Firebase App ID
vercel env add REACT_APP_FIREBASE_APP_ID
# Enter: 1:673702003106:web:4d379e315659d0bc6c72fb

# Disable Firebase Emulator for production
vercel env add REACT_APP_USE_EMULATOR
# Enter: false
```

### 5. Configure Firebase Console (CRITICAL)

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select project: **sparepart-management-system**
3. Navigate to **Authentication** → **Settings** → **Authorized domains**
4. Click **Add domain**
5. Add your Vercel domain (e.g., `bykilite.vercel.app`)
6. Click **Done**

### 6. Deploy to Vercel
```bash
# Deploy to production
vercel --prod
```

## 🔧 Troubleshooting

### Issue: "Firebase API key problem" on Vercel

**Solution:**
1. Verify all environment variables are set in Vercel dashboard
2. Check Firebase Console authorized domains
3. Ensure no hardcoded values in firebaseConfig.js

### Issue: Demo account login fails

**Solution:**
1. Try creating demo account manually:
   - Email: `demo@byki.com`
   - Password: `demo123456`
2. Check Firebase Authentication is enabled
3. Verify email/password provider is enabled in Firebase Console

### Issue: Build fails on Vercel

**Solution:**
1. Check environment variables are set for **production** environment
2. Verify no syntax errors in React components
3. Check Vercel build logs for specific errors

## 📱 Testing Your Deployment

1. Visit your Vercel URL
2. Try demo login: `demo@byki.com` / `demo123456`
3. Check browser console for any Firebase errors
4. Test core functionality: Dashboard, Work Orders, Inventory

## 🎯 Expected Result

✅ **Working Demo Login**
✅ **Firebase Authentication**  
✅ **Full Workshop Management System**
✅ **Responsive Design**

---

## 🆘 Need Help?

If you encounter issues:
1. Check Vercel deployment logs
2. Verify Firebase Console settings
3. Test locally first with `npm start`
4. Compare local vs production environment variables
