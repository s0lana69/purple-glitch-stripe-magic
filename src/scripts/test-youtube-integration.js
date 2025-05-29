// Simple test script to check YouTube integration status
// Run with: node src/scripts/test-youtube-integration.js

const fetch = require('node-fetch');

async function testYouTubeIntegration() {
  const baseUrl = 'http://localhost:3000';
  
  console.log('🔍 Testing YouTube Integration...\n');
  
  try {
    // Test 1: Check if server is running
    console.log('1. Testing server connectivity...');
    const healthCheck = await fetch(`${baseUrl}/api/youtube/check-status`);
    console.log(`   Server response: ${healthCheck.status} ${healthCheck.statusText}`);
    
    if (healthCheck.status === 200) {
      const data = await healthCheck.json();
      console.log('   Response data:', JSON.stringify(data, null, 2));
    }
    
    // Test 2: Check debug page accessibility
    console.log('\n2. Testing debug page accessibility...');
    const debugPage = await fetch(`${baseUrl}/debug-youtube`);
    console.log(`   Debug page response: ${debugPage.status} ${debugPage.statusText}`);
    
    // Test 3: Check dashboard accessibility
    console.log('\n3. Testing dashboard accessibility...');
    const dashboardPage = await fetch(`${baseUrl}/dashboard`);
    console.log(`   Dashboard response: ${dashboardPage.status} ${dashboardPage.statusText}`);
    
    console.log('\n✅ Integration test completed!');
    console.log('\nNext steps:');
    console.log('1. Open http://localhost:3000/debug-youtube in your browser');
    console.log('2. If it redirects, check the browser console for errors');
    console.log('3. Try logging in first at http://localhost:3000/auth');
    console.log('4. Then test the YouTube connection flow');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\nTroubleshooting:');
    console.log('1. Make sure the development server is running (npm run dev)');
    console.log('2. Check if port 3000 is available');
    console.log('3. Verify environment variables are set');
  }
}

testYouTubeIntegration();