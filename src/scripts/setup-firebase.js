// Firebase Setup Script
console.log('í´¥ Firebase Setup Guide for TrueViral');
console.log('=====================================\n');

console.log('1. Create a Firebase Project:');
console.log('   - Go to https://console.firebase.google.com/');
console.log('   - Click "Create a project"');
console.log('   - Name it "trueviral" or similar');
console.log('   - Enable Google Analytics (optional)');

console.log('\n2. Enable Authentication:');
console.log('   - Go to Authentication > Sign-in method');
console.log('   - Enable Email/Password');
console.log('   - Enable Google sign-in');
console.log('   - Add authorized domains: trueviral.ai, trueviral.io');

console.log('\n3. Setup Firestore Database:');
console.log('   - Go to Firestore Database');
console.log('   - Create database in production mode');
console.log('   - Choose a location (us-central1 recommended)');

console.log('\n4. Get Configuration:');
console.log('   - Go to Project Settings > General');
console.log('   - Scroll to "Your apps" section');
console.log('   - Click "Web app" icon');
console.log('   - Register app with name "TrueViral Web"');
console.log('   - Copy the config object');

console.log('\n5. Environment Variables:');
console.log('   Add these to your .env.local file:');
console.log('   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key');
console.log('   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com');
console.log('   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id');
console.log('   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com');
console.log('   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id');
console.log('   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id');

console.log('\n6. Service Account (for Admin SDK):');
console.log('   - Go to Project Settings > Service accounts');
console.log('   - Click "Generate new private key"');
console.log('   - Download the JSON file');
console.log('   - Add to .env.local:');
console.log('   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\\n...\\n-----END PRIVATE KEY-----\\n"');
console.log('   FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com');
console.log('   FIREBASE_PROJECT_ID=your_project_id');

console.log('\n7. Install Dependencies:');
console.log('   npm install firebase firebase-admin');

console.log('\n8. Security Rules (Firestore):');
console.log('   rules_version = \'2\';');
console.log('   service cloud.firestore {');
console.log('     match /databases/{database}/documents {');
console.log('       // Users can read/write their own data');
console.log('       match /users/{userId} {');
console.log('         allow read, write: if request.auth != null && request.auth.uid == userId;');
console.log('       }');
console.log('     }');
console.log('   }');

console.log('\n9. Test the setup:');
console.log('   node src/scripts/test-firebase.js');

console.log('\nâœ… Once setup is complete, your app will use Firebase instead of Supabase!');
