/**
 * Test script to verify Gemini API integration
 */

const testGeminiAPI = async () => {
  try {
    console.log('Testing Gemini API integration...');
    
    const response = await fetch('http://localhost:3000/api/gemini', {
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
      console.log('✅ Gemini API is working!');
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
testGeminiAPI().then(success => {
  if (success) {
    console.log('\n🎉 AI Scanner is ready to use with Google Gemini 2.0!');
  } else {
    console.log('\n🔧 Check your GOOGLE_API_KEY and server configuration.');
    console.log('Get your API key from: https://aistudio.google.com/');
  }
});