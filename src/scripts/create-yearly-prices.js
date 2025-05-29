require('dotenv').config({ path: '.env.local' });
const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function createYearlyPrices() {
  console.log('🚀 Creating yearly Stripe prices...\n');
  
  try {
    // Get existing monthly prices to find product IDs
    console.log('Fetching existing monthly prices...');
    const creatorSparkMonthly = await stripe.prices.retrieve('price_1RSjmYBrzE1Q5ZMiSsCe0Vpy');
    const viralProMonthly = await stripe.prices.retrieve('price_1RSjnLBrzE1Q5ZMiy4x0MSFo');
    
    console.log('✅ Found products:');
    console.log('  Creator Spark Product ID:', creatorSparkMonthly.product);
    console.log('  Viral Pro Product ID:', viralProMonthly.product);
    console.log('');
    
    // Create Creator Spark Yearly (€15 * 12 * 0.8 = €144 for 20% discount)
    console.log('Creating Creator Spark Yearly price...');
    const creatorSparkYearly = await stripe.prices.create({
      product: creatorSparkMonthly.product,
      unit_amount: 14400, // €144 in cents
      currency: 'eur',
      recurring: {
        interval: 'year',
      },
      nickname: 'Creator Spark Yearly',
    });
    
    console.log('✅ Created Creator Spark Yearly:', creatorSparkYearly.id);
    
    // Create Viral Pro Yearly (€40 * 12 * 0.8 = €384 for 20% discount)
    console.log('Creating Viral Pro Yearly price...');
    const viralProYearly = await stripe.prices.create({
      product: viralProMonthly.product,
      unit_amount: 38400, // €384 in cents
      currency: 'eur',
      recurring: {
        interval: 'year',
      },
      nickname: 'Viral Pro Yearly',
    });
    
    console.log('✅ Created Viral Pro Yearly:', viralProYearly.id);
    
    console.log('\n🎉 Success! Update your .env.local with these price IDs:');
    console.log('STRIPE_CREATOR_SPARK_YEARLY_PRICE_ID=' + creatorSparkYearly.id);
    console.log('STRIPE_VIRAL_PRO_YEARLY_PRICE_ID=' + viralProYearly.id);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.code) {
      console.error('Error code:', error.code);
    }
  }
}

createYearlyPrices();
