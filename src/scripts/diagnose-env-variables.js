// Environment Variables Diagnostic Script
console.log('=== ENVIRONMENT VARIABLES DIAGNOSTIC ===');

// Firebase Environment Variables
console.log('\n🔥 FIREBASE CONFIGURATION:');
console.log('NEXT_PUBLIC_FIREBASE_API_KEY:', process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? '✅ SET' : '❌ MISSING');
console.log('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN:', process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? '✅ SET' : '❌ MISSING');
console.log('NEXT_PUBLIC_FIREBASE_PROJECT_ID:', process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? '✅ SET' : '❌ MISSING');
console.log('NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET:', process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ? '✅ SET' : '❌ MISSING');
console.log('NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID:', process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ? '✅ SET' : '❌ MISSING');
console.log('NEXT_PUBLIC_FIREBASE_APP_ID:', process.env.NEXT_PUBLIC_FIREBASE_APP_ID ? '✅ SET' : '❌ MISSING');

// Stripe Environment Variables
console.log('\n💳 STRIPE CONFIGURATION:');
console.log('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:', process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ? '✅ SET' : '❌ MISSING');
console.log('STRIPE_SECRET_KEY:', process.env.STRIPE_SECRET_KEY ? '✅ SET' : '❌ MISSING');

// Firebase Admin (Server-side)
console.log('\n🔐 FIREBASE ADMIN:');
console.log('FIREBASE_ADMIN_PROJECT_ID:', process.env.FIREBASE_ADMIN_PROJECT_ID ? '✅ SET' : '❌ MISSING');
console.log('FIREBASE_ADMIN_PRIVATE_KEY:', process.env.FIREBASE_ADMIN_PRIVATE_KEY ? '✅ SET (truncated)' : '❌ MISSING');
console.log('FIREBASE_ADMIN_CLIENT_EMAIL:', process.env.FIREBASE_ADMIN_CLIENT_EMAIL ? '✅ SET' : '❌ MISSING');

// Show actual values (truncated for security)
console.log('\n📊 ACTUAL VALUES (TRUNCATED):');
if (process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
  console.log('Stripe Publishable Key:', process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.substring(0, 20) + '...');
}
if (process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
  console.log('Firebase API Key:', process.env.NEXT_PUBLIC_FIREBASE_API_KEY.substring(0, 20) + '...');
}
if (process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
  console.log('Firebase Project ID:', process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);
}

console.log('\n=== END DIAGNOSTIC ===');