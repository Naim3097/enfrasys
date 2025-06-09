// Firebase configuration
import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

// Firebase Configuration - with fallback for deployment
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyBloaW6TgHLVPO9HcCtlsQcLl9J32SY9UQ",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "sparepart-management-system.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "sparepart-management-system",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "sparepart-management-system.firebasestorage.app",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "673702003106",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:673702003106:web:4d379e315659d0bc6c72fb"
};

// Debug logging for deployment troubleshooting
console.log('🔧 Firebase Config Debug:', {
  apiKeyExists: !!firebaseConfig.apiKey,
  projectId: firebaseConfig.projectId,
  authDomain: firebaseConfig.authDomain,
  environment: process.env.NODE_ENV,
  isVercel: process.env.VERCEL === '1',
  hostname: typeof window !== 'undefined' ? window.location.hostname : 'server-side'
});

// Validate critical configuration
if (!firebaseConfig.projectId || !firebaseConfig.apiKey) {
  console.error('❌ Critical Firebase configuration missing');
  console.error('Config:', { 
    projectId: firebaseConfig.projectId,
    hasApiKey: !!firebaseConfig.apiKey 
  });
}

// Debug: Log the configuration being used
console.log('🔧 Firebase Config:', {
  projectId: firebaseConfig.projectId,
  authDomain: firebaseConfig.authDomain,
  apiKeyExists: !!firebaseConfig.apiKey,
  usingEmulator: process.env.REACT_APP_USE_EMULATOR === 'true',
  environment: process.env.NODE_ENV,
  isVercel: typeof window !== 'undefined' && window.location.hostname.includes('vercel')
});

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Connect to emulators only if explicitly enabled
if (process.env.NODE_ENV === 'development' && process.env.REACT_APP_USE_EMULATOR === 'true') {
  try {
    // Check if emulators are already connected
    if (!auth._delegate._config.emulator) {
      connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
      console.log('✅ Connected to Auth emulator');
    }
    if (!db._delegate._databaseId.projectId.includes('localhost')) {
      connectFirestoreEmulator(db, 'localhost', 8080);
      console.log('✅ Connected to Firestore emulator');
    }
  } catch (error) {
    console.log('⚠️ Firebase emulators not running or already connected:', error.message);
    console.log('💡 Make sure to run: firebase emulators:start --only auth,firestore');
  }
} else {
  console.log('🔥 Using live Firebase services');
}

export default app;
