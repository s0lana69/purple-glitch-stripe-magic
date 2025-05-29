/**
 * YouTube Integration Debug Script
 * This script helps diagnose YouTube integration issues
 */

// Function to check current auth state
async function checkAuthState() {
  console.log('=== Checking Auth State ===');
  
  try {
    const response = await fetch('/api/auth/session', {
      credentials: 'include'
    });
    
    if (response.ok) {
      const session = await response.json();
      console.log('Session exists:', !!session);
      console.log('User ID:', session?.user?.id);
      console.log('User metadata:', session?.user?.user_metadata);
      console.log('Provider token:', !!session?.provider_token);
      console.log('Has YouTube access:', session?.user?.user_metadata?.has_youtube_access);
      return session;
    } else {
      console.log('No valid session');
      return null;
    }
  } catch (error) {
    console.error('Error checking auth state:', error);
    return null;
  }
}

// Function to check YouTube connection status
async function checkYouTubeStatus() {
  console.log('\n=== Checking YouTube Status ===');
  
  try {
    const response = await fetch('/api/youtube/check-status', {
      credentials: 'include'
    });
    
    const data = await response.json();
    console.log('YouTube Status Response:', data);
    return data;
  } catch (error) {
    console.error('Error checking YouTube status:', error);
    return null;
  }
}

// Function to test token validation
async function testTokenValidation() {
  console.log('\n=== Testing Token Validation ===');
  
  try {
    const response = await fetch('/api/youtube/validate-token', {
      credentials: 'include'
    });
    
    const data = await response.json();
    console.log('Token Validation Response:', data);
    return data;
  } catch (error) {
    console.error('Error validating token:', error);
    return null;
  }
}

// Function to check localStorage events
function checkLocalStorage() {
  console.log('\n=== Checking LocalStorage ===');
  
  const youtubeStatusChanged = localStorage.getItem('youtube-status-changed');
  console.log('youtube-status-changed timestamp:', youtubeStatusChanged);
  
  if (youtubeStatusChanged) {
    const timestamp = parseInt(youtubeStatusChanged);
    const now = Date.now();
    const ageInSeconds = (now - timestamp) / 1000;
    console.log(`Status change was ${ageInSeconds} seconds ago`);
  }
}

// Function to trigger status refresh
function triggerStatusRefresh() {
  console.log('\n=== Triggering Status Refresh ===');
  
  // Clear cache
  localStorage.removeItem('youtube-status-changed');
  localStorage.setItem('youtube-status-changed', Date.now().toString());
  
  // Dispatch custom event
  window.dispatchEvent(new CustomEvent('youtube-connection-updated'));
  window.dispatchEvent(new StorageEvent('storage', {
    key: 'youtube-status-changed',
    newValue: Date.now().toString()
  }));
  
  console.log('Status refresh events dispatched');
}

// Main diagnostic function
async function runDiagnostics() {
  console.log('🔍 Starting YouTube Integration Diagnostics...\n');
  
  // Check current URL for auth completion parameters
  const urlParams = new URLSearchParams(window.location.search);
  const authCompleted = urlParams.get('auth_completed');
  const flowType = urlParams.get('flow_type');
  
  console.log('URL Parameters:');
  console.log('- auth_completed:', authCompleted);
  console.log('- flow_type:', flowType);
  
  // Run all checks
  const session = await checkAuthState();
  const youtubeStatus = await checkYouTubeStatus();
  const tokenValidation = await testTokenValidation();
  
  checkLocalStorage();
  
  // Summary
  console.log('\n=== DIAGNOSTIC SUMMARY ===');
  console.log('Auth Session:', session ? '✅ Valid' : '❌ Invalid');
  console.log('YouTube Connection:', youtubeStatus?.connected ? '✅ Connected' : '❌ Not Connected');
  console.log('Token Validation:', tokenValidation?.valid ? '✅ Valid' : '❌ Invalid');
  
  if (session?.user?.user_metadata?.has_youtube_access === true && !youtubeStatus?.connected) {
    console.log('\n⚠️  ISSUE DETECTED: User metadata shows YouTube access but status check fails');
    console.log('This indicates a token storage or validation issue');
    
    console.log('\n🔧 Attempting automatic fix...');
    triggerStatusRefresh();
    
    // Wait and recheck
    setTimeout(async () => {
      console.log('\n=== RECHECKING AFTER REFRESH ===');
      const newStatus = await checkYouTubeStatus();
      console.log('YouTube Status After Refresh:', newStatus?.connected ? '✅ Connected' : '❌ Still Not Connected');
    }, 2000);
  }
  
  if (authCompleted === 'true' && flowType === 'linking') {
    console.log('\n🔗 Recent linking detected, triggering refresh...');
    triggerStatusRefresh();
  }
}

// Auto-run if called directly
if (typeof window !== 'undefined') {
  runDiagnostics();
}

// Export for manual use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    checkAuthState,
    checkYouTubeStatus,
    testTokenValidation,
    checkLocalStorage,
    triggerStatusRefresh,
    runDiagnostics
  };
}
