# 🚀 VERCEL DEPLOYMENT GUIDE - BYKI LITE

## ⚠️ Critical Setup for Vercel Deployment

### 1. Environment Variables Setup in Vercel

You need to add these environment variables in your Vercel dashboard:

**Go to:** https://vercel.com/[your-username]/[project-name]/settings/environment-variables

**Add these variables:**

```env
REACT_APP_FIREBASE_API_KEY=AIzaSyBloaW6TgHLVPO9HcCtlsQcLl9J32SY9UQ
REACT_APP_FIREBASE_AUTH_DOMAIN=sparepart-management-system.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=sparepart-management-system
REACT_APP_FIREBASE_STORAGE_BUCKET=sparepart-management-system.firebasestorage.app
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=673702003106
REACT_APP_FIREBASE_APP_ID=1:673702003106:web:4d379e315659d0bc6c72fb
REACT_APP_USE_EMULATOR=false
```

### 2. Firebase Console - Authorized Domains

**CRITICAL:** You must add your Vercel domain to Firebase authorized domains:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `sparepart-management-system`
3. Go to **Authentication** → **Settings** → **Authorized domains**
4. Add your Vercel domains:
   - `your-project-name.vercel.app`
   - `your-project-name-git-main.vercel.app` (preview deployments)
   - `your-custom-domain.com` (if you have one)

### 3. Enable Firebase Authentication

1. In Firebase Console → **Authentication** → **Sign-in method**
2. Enable **Email/Password** authentication
3. Click **Save**

### 4. Create Demo Account

Since there's no pre-created demo account, you have two options:

**Option A: Via Firebase Console**
1. Go to **Authentication** → **Users**
2. Click **"Add user"**
3. Email: `demo@byki.com`
4. Password: `demo123456`

**Option B: Via Your Vercel App**
1. Visit your deployed app
2. Click **"Create Account"** on login page
3. Use any email and password (6+ characters)

### 5. Vercel Deployment Steps

```bash
# Install Vercel CLI (if not installed)
npm i -g vercel

# Login to Vercel
vercel login

# Deploy (first time)
vercel

# Follow prompts:
# - Link to existing project or create new
# - Framework: Create React App
# - Build command: npm run build
# - Output directory: build

# Deploy updates
vercel --prod
```

### 6. Post-Deployment Checklist

✅ **Environment variables set in Vercel dashboard**
✅ **Vercel domain added to Firebase authorized domains**
✅ **Firebase Authentication enabled (Email/Password)**
✅ **Firestore database created and enabled**
✅ **Demo account created**

### 7. Troubleshooting Common Vercel Issues

#### "auth/invalid-api-key" Error
- Check environment variables are correctly set in Vercel dashboard
- Redeploy after adding environment variables

#### "auth/unauthorized-domain" Error
- Add your Vercel domain to Firebase authorized domains
- Include both production and preview domain variants

#### "Firebase: No Firebase App '[DEFAULT]' has been created" Error
- Environment variables might not be loading
- Check vercel.json configuration

#### Build Errors on Vercel
```bash
# Check build locally first
npm run build

# If build fails, check console for errors
# Most common: missing environment variables
```

### 8. Testing Your Deployment

1. **Visit your deployed app**
2. **Check browser console** for Firebase config logs
3. **Try creating an account** (if no demo account exists)
4. **Test login/logout functionality**
5. **Test core features** (parts, customers, work orders)

### 9. Monitoring & Analytics

**Vercel Analytics:**
- Enable in Vercel dashboard → Analytics

**Firebase Analytics:**
- Can be added later via Firebase Console

### 10. Custom Domain (Optional)

1. **In Vercel dashboard** → Domains
2. **Add your custom domain**
3. **Update Firebase authorized domains** to include your custom domain
4. **Update any hardcoded URLs** in your code

## 🔧 Quick Fix Commands

```bash
# Redeploy with environment variables
vercel --prod

# Check deployment logs
vercel logs [deployment-url]

# Local development (to test before deploy)
npm start
```

## 📞 Support

If you're still having issues:
1. Check browser console for detailed error messages
2. Verify all environment variables are correctly set
3. Ensure Firebase Authentication is enabled
4. Check that your Vercel domain is in Firebase authorized domains

## 🎯 Expected Result

After following this guide:
- ✅ Your app should load on Vercel
- ✅ You should be able to create accounts
- ✅ Login/logout should work
- ✅ All Firebase features should function properly
- ✅ No CORS or authentication errors

---

**Deploy URL Pattern:** `https://your-project-name.vercel.app`
**Firebase Project:** `sparepart-management-system`
