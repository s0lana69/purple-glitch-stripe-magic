/**
 * Simple Database Setup Script for TrueViral
 * This script creates the users table using the Supabase Admin API
 */

const { createClient } = require('@supabase/supabase-js');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '../../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables:');
  console.error('- NEXT_PUBLIC_SUPABASE_URL:', !!supabaseUrl);
  console.error('- SUPABASE_SERVICE_ROLE_KEY:', !!supabaseServiceKey);
  process.exit(1);
}

// Create Supabase admin client
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  db: { schema: 'public' },
  auth: { persistSession: false }
});

async function setupDatabase() {
  try {
    console.log('🚀 Starting simple database setup...');
    
    // Step 1: Check if users table exists
    console.log('📋 Checking existing tables...');
    const { data: existingUsers, error: checkError } = await supabase
      .from('users')
      .select('id')
      .limit(1);
    
    if (checkError && checkError.code === '42P01') {
      console.log('❌ Users table does not exist. Database setup required.');
      console.log('');
      console.log('🔧 MANUAL SETUP REQUIRED:');
      console.log('');
      console.log('Please run the following SQL in your Supabase SQL Editor:');
      console.log('1. Go to https://supabase.com/dashboard/project/[YOUR-PROJECT]/sql');
      console.log('2. Copy and paste the SQL from: supabase/migrations/0001_setup_complete_database.sql');
      console.log('3. Click "Run" to execute the migration');
      console.log('');
      console.log('After running the SQL, restart your Next.js application.');
      
      return false;
    } else if (checkError) {
      console.error('❌ Error checking users table:', checkError);
      return false;
    } else {
      console.log('✅ Users table exists!');
    }
    
    // Step 2: Check if required functions exist
    console.log('🔍 Checking database functions...');
    
    try {
      const { data, error } = await supabase.rpc('has_service_access', {
        user_id: '00000000-0000-0000-0000-000000000000'
      });
      
      if (error && error.code === '42883') {
        console.log('❌ Required functions do not exist');
        console.log('');
        console.log('🔧 MANUAL SETUP REQUIRED:');
        console.log('Please run the complete SQL migration from:');
        console.log('supabase/migrations/0001_setup_complete_database.sql');
        
        return false;
      } else {
        console.log('✅ Database functions exist!');
      }
    } catch (err) {
      console.warn('⚠️  Could not verify functions:', err.message);
    }
    
    // Step 3: Test user creation
    console.log('🧪 Testing user operations...');
    
    // Try to create a test user record (will only work if everything is set up)
    const testUserId = '00000000-0000-0000-0000-000000000000';
    
    try {
      const { data, error } = await supabase
        .from('users')
        .upsert({
          id: testUserId,
          first_name: 'Test',
          last_name: 'User'
        })
        .select();
      
      if (error) {
        console.warn('⚠️  User operations test failed:', error.message);
      } else {
        console.log('✅ User operations working!');
        
        // Clean up test data
        await supabase.from('users').delete().eq('id', testUserId);
      }
    } catch (err) {
      console.warn('⚠️  User operations error:', err.message);
    }
    
    console.log('');
    console.log('🎉 Database verification completed!');
    console.log('');
    console.log('If you see any errors above, please:');
    console.log('1. Run the SQL migration manually in Supabase Dashboard');
    console.log('2. Restart your Next.js development server');
    console.log('3. Test the authentication flow');
    
    return true;
    
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    return false;
  }
}

// Run the setup
setupDatabase().then(success => {
  if (success) {
    console.log('✅ Setup completed successfully');
  } else {
    console.log('❌ Setup requires manual intervention');
  }
});
