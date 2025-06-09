// Safe Firebase wrapper that prevents app crashes
import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

let firebaseApp = null;
let auth = null;
let db = null;
let initializationError = null;

// Firebase Configuration - with fallback for deployment
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyBloaW6TgHLVPO9HcCtlsQcLl9J32SY9UQ",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "sparepart-management-system.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "sparepart-management-system",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "sparepart-management-system.firebasestorage.app",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "673702003106",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:673702003106:web:4d379e315659d0bc6c72fb"
};

// Safe Firebase initialization
function initializeFirebaseSafely() {
  try {
    console.log('🔧 Initializing Firebase...');
    console.log('Environment:', process.env.NODE_ENV);
    console.log('Is Vercel:', process.env.VERCEL === '1');
    console.log('Config check:', {
      projectId: firebaseConfig.projectId,
      authDomain: firebaseConfig.authDomain,
      hasApiKey: !!firebaseConfig.apiKey,
      hostname: typeof window !== 'undefined' ? window.location.hostname : 'server-side'
    });

    // Validate critical configuration
    if (!firebaseConfig.projectId || !firebaseConfig.apiKey) {
      throw new Error(`Missing critical Firebase config: projectId=${firebaseConfig.projectId}, hasApiKey=${!!firebaseConfig.apiKey}`);
    }

    // Initialize Firebase app
    firebaseApp = initializeApp(firebaseConfig);
    
    // Initialize Firebase services
    auth = getAuth(firebaseApp);
    db = getFirestore(firebaseApp);

    // Connect to emulators only if explicitly enabled
    if (process.env.NODE_ENV === 'development' && process.env.REACT_APP_USE_EMULATOR === 'true') {
      try {
        if (!auth._delegate._config.emulator) {
          connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
          console.log('✅ Connected to Auth emulator');
        }
        if (!db._delegate._databaseId.projectId.includes('localhost')) {
          connectFirestoreEmulator(db, 'localhost', 8080);
          console.log('✅ Connected to Firestore emulator');
        }
      } catch (error) {
        console.log('⚠️ Firebase emulators not running:', error.message);
      }
    }

    console.log('✅ Firebase initialized successfully');
    return true;
  } catch (error) {
    console.error('❌ Firebase initialization failed:', error);
    initializationError = error;
    return false;
  }
}

// Initialize Firebase
const isInitialized = initializeFirebaseSafely();

// Export safe Firebase instances
export { auth, db, initializationError, isInitialized };
export default firebaseApp;
