// Firebase Admin Configuration (Server-side only)
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth, type Auth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import * as path from 'path';

// Try to use environment variables first, fallback to service account file
let firebaseAdminConfig;

if (process.env.FIREBASE_ADMIN_PRIVATE_KEY && process.env.FIREBASE_ADMIN_CLIENT_EMAIL) {
  try {
    // Use environment variables
    const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY;
    
    // Handle different private key formats
    const formattedPrivateKey = privateKey
      .replace(/\\n/g, '\n')  // Handle escaped newlines
      .replace(/\$\{n\}/g, '\n')  // Handle ${n} placeholder
      .replace(/\$\{newline\}/g, '\n')  // Handle ${newline} placeholder
      .trim();  // Remove any leading/trailing whitespace
    
    if (!formattedPrivateKey.startsWith('-----BEGIN PRIVATE KEY-----')) {
      throw new Error('Invalid private key format');
    }

    firebaseAdminConfig = {
      credential: cert({
        projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        privateKey: formattedPrivateKey,
      }),
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
    };

    console.log('✅ Firebase Admin initialized with environment variables');
  } catch (error) {
    console.error('Error formatting Firebase Admin private key:', error);
    throw new Error('Failed to initialize Firebase Admin with environment variables');
  }
} else {
  // Fallback to service account key file
  try {
    const serviceAccountPath = path.join(process.cwd(), 'serviceAccountKey.json');
    firebaseAdminConfig = {
      credential: cert(serviceAccountPath),
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID || 'trueviral',
    };
    console.log('✅ Firebase Admin initialized with service account file');
  } catch (error) {
    console.error('Firebase Admin initialization failed:', error);
    throw new Error('Firebase Admin configuration is missing. Please provide either environment variables or serviceAccountKey.json file.');
  }
}

// Initialize Firebase Admin
let app;
try {
  app = getApps().find(app => app.name === '[DEFAULT]') || initializeApp(firebaseAdminConfig);
  console.log('✅ Firebase Admin app initialized successfully');
} catch (error) {
  console.error('Failed to initialize Firebase Admin app:', error);
  throw error;
}

// Initialize Firebase Admin Auth
let adminAuth: Auth;
try {
  adminAuth = getAuth(app);
  console.log('✅ Firebase Admin Auth initialized successfully');
} catch (error) {
  console.error('Failed to initialize Firebase Admin Auth:', error);
  throw error;
}

// Initialize Firebase Admin Firestore
let adminDb;
try {
  adminDb = getFirestore(app);
  console.log('✅ Firebase Admin Firestore initialized successfully');
} catch (error) {
  console.error('Failed to initialize Firebase Admin Firestore:', error);
  throw error;
}

export { adminAuth, adminDb };
export default app;
