// Test OAuth Setup
const admin = require('firebase-admin');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

console.log('🔐 Testing OAuth Setup...\n');

// Check Firebase configuration
console.log('📋 Firebase Configuration Check:');
const firebaseVars = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID'
];

firebaseVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`✅ ${varName}: ${value.substring(0, 20)}...`);
  } else {
    console.log(`❌ ${varName}: Missing`);
  }
});

// Check Stripe configuration
console.log('\n💳 Stripe Configuration Check:');
const stripeVars = [
  'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
  'STRIPE_SECRET_KEY'
];

stripeVars.forEach(varName => {
  const value = process.env[varName];
  if (value && value !== `${varName.toLowerCase().replace(/_/g, '_')}_here`) {
    console.log(`✅ ${varName}: ${value.substring(0, 10)}...`);
  } else {
    console.log(`❌ ${varName}: Missing or placeholder`);
  }
});

// OAuth Setup Checklist
console.log('\n🔍 OAuth Setup Checklist:');
console.log('□ Firebase Console → Authentication → Sign-in method → Google (Enable)');
console.log('□ Firebase Console → Authentication → Settings → Authorized domains');
console.log('□ Google Cloud Console → OAuth consent screen configured');
console.log('□ Firestore security rules updated for user profiles');

// Test Firebase Admin connection (if configured)
console.log('\n🔥 Firebase Admin Test:');
try {
  if (process.env.FIREBASE_ADMIN_PROJECT_ID) {
    console.log('ℹ️  Firebase Admin project ID found, but full setup requires service account');
    console.log('   Add your service account credentials to complete admin setup');
  } else {
    console.log('ℹ️  Firebase Admin not configured (optional for OAuth)');
  }
} catch (error) {
  console.log('⚠️  Firebase Admin setup incomplete:', error.message);
}

console.log('\n📋 Next Steps:');
console.log('1. Replace placeholder values in .env.local with actual API keys');
console.log('2. Configure Firebase Console settings (see SETUP_ISSUES_FIXED.md)');
console.log('3. Test OAuth flow in browser: npm run dev → /auth');
console.log('4. Check browser console for detailed debug logs');

console.log('\n✅ Configuration test completed!');