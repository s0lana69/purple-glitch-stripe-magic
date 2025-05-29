// Stripe Checkout Debug Utility
// Run with: node debug-stripe-checkout.js

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

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

console.log(`${colors.bright}${colors.cyan}=====================================${colors.reset}`);
console.log(`${colors.bright}${colors.cyan}  STRIPE CHECKOUT DEBUG UTILITY${colors.reset}`);
console.log(`${colors.bright}${colors.cyan}=====================================${colors.reset}\n`);

if (!TEST_USER_UID) {
  console.error(`${colors.bright}${colors.red}ERROR: User UID is required${colors.reset}`);
  console.log(`Usage: node debug-stripe-checkout.js <user_uid> [plan_name] [billing_cycle]`);
  process.exit(1);
}

async function main() {
  try {
    console.log(`${colors.bright}Test Configuration:${colors.reset}`);
    console.log(`- User UID: ${TEST_USER_UID}`);
    console.log(`- Plan: ${PLAN_NAME}`);
    console.log(`- Billing Cycle: ${BILLING_CYCLE}`);
    console.log(`- API URL: ${API_URL}`);
    console.log(`\n${colors.bright}${colors.yellow}Starting test...${colors.reset}\n`);

    // Generate a token for the test user
    console.log(`${colors.cyan}> Generating Firebase custom token...${colors.reset}`);
    const auth = getAuth();
    const customToken = await auth.createCustomToken(TEST_USER_UID);
    console.log(`${colors.green}✓ Custom token generated${colors.reset}\n`);

    // Create checkout session
    console.log(`${colors.cyan}> Creating Stripe checkout session...${colors.reset}`);
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
    
    console.log(`\n${colors.bright}Response Details:${colors.reset}`);
    console.log(`- Status: ${response.status} ${response.statusText}`);
    console.log(`- Time: ${responseTime}ms`);
    
    if (response.ok) {
      console.log(`${colors.green}✓ Success! Session ID: ${responseData.sessionId}${colors.reset}`);
    } else {
      console.log(`${colors.red}✗ Error: ${responseData.error}${colors.reset}`);
      console.log(`  Details: ${responseData.details || 'No details provided'}`);
    }

  } catch (error) {
    console.log(`\n${colors.bright}${colors.red}ERROR: ${error.message}${colors.reset}`);
    if (error.name === 'AbortError') {
      console.log(`The request was aborted due to timeout (30s)`);
    }
  }
  
  console.log(`\n${colors.bright}${colors.cyan}=====================================${colors.reset}`);
  console.log(`${colors.bright}${colors.cyan}  TEST COMPLETE${colors.reset}`);
  console.log(`${colors.bright}${colors.cyan}=====================================${colors.reset}`);
}

main();
