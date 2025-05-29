// Stripe Connection Debug Utility
// Run with: node debug-stripe-only.js

require('dotenv').config({ path: '.env.local' });
const Stripe = require('stripe');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

console.log(`${colors.bright}${colors.cyan}=====================================${colors.reset}`);
console.log(`${colors.bright}${colors.cyan}  STRIPE CONNECTION DEBUG UTILITY${colors.reset}`);
console.log(`${colors.bright}${colors.cyan}=====================================${colors.reset}\n`);

// Configuration
const MAX_RETRIES = 2;
const RETRY_DELAY_BASE = 2000; // 2 second base delay
const API_TIMEOUT = 25000; // 25 second timeout

async function retryOperation(operation, maxRetries = MAX_RETRIES) {
  let lastError = null;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      console.log(`${colors.yellow}Attempt ${attempt + 1}/${maxRetries + 1}...${colors.reset}`);
      
      // Set up timeout for the operation
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error(`Operation timed out after ${API_TIMEOUT}ms`)), API_TIMEOUT);
      });
      
      // Race between the operation and the timeout
      const startTime = Date.now();
      const result = await Promise.race([
        operation(),
        timeoutPromise
      ]);
      const endTime = Date.now();
      
      console.log(`${colors.green}✓ Success! (${endTime - startTime}ms)${colors.reset}`);
      return result;
    } catch (error) {
      lastError = error;
      console.log(`${colors.red}✗ Failed: ${error.message}${colors.reset}`);
      
      if (attempt === maxRetries) break;
      
      // Exponential backoff
      const delay = RETRY_DELAY_BASE * Math.pow(2, attempt);
      console.log(`${colors.yellow}Retrying in ${delay}ms...${colors.reset}`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
}

async function main() {
  try {
    // Check if Stripe key is configured
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey) {
      console.log(`${colors.red}✗ STRIPE_SECRET_KEY is not configured in .env.local${colors.reset}`);
      process.exit(1);
    }
    
    console.log(`${colors.bright}Stripe Configuration:${colors.reset}`);
    console.log(`- API Key: ${stripeKey.substring(0, 7)}...${stripeKey.substring(stripeKey.length - 4)}`);
    console.log(`- Max Retries: ${MAX_RETRIES}`);
    console.log(`- Retry Delay Base: ${RETRY_DELAY_BASE}ms`);
    console.log(`- API Timeout: ${API_TIMEOUT}ms`);
    
    console.log(`\n${colors.bright}${colors.yellow}Testing Stripe Connection...${colors.reset}\n`);
    
    // Initialize Stripe
    console.log(`${colors.cyan}> Initializing Stripe client...${colors.reset}`);
    const stripe = new Stripe(stripeKey, {
      apiVersion: '2023-10-16',
      timeout: API_TIMEOUT,
    });
    
    // Test 1: List customers
    console.log(`\n${colors.cyan}> Test 1: Listing customers (limit 1)...${colors.reset}`);
    const customers = await retryOperation(async () => {
      return await stripe.customers.list({ limit: 1 });
    });
    console.log(`  Found ${customers.data.length} customer(s)`);
    
    // Test 2: List products
    console.log(`\n${colors.cyan}> Test 2: Listing products (limit 3)...${colors.reset}`);
    const products = await retryOperation(async () => {
      return await stripe.products.list({ limit: 3, active: true });
    });
    console.log(`  Found ${products.data.length} product(s)`);
    if (products.data.length > 0) {
      console.log(`  First product: ${products.data[0].name} (${products.data[0].id})`);
    }
    
    // Test 3: List prices
    console.log(`\n${colors.cyan}> Test 3: Listing prices (limit 5)...${colors.reset}`);
    const prices = await retryOperation(async () => {
      return await stripe.prices.list({ limit: 5, active: true });
    });
    console.log(`  Found ${prices.data.length} price(s)`);
    if (prices.data.length > 0) {
      prices.data.forEach((price, index) => {
        const amount = price.unit_amount / 100;
        const currency = price.currency.toUpperCase();
        const interval = price.recurring ? price.recurring.interval : 'one-time';
        console.log(`  Price ${index + 1}: ${amount} ${currency} (${interval}) - ${price.id}`);
      });
    }
    
    console.log(`\n${colors.green}${colors.bright}✓ All Stripe connection tests passed!${colors.reset}`);
    
  } catch (error) {
    console.log(`\n${colors.red}${colors.bright}✗ ERROR: ${error.message}${colors.reset}`);
    if (error.type) {
      console.log(`  Stripe Error Type: ${error.type}`);
    }
    process.exit(1);
  }
  
  console.log(`\n${colors.bright}${colors.cyan}=====================================${colors.reset}`);
  console.log(`${colors.bright}${colors.cyan}  TEST COMPLETE${colors.reset}`);
  console.log(`${colors.bright}${colors.cyan}=====================================${colors.reset}`);
}

main();
