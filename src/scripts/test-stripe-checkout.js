// Stripe Checkout Flow Test Utility
// Run with: node test-stripe-checkout.js

require('dotenv').config({ path: '.env.local' });
const fetch = require('node-fetch');
const { getAuth } = require('firebase-admin/auth');
const { initializeApp, cert } = require('firebase-admin/app');

// Initialize Firebase Admin
try {
  const serviceAccount = require('../../serviceAccountKey.json');
  initializeApp({
    credential: cert(serviceAccount)
  });
} catch (error) {
  console.error('⚠️ Failed to initialize Firebase Admin:', error.message);
  console.log('Make sure serviceAccountKey.json exists in the root directory');
  process.exit(1);
}

// Test configuration
const TEST_USER_UID = process.argv[2]; // Pass UID as argument
const PLAN_NAME = process.argv[3] || 'Creator Spark';
const BILLING_CYCLE = process.argv[4] || 'monthly';
const API_URL = 'http://localhost:3000/api/stripe/create-checkout-session';

if (!TEST_USER_UID) {
  console.error('ERROR: User UID is required');
  console.log('Usage: node test-stripe-checkout.js <user_uid> [plan_name] [billing_cycle]');
  process.exit(1);
}

async function main() {
  try {
    console.log('Test Configuration:');
    console.log(`- User UID: ${TEST_USER_UID}`);
    console.log(`- Plan: ${PLAN_NAME}`);
    console.log(`- Billing Cycle: ${BILLING_CYCLE}`);
    console.log(`- API URL: ${API_URL}`);
    console.log('\nStarting test...\n');

    // Generate a token for the test user
    console.log('> Generating Firebase custom token...');
    const auth = getAuth();
    const customToken = await auth.createCustomToken(TEST_USER_UID);
    console.log('✓ Custom token generated\n');

    // Create checkout session
    console.log('> Creating Stripe checkout session...');
    console.log(`  POST ${API_URL}`);
    console.log(`  Payload: { planName: "${PLAN_NAME}", billingCycle: "${BILLING_CYCLE}" }`);

    // Create an AbortController with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    const startTime = Date.now();
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${customToken}`
      },
      body: JSON.stringify({
        planName: PLAN_NAME,
        billingCycle: BILLING_CYCLE
      }),
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    
    const endTime = Date.now();
    const responseTime = endTime - startTime;

    const responseData = await response.json();
    
    console.log('\nResponse Details:');
    console.log(`- Status: ${response.status} ${response.statusText}`);
    console.log(`- Time: ${responseTime}ms`);
    
    if (response.ok) {
      console.log(`✓ Success! Session ID: ${responseData.sessionId}`);
      console.log('  You can now redirect to Stripe checkout with this session ID');
    } else {
      console.log(`✗ Error: ${responseData.error}`);
      console.log(`  Details: ${responseData.details || 'No details provided'}`);
    }

  } catch (error) {
    console.log(`\nERROR: ${error.message}`);
    if (error.name === 'AbortError') {
      console.log('The request was aborted due to timeout (30s)');
    }
  }
  
  console.log('\nTEST COMPLETE');
}

main();
