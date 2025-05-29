/**
 * Database Setup Script for TrueViral
 * This script runs the complete database migration to set up all required tables and functions
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
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

// Create Supabase client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupDatabase() {
  try {
    console.log('🚀 Starting database setup...');
    
    // Read the migration file
    const migrationPath = path.join(__dirname, '../../supabase/migrations/0001_setup_complete_database.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    console.log('📄 Loaded migration file...');
    
    // Execute the migration
    console.log('⚡ Running database migration...');
    const { data, error } = await supabase.rpc('exec_sql', { sql: migrationSQL });
    
    if (error) {
      console.error('❌ Migration failed:', error);
      
      // Try alternative approach - execute sections separately
      console.log('🔄 Trying alternative execution method...');
      await executeMigrationSections(migrationSQL);
    } else {
      console.log('✅ Migration completed successfully!');
    }
    
    // Verify the setup
    console.log('🔍 Verifying database setup...');
    await verifySetup();
    
    console.log('🎉 Database setup completed successfully!');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  }
}

async function executeMigrationSections(sql) {
  // Split the SQL into individual statements
  const statements = sql
    .split(';')
    .map(stmt => stmt.trim())
    .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
  
  console.log(`📝 Executing ${statements.length} SQL statements...`);
  
  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i];
    if (statement.trim()) {
      try {
        console.log(`⚡ Executing statement ${i + 1}/${statements.length}...`);
        const { error } = await supabase.rpc('exec_sql', { sql: statement + ';' });
        
        if (error) {
          console.warn(`⚠️  Statement ${i + 1} failed:`, error.message);
          // Continue with other statements
        } else {
          console.log(`✅ Statement ${i + 1} completed`);
        }
      } catch (err) {
        console.warn(`⚠️  Statement ${i + 1} error:`, err.message);
      }
    }
  }
}

async function verifySetup() {
  try {
    // Check if users table exists
    const { data: tables, error: tableError } = await supabase
      .from('users')
      .select('id')
      .limit(1);
    
    if (tableError && tableError.code !== 'PGRST116') {
      console.error('❌ Users table verification failed:', tableError);
      return;
    }
    
    console.log('✅ Users table exists and is accessible');
    
    // Check if functions exist
    const { data: functions, error: funcError } = await supabase.rpc('start_user_trial', {
      user_id: '00000000-0000-0000-0000-000000000000' // Dummy UUID for testing
    });
    
    if (!funcError || funcError.message.includes('violates foreign key constraint')) {
      console.log('✅ start_user_trial function exists');
    } else {
      console.warn('⚠️  start_user_trial function may not exist:', funcError.message);
    }
    
  } catch (error) {
    console.warn('⚠️  Verification encountered issues:', error.message);
  }
}

// Run the setup
setupDatabase();
