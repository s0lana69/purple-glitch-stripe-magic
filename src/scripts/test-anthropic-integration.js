/**
 * Test script to verify Anthropic API integration
 */

const testAnthropicAPI = async () => {
  try {
    console.log('Testing Anthropic API integration...');
    
    const response = await fetch('http://localhost:3001/api/anthropic', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: 'Test YouTube channel analysis for MrBeast'
      }),
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Anthropic API is working!');
      console.log('Response:', data);
      return true;
    } else {
      console.log('❌ API Error:', data.error);
      return false;
    }
  } catch (error) {
    console.error('❌ Network Error:', error.message);
    return false;
  }
};

// Run the test
testAnthropicAPI().then(success => {
  if (success) {
    console.log('\n🎉 AI Scanner is ready to use with Anthropic Claude!');
  } else {
    console.log('\n🔧 Check your ANTHROPIC_API_KEY and server configuration.');
  }
});