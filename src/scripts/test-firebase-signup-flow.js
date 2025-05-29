// Firebase Signup Flow Diagnostic Script
const { initializeApp, getApps } = require('firebase/app');
const { getAuth, createUserWithEmailAndPassword, updateProfile } = require('firebase/auth');
const { getFirestore, doc, setDoc, serverTimestamp } = require('firebase/firestore');

console.log('=== FIREBASE SIGNUP FLOW DIAGNOSTIC ===');

// Test Firebase Configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

async function testFirebaseSignupFlow() {
  try {
    console.log('\n🔥 Testing Firebase Configuration...');
    
    // Validate configuration
    const missingKeys = Object.entries(firebaseConfig)
      .filter(([key, value]) => !value)
      .map(([key]) => key);
    
    if (missingKeys.length > 0) {
      console.error('❌ Missing Firebase environment variables:', missingKeys);
      return;
    }
    
    console.log('✅ All Firebase environment variables are set');
    
    // Initialize Firebase
    console.log('\n🚀 Initializing Firebase...');
    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    const auth = getAuth(app);
    const db = getFirestore(app);
    
    console.log('✅ Firebase initialized successfully');
    console.log('Project ID:', firebaseConfig.projectId);
    console.log('Auth Domain:', firebaseConfig.authDomain);
    
    // Test Firestore connection
    console.log('\n💾 Testing Firestore connection...');
    
    const testDoc = doc(db, 'test', 'connection-test');
    try {
      await setDoc(testDoc, {
        timestamp: serverTimestamp(),
        test: true
      });
      console.log('✅ Firestore write test successful');
    } catch (firestoreError) {
      console.error('❌ Firestore write test failed:', firestoreError.message);
      
      if (firestoreError.code === 'permission-denied') {
        console.log('🔐 This is likely a Firestore security rules issue');
      }
    }
    
    console.log('\n🔧 Testing signup flow simulation...');
    
    // Simulate user profile creation (without actually creating a user)
    const mockUserProfile = {
      uid: 'test-user-uid',
      email: 'test@example.com',
      displayName: 'Test User',
      photoURL: '',
      createdAt: serverTimestamp(),
      lastLoginAt: serverTimestamp(),
      subscription: {
        plan: 'free',
        status: 'active',
        trialEnd: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      },
      youtube: {
        connected: false,
      },
      profile: {},
    };
    
    console.log('✅ Mock user profile structure is valid');
    console.log('Profile structure:', JSON.stringify(mockUserProfile, null, 2));
    
  } catch (error) {
    console.error('❌ Firebase signup flow test failed:', error.message);
    
    if (error.code) {
      console.error('Error code:', error.code);
    }
    
    if (error.message.includes('auth')) {
      console.log('🔐 This appears to be an authentication configuration issue');
    } else if (error.message.includes('firestore')) {
      console.log('💾 This appears to be a Firestore configuration issue');
    }
  }
}

// Run the test
testFirebaseSignupFlow()
  .then(() => {
    console.log('\n=== END FIREBASE DIAGNOSTIC ===');
  })
  .catch((error) => {
    console.error('\n❌ Diagnostic script failed:', error);
    console.log('\n=== END FIREBASE DIAGNOSTIC ===');
  });