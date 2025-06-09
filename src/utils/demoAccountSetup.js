// Demo Account Setup Utility for BYKI LITE
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebaseConfig';

export const setupDemoAccount = async () => {
  const demoEmail = 'demo@byki.com';
  const demoPassword = 'demo123456';
  
  try {
    // Try to create the demo account
    console.log('🔧 Creating demo account...');
    const userCredential = await createUserWithEmailAndPassword(auth, demoEmail, demoPassword);
    console.log('✅ Demo account created successfully!');
    console.log('📧 Email:', demoEmail);
    console.log('🔑 Password:', demoPassword);
    return userCredential.user;
  } catch (error) {
    if (error.code === 'auth/email-already-in-use') {
      console.log('✅ Demo account already exists!');
      console.log('📧 Email:', demoEmail);
      console.log('🔑 Password:', demoPassword);
      return { email: demoEmail };
    } else {
      console.error('❌ Error with demo account:', error);
      throw error;
    }
  }
};

export const testDemoLogin = async () => {
  const demoEmail = 'demo@byki.com';
  const demoPassword = 'demo123456';
  
  try {
    console.log('🧪 Testing demo login...');
    const userCredential = await signInWithEmailAndPassword(auth, demoEmail, demoPassword);
    console.log('✅ Demo login successful!');
    return userCredential.user;
  } catch (error) {
    console.error('❌ Demo login failed:', error);
    if (error.code === 'auth/user-not-found') {
      console.log('📝 Demo account needs to be created first');
      return await setupDemoAccount();
    }
    throw error;
  }
};

// Make functions available globally for console use
if (typeof window !== 'undefined') {
  window.setupDemoAccount = setupDemoAccount;
  window.testDemoLogin = testDemoLogin;
}
