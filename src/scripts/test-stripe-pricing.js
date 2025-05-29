#!/usr/bin/env node

/**
 * Script to test Stripe pricing integration
 * This script helps identify issues with Stripe price ID mapping and checkout session creation
 */

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Test configuration
const testPlans = [
  { name: 'Creator Spark', cycle: 'monthly' },
  { name: 'Creator Spark', cycle: 'yearly' },
  { name: 'Viral Pro', cycle: 'monthly' },
  { name: 'Viral Pro', cycle: 'yearly' },
];

// Price ID mapping (should match the lib/stripe.ts file)
const PRICE_IDS = {
  CREATOR_SPARK_MONTHLY: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_CREATOR_SPARK_MONTHLY,
  CREATOR_SPARK_YEARLY: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_CREATOR_SPARK_YEARLY,
  VIRAL_PRO_MONTHLY: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_VIRAL_PRO_MONTHLY,
  VIRAL_PRO_YEARLY: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_VIRAL_PRO_YEARLY,
};

// Helper function to get Stripe Price ID (matching the one in lib/stripe.ts)
function getStripePriceId(planName, billingCycle) {
  if (planName === 'Creator Spark') {
    return billingCycle === 'monthly' ? PRICE_IDS.CREATOR_SPARK_MONTHLY : PRICE_IDS.CREATOR_SPARK_YEARLY;
  }
  if (planName === 'Viral Pro') {
    return billingCycle === 'monthly' ? PRICE_IDS.VIRAL_PRO_MONTHLY : PRICE_IDS.VIRAL_PRO_YEARLY;
  }
  return null;
}

async function testStripeConfiguration() {
  console.log('🔍 Testing Stripe Configuration...\n');

  // Check environment variables
  console.log('📋 Environment Variables:');
  console.log('STRIPE_SECRET_KEY exists:', !!process.env.STRIPE_SECRET_KEY);
  console.log('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY exists:', !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
  console.log('');

  // Check price IDs
  console.log('💰 Price IDs:');
  Object.entries(PRICE_IDS).forEach(([key, value]) => {
    console.log(`${key}: ${value || 'MISSING'}`);
  });
  console.log('');

  // Test price ID mapping
  console.log('🗺️ Price ID Mapping Test:');
  testPlans.forEach(({ name, cycle }) => {
    const priceId = getStripePriceId(name, cycle);
    console.log(`${name} (${cycle}): ${priceId || 'NULL'}`);
  });
  console.log('');

  // Test Stripe API connection
  try {
    console.log('🔗 Testing Stripe API Connection...');
    const account = await stripe.accounts.retrieve();
    console.log('✅ Stripe API connection successful');
    console.log(`Account ID: ${account.id}`);
    console.log(`Business type: ${account.business_type}`);
    console.log(`Country: ${account.country}`);
    console.log('');
  } catch (error) {
    console.error('❌ Stripe API connection failed:', error.message);
    return;
  }

  // Test price objects
  console.log('💳 Testing Price Objects...');
  for (const [key, priceId] of Object.entries(PRICE_IDS)) {
    if (priceId && priceId !== 'price_placeholder_creator_monthly' && priceId !== 'price_placeholder_creator_yearly' && priceId !== 'price_placeholder_pro_monthly' && priceId !== 'price_placeholder_pro_yearly') {
      try {
        const price = await stripe.prices.retrieve(priceId);
        console.log(`✅ ${key}: ${price.unit_amount / 100} ${price.currency.toUpperCase()} / ${price.recurring.interval}`);
      } catch (error) {
        console.error(`❌ ${key}: Price ID ${priceId} not found - ${error.message}`);
      }
    } else {
      console.log(`⚠️ ${key}: Missing or placeholder price ID`);
    }
  }
  console.log('');

  // Test checkout session creation
  console.log('🛒 Testing Checkout Session Creation...');
  for (const { name, cycle } of testPlans) {
    const priceId = getStripePriceId(name, cycle);
    if (priceId && !priceId.includes('placeholder')) {
      try {
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          line_items: [{
            price: priceId,
            quantity: 1,
          }],
          mode: 'subscription',
          success_url: 'https://trueviral.ai/dashboard?success=true&session_id={CHECKOUT_SESSION_ID}',
          cancel_url: 'https://trueviral.ai/prices?canceled=true',
          allow_promotion_codes: true,
          billing_address_collection: 'required',
          metadata: {
            planName: name,
            billingCycle: cycle,
          },
        });
        console.log(`✅ ${name} (${cycle}): Session created - ${session.id}`);
      } catch (error) {
        console.error(`❌ ${name} (${cycle}): Session creation failed - ${error.message}`);
      }
    } else {
      console.log(`⚠️ ${name} (${cycle}): Skipping - no valid price ID`);
    }
  }

  console.log('\n🎉 Stripe configuration test completed!');
}

// Run the test
testStripeConfiguration().catch(console.error);
