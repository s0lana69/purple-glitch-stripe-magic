// Test Firebase Configuration
const { initializeApp, getApps } = require('firebase/app');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

console.log('🔥 Testing Firebase Configuration...\n');

// Check if all required environment variables are present
const requiredVars = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID'
];

console.log('📋 Environment Variables Check:');
requiredVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`✅ ${varName}: ${value.substring(0, 20)}...`);
  } else {
    console.log(`❌ ${varName}: Missing`);
  }
});

console.log('\n🚀 Firebase App Initialization:');
try {
  // Initialize Firebase
  const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  
  console.log('✅ Firebase app initialized successfully');
  console.log(`📱 App Name: ${app.name}`);
  console.log(`🏷️  Project ID: ${app.options.projectId}`);
  console.log(`🔗 Auth Domain: ${app.options.authDomain}`);
  
  // Test Firebase services availability
  console.log('\n🛠️  Firebase Services Test:');
  
  try {
    const { getAuth } = require('firebase/auth');
    const auth = getAuth(app);
    console.log('✅ Firebase Auth initialized');
  } catch (error) {
    console.log('❌ Firebase Auth failed:', error.message);
  }
  
  try {
    const { getFirestore } = require('firebase/firestore');
    const db = getFirestore(app);
    console.log('✅ Firebase Firestore initialized');
  } catch (error) {
    console.log('❌ Firebase Firestore failed:', error.message);
  }
  
  try {
    const { getStorage } = require('firebase/storage');
    const storage = getStorage(app);
    console.log('✅ Firebase Storage initialized');
  } catch (error) {
    console.log('❌ Firebase Storage failed:', error.message);
  }
  
  console.log('\n🎉 Firebase configuration test completed successfully!');
  
} catch (error) {
  console.log('❌ Firebase initialization failed:', error.message);
  console.log('\n🔍 Please check your Firebase configuration in .env.local');
}