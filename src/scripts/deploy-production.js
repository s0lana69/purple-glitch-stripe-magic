#!/usr/bin/env node

/**
 * TrueViral Production Deployment Script
 * 
 * This script helps set up and validate all environment variables
 * required for production deployment on Vercel.
 * 
 * Run this script before deploying to ensure all configurations are correct.
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 TrueViral Production Deployment Setup');
console.log('==========================================\n');

// Required environment variables for production
const requiredEnvVars = {
  // Firebase Configuration
  'NEXT_PUBLIC_FIREBASE_API_KEY': 'Firebase API Key (public)',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN': 'Firebase Auth Domain (public)',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID': 'Firebase Project ID (public)',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET': 'Firebase Storage Bucket (public)',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID': 'Firebase Messaging Sender ID (public)',
  'NEXT_PUBLIC_FIREBASE_APP_ID': 'Firebase App ID (public)',
  'NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID': 'Firebase Measurement ID (public)',
  
  // Firebase Admin (Server-side)
  'FIREBASE_ADMIN_PRIVATE_KEY': 'Firebase Admin Private Key (secret)',
  'FIREBASE_ADMIN_CLIENT_EMAIL': 'Firebase Admin Client Email (secret)',
  'FIREBASE_ADMIN_PROJECT_ID': 'Firebase Admin Project ID (secret)',
  
  // Google OAuth & YouTube
  'NEXT_PUBLIC_GOOGLE_CLIENT_ID': 'Google OAuth Client ID (public)',
  'GOOGLE_CLIENT_SECRET': 'Google OAuth Client Secret (secret)',
  'NEXT_PUBLIC_YOUTUBE_API_KEY': 'YouTube Data API Key (public)',
  
  // Stripe Configuration
  'STRIPE_SECRET_KEY': 'Stripe Secret Key (secret)',
  'STRIPE_WEBHOOK_SECRET': 'Stripe Webhook Secret (secret)',
  'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY': 'Stripe Publishable Key (public)',
  
  // AI Services
  'ANTHROPIC_API_KEY': 'Anthropic Claude API Key (secret)',
  'GOOGLE_AI_API_KEY': 'Google Gemini API Key (secret)',
  
  // App Configuration
  'NEXTAUTH_SECRET': 'NextAuth Secret Key (secret)',
  'NEXTAUTH_URL': 'NextAuth URL (https://trueviral.ai)',
};

// Current Stripe Price IDs (updated 2025-01-29)
const stripePriceIds = {
  // Monthly Plans
  'STRIPE_PRO_MONTHLY': 'price_1QYs9LEIgO37iy5xqLwpV1rk',      // €19.99/month
  'STRIPE_PREMIUM_MONTHLY': 'price_1QYsAWEIgO37iy5xrLF8WCpO',  // €39.99/month
  'STRIPE_BUSINESS_MONTHLY': 'price_1QYsBOEIgO37iy5xNWh4aTgV', // €79.99/month
  
  // Yearly Plans (20% discount)
  'STRIPE_PRO_YEARLY': 'price_1QYtJqEIgO37iy5xdPeNcOUZ',       // €239.88/year
  'STRIPE_PREMIUM_YEARLY': 'price_1QYtKJEIgO37iy5x8QJvKr1X',   // €479.88/year
  'STRIPE_BUSINESS_YEARLY': 'price_1QYtKcEIgO37iy5x5KbJ8rNu',  // €959.88/year
};

function checkEnvironmentVariables() {
  console.log('📋 Checking Environment Variables...\n');
  
  const missingVars = [];
  const presentVars = [];
  
  // Check required variables
  Object.entries(requiredEnvVars).forEach(([varName, description]) => {
    const value = process.env[varName];
    if (!value || value.trim() === '') {
      missingVars.push({ name: varName, description });
    } else {
      presentVars.push({ name: varName, description, masked: maskSensitiveValue(varName, value) });
    }
  });
  
  // Check Stripe price IDs
  Object.entries(stripePriceIds).forEach(([varName, expectedValue]) => {
    const value = process.env[varName];
    if (!value || value !== expectedValue) {
      missingVars.push({ 
        name: varName, 
        description: `Stripe Price ID (should be: ${expectedValue})`
      });
    } else {
      presentVars.push({ 
        name: varName, 
        description: `Stripe Price ID`, 
        masked: value 
      });
    }
  });
  
  // Display results
  if (presentVars.length > 0) {
    console.log('✅ Present Environment Variables:');
    presentVars.forEach(({ name, description, masked }) => {
      console.log(`   ${name}: ${masked} (${description})`);
    });
    console.log('');
  }
  
  if (missingVars.length > 0) {
    console.log('❌ Missing Environment Variables:');
    missingVars.forEach(({ name, description }) => {
      console.log(`   ${name}: ${description}`);
    });
    console.log('');
    return false;
  }
  
  console.log('✅ All environment variables are present!\n');
  return true;
}

function maskSensitiveValue(varName, value) {
  if (varName.includes('SECRET') || varName.includes('PRIVATE_KEY') || varName.includes('CLIENT_SECRET')) {
    if (value.length <= 8) {
      return '*'.repeat(value.length);
    }
    return value.substring(0, 4) + '*'.repeat(value.length - 8) + value.substring(value.length - 4);
  }
  
  if (varName.includes('API_KEY')) {
    if (value.length <= 8) {
      return '*'.repeat(value.length);
    }
    return value.substring(0, 6) + '*'.repeat(value.length - 12) + value.substring(value.length - 6);
  }
  
  return value;
}

function generateEnvTemplate() {
  console.log('📝 Generating Environment Template...\n');
  
  let template = `# TrueViral Production Environment Variables
# Generated on ${new Date().toISOString()}
# 
# IMPORTANT: Never commit actual secrets to version control!
# This template should be used to set up environment variables in:
# - Vercel Dashboard (for production)
# - Local .env.local file (for development)

# ==========================================
# FIREBASE CONFIGURATION (Public)
# ==========================================
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef123456
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX

# ==========================================
# FIREBASE ADMIN (Server-side, Secret)
# ==========================================
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\\n...\\n-----END PRIVATE KEY-----\\n"
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your_project.iam.gserviceaccount.com
FIREBASE_ADMIN_PROJECT_ID=your_project_id

# ==========================================
# GOOGLE OAUTH & YOUTUBE API
# ==========================================
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXT_PUBLIC_YOUTUBE_API_KEY=your_youtube_api_key

# ==========================================
# STRIPE CONFIGURATION
# ==========================================
STRIPE_SECRET_KEY=sk_live_... # Use sk_test_... for testing
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_... # Use pk_test_... for testing

# Current Stripe Price IDs (Updated 2025-01-29)
# Monthly Plans
STRIPE_PRO_MONTHLY=${stripePriceIds.STRIPE_PRO_MONTHLY}
STRIPE_PREMIUM_MONTHLY=${stripePriceIds.STRIPE_PREMIUM_MONTHLY}
STRIPE_BUSINESS_MONTHLY=${stripePriceIds.STRIPE_BUSINESS_MONTHLY}

# Yearly Plans (20% discount)
STRIPE_PRO_YEARLY=${stripePriceIds.STRIPE_PRO_YEARLY}
STRIPE_PREMIUM_YEARLY=${stripePriceIds.STRIPE_PREMIUM_YEARLY}
STRIPE_BUSINESS_YEARLY=${stripePriceIds.STRIPE_BUSINESS_YEARLY}

# ==========================================
# AI SERVICES
# ==========================================
ANTHROPIC_API_KEY=sk-ant-api03-...
GOOGLE_AI_API_KEY=your_gemini_api_key

# ==========================================
# APP CONFIGURATION
# ==========================================
NEXTAUTH_SECRET=your_nextauth_secret_32_chars_min
NEXTAUTH_URL=https://trueviral.ai

# ==========================================
# DEPLOYMENT NOTES
# ==========================================
# 1. Set these variables in Vercel Dashboard:
#    - Go to Project Settings > Environment Variables
#    - Add each variable with appropriate environment (Production/Preview/Development)
#
# 2. For local development:
#    - Copy this template to .env.local
#    - Replace placeholder values with actual keys
#    - Never commit .env.local to git
#
# 3. Stripe webhook endpoint should be set to:
#    https://trueviral.ai/api/stripe/webhook
#
# 4. Google OAuth authorized redirect URIs should include:
#    - https://trueviral.ai/api/auth/callback
#    - https://trueviral.io/api/auth/callback (if using secondary domain)
#
# 5. Firebase authorized domains should include:
#    - trueviral.ai
#    - trueviral.io (if using secondary domain)
`;

  const templatePath = path.join(process.cwd(), '.env.production.template');
  fs.writeFileSync(templatePath, template);
  
  console.log(`✅ Environment template generated: ${templatePath}`);
  console.log('   Use this template to set up your production environment variables.\n');
}

function generateVercelDeployCommand() {
  console.log('🚀 Vercel Deployment Commands...\n');
  
  console.log('To deploy to production with environment variables:');
  console.log('');
  console.log('1. Install Vercel CLI:');
  console.log('   npm i -g vercel');
  console.log('');
  console.log('2. Login to Vercel:');
  console.log('   vercel login');
  console.log('');
  console.log('3. Set environment variables (run these commands):');
  
  Object.entries(requiredEnvVars).forEach(([varName, description]) => {
    const isSecret = varName.includes('SECRET') || varName.includes('PRIVATE_KEY') || varName.includes('CLIENT_SECRET') || varName.includes('API_KEY');
    console.log(`   vercel env add ${varName} production${isSecret ? ' # Secret value' : ''}`);
  });
  
  Object.keys(stripePriceIds).forEach((varName) => {
    console.log(`   vercel env add ${varName} production`);
  });
  
  console.log('');
  console.log('4. Deploy to production:');
  console.log('   vercel --prod');
  console.log('');
}

function validateStripePrices() {
  console.log('💳 Validating Stripe Price Configuration...\n');
  
  const stripeConfig = {
    monthly: {
      pro: process.env.STRIPE_PRO_MONTHLY,
      premium: process.env.STRIPE_PREMIUM_MONTHLY,
      business: process.env.STRIPE_BUSINESS_MONTHLY,
    },
    yearly: {
      pro: process.env.STRIPE_PRO_YEARLY,
      premium: process.env.STRIPE_PREMIUM_YEARLY,
      business: process.env.STRIPE_BUSINESS_YEARLY,
    }
  };
  
  let allValid = true;
  
  Object.entries(stripeConfig).forEach(([period, plans]) => {
    console.log(`${period.toUpperCase()} Plans:`);
    Object.entries(plans).forEach(([plan, priceId]) => {
      const expectedId = stripePriceIds[`STRIPE_${plan.toUpperCase()}_${period.toUpperCase()}`];
      if (priceId === expectedId) {
        console.log(`   ✅ ${plan}: ${priceId}`);
      } else {
        console.log(`   ❌ ${plan}: ${priceId || 'MISSING'} (expected: ${expectedId})`);
        allValid = false;
      }
    });
    console.log('');
  });
  
  if (allValid) {
    console.log('✅ All Stripe price IDs are correctly configured!\n');
  } else {
    console.log('❌ Some Stripe price IDs need to be updated.\n');
    console.log('💡 Use the latest price IDs from Stripe Dashboard or run:');
    console.log('   node src/scripts/create-yearly-prices.js\n');
  }
  
  return allValid;
}

function displayDeploymentSummary() {
  console.log('📊 DEPLOYMENT SUMMARY');
  console.log('=====================\n');
  
  const envValid = checkEnvironmentVariables();
  const stripeValid = validateStripePrices();
  
  console.log('Current Status:');
  console.log(`   Environment Variables: ${envValid ? '✅ Ready' : '❌ Missing variables'}`);
  console.log(`   Stripe Configuration: ${stripeValid ? '✅ Ready' : '❌ Needs update'}`);
  console.log('');
  
  if (envValid && stripeValid) {
    console.log('🎉 READY FOR PRODUCTION DEPLOYMENT!');
    console.log('');
    console.log('Next steps:');
    console.log('1. Ensure all environment variables are set in Vercel Dashboard');
    console.log('2. Run: vercel --prod');
    console.log('3. Test the deployment at https://trueviral.ai');
    console.log('4. Verify Stripe webhooks are working');
    console.log('5. Test complete user flow (signup → subscription → dashboard)');
  } else {
    console.log('⚠️  NOT READY FOR DEPLOYMENT');
    console.log('');
    console.log('Please fix the issues above before deploying to production.');
  }
  console.log('');
}

// Main execution
function main() {
  try {
    // Load environment variables from .env.local if it exists
    const envPath = path.join(process.cwd(), '.env.local');
    if (fs.existsSync(envPath)) {
      require('dotenv').config({ path: envPath });
      console.log('📁 Loaded environment variables from .env.local\n');
    } else {
      console.log('⚠️  No .env.local file found. Checking system environment variables only.\n');
    }
    
    displayDeploymentSummary();
    generateEnvTemplate();
    generateVercelDeployCommand();
    
  } catch (error) {
    console.error('❌ Error during deployment check:', error.message);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = {
  checkEnvironmentVariables,
  validateStripePrices,
  generateEnvTemplate,
  requiredEnvVars,
  stripePriceIds
};
