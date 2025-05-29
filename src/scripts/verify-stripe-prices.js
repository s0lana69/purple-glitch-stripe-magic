require('dotenv').config({ path: '.env.local' });
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

async function verifyStripePrices() {
  console.log('🔍 Verifying Stripe prices in live mode...');
  console.log('🔑 Using key:', process.env.STRIPE_SECRET_KEY?.substring(0, 20) + '...');
  
  try {
    // List all products
    console.log('\n📦 Fetching all products...');
    const products = await stripe.products.list({ limit: 10 });
    
    if (products.data.length === 0) {
      console.log('❌ No products found in your Stripe account');
      return;
    }
    
    console.log(`✅ Found ${products.data.length} product(s):`);
    products.data.forEach(product => {
      console.log(`  - ${product.name} (${product.id})`);
    });
    
    // List all prices
    console.log('\n💰 Fetching all prices...');
    const prices = await stripe.prices.list({ limit: 20 });
    
    if (prices.data.length === 0) {
      console.log('❌ No prices found in your Stripe account');
      return;
    }
    
    console.log(`✅ Found ${prices.data.length} price(s):`);
    prices.data.forEach(price => {
      const amount = price.unit_amount / 100;
      const currency = price.currency.toUpperCase();
      const interval = price.recurring?.interval || 'one-time';
      const productName = products.data.find(p => p.id === price.product)?.name || 'Unknown Product';
      
      console.log(`  - ${price.id}: ${amount} ${currency}/${interval} (${productName})`);
    });
    
    // Check our current environment variables
    console.log('\n🔍 Checking current price IDs in .env.local:');
    const envPrices = {
      'Creator Spark Monthly': process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_CREATOR_SPARK_MONTHLY,
      'Creator Spark Yearly': process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_CREATOR_SPARK_YEARLY,
      'Viral Pro Monthly': process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_VIRAL_PRO_MONTHLY,
      'Viral Pro Yearly': process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_VIRAL_PRO_YEARLY,
    };
    
    for (const [name, priceId] of Object.entries(envPrices)) {
      if (priceId) {
        const priceExists = prices.data.some(p => p.id === priceId);
        console.log(`  ${priceExists ? '✅' : '❌'} ${name}: ${priceId}`);
        
        if (!priceExists) {
          console.log(`    ⚠️  Price ID ${priceId} not found in your Stripe account`);
        }
      } else {
        console.log(`  ❌ ${name}: Not set`);
      }
    }
    
    // Suggest corrections
    console.log('\n💡 Suggested price mappings based on amounts:');
    const suggestions = [
      { name: 'Creator Spark Monthly', amount: 15, interval: 'month' },
      { name: 'Creator Spark Yearly', amount: 144, interval: 'year' },
      { name: 'Viral Pro Monthly', amount: 40, interval: 'month' },
      { name: 'Viral Pro Yearly', amount: 384, interval: 'year' },
    ];
    
    suggestions.forEach(suggestion => {
      const matchingPrice = prices.data.find(p => 
        p.unit_amount === suggestion.amount * 100 && 
        p.recurring?.interval === suggestion.interval
      );
      
      if (matchingPrice) {
        console.log(`  ✅ ${suggestion.name}: ${matchingPrice.id}`);
      } else {
        console.log(`  ❌ ${suggestion.name}: No matching price found (looking for ${suggestion.amount} EUR/${suggestion.interval})`);
      }
    });
    
  } catch (error) {
    console.error('❌ Error verifying Stripe prices:', error.message);
    
    if (error.type === 'StripeAuthenticationError') {
      console.log('🔑 Check your STRIPE_SECRET_KEY in .env.local');
    }
  }
}

verifyStripePrices();
