/**
 * Stripe Flow Test Script
 * Tests the complete Stripe integration flow to identify issues
 */

const { loadStripe } = require('@stripe/stripe-js');

// Environment variables check
console.log('🔍 [STRIPE TEST] Environment Variables Check:');
console.log('================================');

const requiredEnvVars = [
  'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
  'STRIPE_SECRET_KEY',
  'NEXT_PUBLIC_STRIPE_PRICE_ID_CREATOR_SPARK_MONTHLY',
  'NEXT_PUBLIC_STRIPE_PRICE_ID_CREATOR_SPARK_YEARLY',
  'NEXT_PUBLIC_STRIPE_PRICE_ID_VIRAL_PRO_MONTHLY',
  'NEXT_PUBLIC_STRIPE_PRICE_ID_VIRAL_PRO_YEARLY'
];

const missingVars = [];
const presentVars = [];

requiredEnvVars.forEach(varName => {
  const value = process.env[varName];
  if (!value || value === '' || value.includes('placeholder')) {
    missingVars.push(varName);
    console.log(`❌ ${varName}: MISSING or PLACEHOLDER`);
  } else {
    presentVars.push(varName);
    console.log(`✅ ${varName}: ${value.substring(0, 12)}... (${value.length} chars)`);
  }
});

console.log('\n📊 [STRIPE TEST] Summary:');
console.log(`Present vars: ${presentVars.length}/${requiredEnvVars.length}`);
console.log(`Missing vars: ${missingVars.length}`);

if (missingVars.length > 0) {
  console.log('\n⚠️ [STRIPE TEST] Missing Variables:');
  missingVars.forEach(varName => {
    console.log(`- ${varName}`);
  });
}

// Test Stripe initialization
console.log('\n🚀 [STRIPE TEST] Testing Stripe Initialization:');
console.log('================================');

try {
  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  
  if (!publishableKey) {
    console.log('❌ Cannot test Stripe - publishable key missing');
  } else {
    console.log('✅ Publishable key found');
    console.log(`Key type: ${publishableKey.startsWith('pk_live_') ? 'LIVE' : 'TEST'}`);
    console.log(`Key format: ${publishableKey.substring(0, 7)}...${publishableKey.substring(publishableKey.length - 4)}`);
  }
} catch (error) {
  console.log('❌ Stripe initialization error:', error.message);
}

// Test price ID mapping
console.log('\n🏷️ [STRIPE TEST] Testing Price ID Mapping:');
console.log('================================');

const testPlans = [
  { name: 'Creator Spark', cycle: 'monthly' },
  { name: 'Creator Spark', cycle: 'yearly' },
  { name: 'Viral Pro', cycle: 'monthly' },
  { name: 'Viral Pro', cycle: 'yearly' }
];

// Simulate the getStripePriceId function
function getStripePriceId(planName, billingCycle) {
  const PRICE_IDS = {
    CREATOR_SPARK_MONTHLY: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_CREATOR_SPARK_MONTHLY,
    CREATOR_SPARK_YEARLY: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_CREATOR_SPARK_YEARLY,
    VIRAL_PRO_MONTHLY: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_VIRAL_PRO_MONTHLY,
    VIRAL_PRO_YEARLY: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_VIRAL_PRO_YEARLY,
  };

  if (planName === 'Creator Spark') {
    return billingCycle === 'monthly' ? PRICE_IDS.CREATOR_SPARK_MONTHLY : PRICE_IDS.CREATOR_SPARK_YEARLY;
  }
  if (planName === 'Viral Pro') {
    return billingCycle === 'monthly' ? PRICE_IDS.VIRAL_PRO_MONTHLY : PRICE_IDS.VIRAL_PRO_YEARLY;
  }
  return null;
}

testPlans.forEach(plan => {
  const priceId = getStripePriceId(plan.name, plan.cycle);
  const status = priceId && !priceId.includes('placeholder') ? '✅' : '❌';
  console.log(`${status} ${plan.name} (${plan.cycle}): ${priceId || 'MISSING'}`);
});

// Test API endpoint simulation
console.log('\n🌐 [STRIPE TEST] API Endpoint Simulation:');
console.log('================================');

async function simulateCheckoutSession(planName, billingCycle) {
  console.log(`\nTesting checkout for: ${planName} (${billingCycle})`);
  
  const priceId = getStripePriceId(planName, billingCycle);
  
  if (!priceId) {
    console.log(`❌ No price ID found for plan: ${planName}, billing: ${billingCycle}`);
    return { error: 'Invalid plan or billing cycle' };
  }
  
  if (priceId.includes('placeholder')) {
    console.log(`❌ Placeholder price ID detected: ${priceId}`);
    return { error: 'Placeholder price ID' };
  }
  
  console.log(`✅ Price ID: ${priceId}`);
  console.log(`✅ Would create checkout session for price: ${priceId}`);
  
  return { success: true, priceId };
}

// Test each plan
testPlans.forEach(async plan => {
  await simulateCheckoutSession(plan.name, plan.cycle);
});

console.log('\n🔧 [STRIPE TEST] Recommendations:');
console.log('================================');

if (missingVars.length > 0) {
  console.log('1. Set up missing environment variables in .env.local');
  console.log('2. Create products and prices in your Stripe dashboard');
  console.log('3. Copy the actual price IDs from Stripe to your .env.local');
}

const hasPlaceholders = requiredEnvVars.some(varName => {
  const value = process.env[varName];
  return value && value.includes('placeholder');
});

if (hasPlaceholders) {
  console.log('4. Replace placeholder price IDs with real ones from Stripe');
}

console.log('\n📋 [STRIPE TEST] Next Steps:');
console.log('1. Go to https://dashboard.stripe.com/products');
console.log('2. Create products for "Creator Spark" and "Viral Pro"');
console.log('3. Add monthly and yearly prices for each product');
console.log('4. Copy the price IDs (starting with price_) to your .env.local');
console.log('5. Restart your development server');

console.log('\n✅ [STRIPE TEST] Test completed!');
