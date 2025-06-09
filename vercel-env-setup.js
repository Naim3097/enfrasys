#!/usr/bin/env node

/**
 * Vercel Environment Variables Setup Script
 * 
 * This script helps you set up environment variables in Vercel using the Vercel CLI
 * Run this after installing Vercel CLI: npm i -g vercel
 * 
 * Usage: node vercel-env-setup.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Firebase configuration values
const FIREBASE_CONFIG = {
  REACT_APP_FIREBASE_API_KEY: 'AIzaSyBloaW6TgHLVPO9HcCtlsQcLl9J32SY9UQ',
  REACT_APP_FIREBASE_AUTH_DOMAIN: 'sparepart-management-system.firebaseapp.com',
  REACT_APP_FIREBASE_PROJECT_ID: 'sparepart-management-system',
  REACT_APP_FIREBASE_STORAGE_BUCKET: 'sparepart-management-system.firebasestorage.app',
  REACT_APP_FIREBASE_MESSAGING_SENDER_ID: '673702003106',
  REACT_APP_FIREBASE_APP_ID: '1:673702003106:web:4d379e315659d0bc6c72fb',
  REACT_APP_USE_EMULATOR: 'false'
};

console.log('🚀 BYKI LITE - Vercel Environment Setup');
console.log('=======================================');

function runCommand(command) {
  try {
    console.log(`Running: ${command}`);
    const output = execSync(command, { encoding: 'utf8', stdio: 'inherit' });
    return output;
  } catch (error) {
    console.error(`❌ Error running command: ${command}`);
    console.error(error.message);
    return null;
  }
}

function setVercelEnvVar(key, value) {
  console.log(`Setting ${key}...`);
  return runCommand(`vercel env add ${key} production`);
}

async function main() {
  console.log('\n📋 This script will set up environment variables in Vercel');
  console.log('Make sure you have:');
  console.log('1. Installed Vercel CLI: npm install -g vercel');
  console.log('2. Logged in to Vercel: vercel login');
  console.log('3. Linked your project: vercel link');
  console.log('\n⚠️  You will be prompted to enter each environment variable value');
  console.log('Copy the values shown below when prompted:\n');

  // Display the values to copy
  Object.entries(FIREBASE_CONFIG).forEach(([key, value]) => {
    console.log(`${key}=${value}`);
  });

  console.log('\n🔧 Setting up environment variables...\n');

  // Set each environment variable
  for (const [key, value] of Object.entries(FIREBASE_CONFIG)) {
    console.log(`\n📝 Setting ${key}`);
    console.log(`Value to enter: ${value}`);
    runCommand(`vercel env add ${key}`);
  }

  console.log('\n✅ Environment variables setup complete!');
  console.log('\n📋 Next steps:');
  console.log('1. Go to Firebase Console (https://console.firebase.google.com)');
  console.log('2. Select your project: sparepart-management-system');
  console.log('3. Go to Authentication > Settings > Authorized domains');
  console.log('4. Add your Vercel domain (e.g., bykilite.vercel.app)');
  console.log('5. Deploy your project: vercel --prod');
  console.log('\n🎉 Your BYKI LITE app should now work on Vercel!');
}

main().catch(console.error);
