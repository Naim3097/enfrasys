#!/usr/bin/env node

/**
 * Vercel Environment Variables Setup Script
 * Automatically sets Firebase environment variables for Vercel deployment
 */

const { execSync } = require('child_process');

const envVars = {
  'REACT_APP_FIREBASE_API_KEY': 'AIzaSyBloaW6TgHLVPO9HcCtlsQcLl9J32SY9UQ',
  'REACT_APP_FIREBASE_AUTH_DOMAIN': 'sparepart-management-system.firebaseapp.com',
  'REACT_APP_FIREBASE_PROJECT_ID': 'sparepart-management-system',
  'REACT_APP_FIREBASE_STORAGE_BUCKET': 'sparepart-management-system.firebasestorage.app',
  'REACT_APP_FIREBASE_MESSAGING_SENDER_ID': '673702003106',
  'REACT_APP_FIREBASE_APP_ID': '1:673702003106:web:4d379e315659d0bc6c72fb'
};

console.log('🚀 Setting up Vercel environment variables...\n');

try {
  // Check if Vercel CLI is installed
  execSync('vercel --version', { stdio: 'pipe' });
  console.log('✅ Vercel CLI detected\n');
} catch (error) {
  console.log('❌ Vercel CLI not found. Installing...');
  console.log('Run: npm install -g vercel');
  console.log('Then run this script again.\n');
  process.exit(1);
}

// Set each environment variable
Object.entries(envVars).forEach(([key, value]) => {
  try {
    console.log(`Setting ${key}...`);
    
    // Set for production
    execSync(`echo "${value}" | vercel env add ${key} production`, { stdio: 'pipe' });
    
    // Set for preview
    execSync(`echo "${value}" | vercel env add ${key} preview`, { stdio: 'pipe' });
    
    console.log(`✅ ${key} set successfully`);
  } catch (error) {
    console.log(`⚠️  ${key} may already exist or failed to set`);
  }
});

console.log('\n🎉 Environment variables setup complete!');
console.log('\nNext steps:');
console.log('1. Push your code to GitHub');
console.log('2. Vercel will automatically deploy with new environment variables');
console.log('3. Add your Vercel domain to Firebase Console authorized domains');
console.log('\nYour Firebase project: https://console.firebase.google.com/project/sparepart-management-system');
