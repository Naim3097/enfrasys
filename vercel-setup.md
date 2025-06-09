# Vercel Deployment Setup for BYKI LITE

## 🚨 CRITICAL: Environment Variables Setup

Your login page is empty on Vercel because Firebase environment variables are not properly configured. Follow these steps:

### Step 1: Set Environment Variables in Vercel Dashboard

1. Go to your Vercel project dashboard
2. Navigate to **Settings → Environment Variables**
3. Add the following variables with their values:

```bash
REACT_APP_FIREBASE_API_KEY=AIzaSyBloaW6TgHLVPO9HcCtlsQcLl9J32SY9UQ
REACT_APP_FIREBASE_AUTH_DOMAIN=sparepart-management-system.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=sparepart-management-system
REACT_APP_FIREBASE_STORAGE_BUCKET=sparepart-management-system.firebasestorage.app
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=673702003106
REACT_APP_FIREBASE_APP_ID=1:673702003106:web:4d379e315659d0bc6c72fb
```

### Step 2: Firebase Console Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `sparepart-management-system`
3. Go to **Authentication → Settings → Authorized domains**
4. Add your Vercel domain (e.g., `your-project.vercel.app`)

### Step 3: Redeploy

After setting environment variables, trigger a new deployment:
- Push a new commit to GitHub, OR
- Go to Vercel Dashboard → Deployments → Redeploy

## 🔧 Quick Fix Commands

If you have Vercel CLI installed:

```powershell
# Set environment variables via CLI
vercel env add REACT_APP_FIREBASE_API_KEY
vercel env add REACT_APP_FIREBASE_AUTH_DOMAIN
vercel env add REACT_APP_FIREBASE_PROJECT_ID
vercel env add REACT_APP_FIREBASE_STORAGE_BUCKET
vercel env add REACT_APP_FIREBASE_MESSAGING_SENDER_ID
vercel env add REACT_APP_FIREBASE_APP_ID

# Then redeploy
vercel --prod
```

## 🐛 Debugging

If the page is still empty after setup:

1. Check browser console for errors
2. Look for Firebase configuration logs
3. Verify all environment variables are set in Vercel
4. Ensure Firebase project is active and billing is enabled

## ✅ Expected Result

After proper setup, you should see:
- Login form loads properly
- Demo account section appears
- Firebase authentication works
- No console errors

---

**Note**: The fallback configuration in `firebaseConfig.js` should prevent empty pages, but proper environment variables are still recommended for security.
