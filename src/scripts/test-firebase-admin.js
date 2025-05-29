// Test Firebase Admin SDK Configuration
const { adminAuth, adminDb } = require('../lib/firebaseAdmin.ts');

async function testFirebaseAdmin() {
  try {
    console.log('🔥 Testing Firebase Admin SDK...');
    
    // Test Firebase Auth
    console.log('📝 Testing Firebase Admin Auth...');
    const usersList = await adminAuth.listUsers(1);
    console.log('✅ Firebase Admin Auth is working!');
    console.log(`📊 Users in database: ${usersList.users.length}`);
    
    // Test Firestore
    console.log('📝 Testing Firebase Admin Firestore...');
    const testDoc = await adminDb.collection('test').add({
      message: 'Firebase Admin test',
      timestamp: new Date(),
    });
    console.log('✅ Firebase Admin Firestore is working!');
    console.log(`📄 Test document created with ID: ${testDoc.id}`);
    
    // Clean up test document
    await adminDb.collection('test').doc(testDoc.id).delete();
    console.log('🧹 Test document cleaned up');
    
    console.log('🎉 Firebase Admin SDK is fully configured and working!');
    
  } catch (error) {
    console.error('❌ Firebase Admin SDK test failed:', error.message);
    console.error('📋 Full error:', error);
    process.exit(1);
  }
}

testFirebaseAdmin();