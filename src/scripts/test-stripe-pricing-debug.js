const { loadStripe } = require('@stripe/stripe-js');
require('dotenv').config({ path: '.env.local' });

// Test Stripe configuration
async function testStripeConfig() {
  console.log('🧪 Testing Stripe Configuration...\n');
  
  // Check environment variables
  console.log('📋 Environment Variables:');
  console.log('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:', process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ? '✅ Set' : '❌ Missing');
  console.log('STRIPE_SECRET_KEY:', process.env.STRIPE_SECRET_KEY ? '✅ Set' : '❌ Missing');
  console.log();
  
  // Check Price IDs
  console.log('💰 Price IDs:');
  const priceIds = {
    'Creator Spark Monthly': process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_CREATOR_SPARK_MONTHLY,
    'Creator Spark Yearly': process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_CREATOR_SPARK_YEARLY,
    'Viral Pro Monthly': process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_VIRAL_PRO_MONTHLY,
    'Viral Pro Yearly': process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_VIRAL_PRO_YEARLY,
  };
  
  Object.entries(priceIds).forEach(([name, priceId]) => {
    console.log(`${name}: ${priceId || '❌ Missing'}`);
  });
  console.log();
  
  // Test if price IDs are duplicated
  const uniquePriceIds = [...new Set(Object.values(priceIds).filter(Boolean))];
  if (uniquePriceIds.length !== Object.values(priceIds).filter(Boolean).length) {
    console.log('⚠️  WARNING: Duplicate price IDs detected!');
    const duplicates = Object.values(priceIds).filter((id, index, arr) => id && arr.indexOf(id) !== index);
    console.log('Duplicates:', duplicates);
    console.log();
  }
  
  // Test Stripe initialization
  try {
    if (process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
      console.log('🔧 Testing Stripe.js initialization...');
      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
      console.log('✅ Stripe.js loaded successfully');
      console.log();
    }
  } catch (error) {
    console.log('❌ Stripe.js initialization failed:', error.message);
    console.log();
  }
  
  // Test API endpoint
  console.log('🌐 Testing API endpoint...');
  try {
    const response = await fetch('http://localhost:3000/api/stripe/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        planName: 'Creator Spark',
        billingCycle: 'monthly',
      }),
    });
    
    const data = await response.json();
    console.log('Response status:', response.status);
    console.log('Response data:', data);
    
    if (response.ok) {
      console.log('✅ API endpoint working correctly');
    } else {
      console.log('❌ API endpoint error:', data.error || 'Unknown error');
      if (data.details) {
        console.log('Details:', data.details);
      }
    }
  } catch (error) {
    console.log('❌ Failed to test API endpoint:', error.message);
    console.log('Make sure your development server is running on localhost:3000');
  }
}

testStripeConfig().catch(console.error);
