/**
 * Test Stripe Integration
 * Tests the Stripe configuration and API endpoints
 */

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const testStripeIntegration = async () => {
  console.log('🔍 Testing Stripe Integration...\n');

  // Test 1: Check environment variables
  console.log('1. Environment Variables Check:');
  const stripePublicKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  const priceIds = {
    creatorSparkMonthly: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_CREATOR_SPARK_MONTHLY,
    creatorSparkYearly: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_CREATOR_SPARK_YEARLY,
    viralProMonthly: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_VIRAL_PRO_MONTHLY,
    viralProYearly: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_VIRAL_PRO_YEARLY,
  };

  console.log('  ✅ Public Key:', stripePublicKey ? `${stripePublicKey.substring(0, 7)}...` : '❌ Missing');
  console.log('  ✅ Secret Key:', stripeSecretKey ? `${stripeSecretKey.substring(0, 7)}...` : '❌ Missing');
  console.log('  ✅ Price IDs:');
  Object.entries(priceIds).forEach(([key, value]) => {
    console.log(`    ${key}: ${value || '❌ Missing'}`);
  });

  // Test 2: Test Stripe library initialization
  console.log('\n2. Stripe Library Test:');
  try {
    const Stripe = require('stripe');
    const stripe = new Stripe(stripeSecretKey, {
      typescript: true,
    });
    console.log('  ✅ Stripe library initialized successfully');

    // Test 3: Test API connection
    console.log('\n3. Stripe API Connection Test:');
    const account = await stripe.accounts.retrieve();
    console.log('  ✅ Connected to Stripe account:', account.display_name || account.id);
    console.log('  ✅ Account type:', account.type);
    console.log('  ✅ Charges enabled:', account.charges_enabled);
    console.log('  ✅ Details submitted:', account.details_submitted);

    // Test 4: Test price retrieval
    console.log('\n4. Price Validation Test:');
    for (const [planName, priceId] of Object.entries(priceIds)) {
      if (priceId) {
        try {
          const price = await stripe.prices.retrieve(priceId);
          console.log(`  ✅ ${planName}: €${price.unit_amount / 100}/${price.recurring?.interval || 'one-time'} (${price.currency.toUpperCase()})`);
        } catch (error) {
          console.log(`  ❌ ${planName}: Error - ${error.message}`);
        }
      }
    }

    // Test 5: Test checkout session creation
    console.log('\n5. Checkout Session Creation Test:');
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price: priceIds.creatorSparkMonthly,
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: 'https://trueviral.ai/dashboard?success=true',
        cancel_url: 'https://trueviral.ai/prices?canceled=true',
        allow_promotion_codes: true,
        billing_address_collection: 'required',
        metadata: {
          planName: 'Creator Spark',
          billingCycle: 'monthly',
        },
      });
      console.log('  ✅ Test checkout session created:', session.id);
      console.log('  ✅ Session URL:', session.url);
    } catch (error) {
      console.log('  ❌ Checkout session creation failed:', error.message);
    }

  } catch (error) {
    console.log('  ❌ Stripe initialization failed:', error.message);
  }

  console.log('\n🎯 Stripe Integration Test Complete!');
};

// Run the test
testStripeIntegration().catch(console.error);
