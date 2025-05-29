const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Deploying Stripe Environment Variables to Vercel...\n');

// Read the .env.local file
const envPath = path.join(process.cwd(), '.env.local');
if (!fs.existsSync(envPath)) {
  console.error('❌ .env.local file not found');
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf8');
const envLines = envContent.split('\n');

// Extract Stripe environment variables
const stripeEnvVars = {};
envLines.forEach(line => {
  if (line.includes('STRIPE') && line.includes('=')) {
    const [key, ...valueParts] = line.split('=');
    const value = valueParts.join('=').replace(/"/g, '');
    if (key.trim() && value.trim()) {
      stripeEnvVars[key.trim()] = value.trim();
    }
  }
});

console.log('Found Stripe environment variables:');
Object.keys(stripeEnvVars).forEach(key => {
  console.log(`  - ${key}`);
});
console.log('');

// Deploy each environment variable to Vercel
Object.entries(stripeEnvVars).forEach(([key, value]) => {
  try {
    console.log(`⏳ Setting ${key}...`);
    
    // Remove existing variable (ignore errors if it doesn't exist)
    try {
      execSync(`npx vercel env rm ${key} production --yes`, { stdio: 'pipe' });
    } catch (e) {
      // Variable doesn't exist, that's fine
    }
    
    // Add the new variable
    execSync(`echo "${value}" | npx vercel env add ${key} production`, { stdio: 'pipe' });
    console.log(`✅ ${key} set successfully`);
  } catch (error) {
    console.error(`❌ Failed to set ${key}:`, error.message);
  }
});

console.log('\n🎉 Stripe environment variables deployment complete!');
console.log('\n📝 Next steps:');
console.log('1. Run: npx vercel --prod');
console.log('2. Test the pricing page on production');
