/**
 * Test script for OAuth redirect flow
 * Run this in the browser console to test the authentication flow
 */

async function testOAuthRedirect() {
  console.log('=== OAuth Redirect Test ===');
  
  // Check current authentication status
  const { supabase } = window;
  if (!supabase) {
    console.error('❌ Supabase client not found. Make sure you are on the correct page.');
    return;
  }
  
  try {
    // Check current session
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('❌ Error getting session:', error);
    } else if (session) {
      console.log('✅ Current session found:', {
        userId: session.user.id,
        email: session.user.email,
        provider: session.user.app_metadata?.provider,
        hasYouTubeAccess: session.user.user_metadata?.has_youtube_access
      });
    } else {
      console.log('ℹ️ No active session found');
    }
    
    // Check URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    console.log('\n=== URL Parameters ===');
    console.log('auth_completed:', urlParams.get('auth_completed'));
    console.log('flow_type:', urlParams.get('flow_type'));
    console.log('redirectedFrom:', urlParams.get('redirectedFrom'));
    console.log('returnTo:', urlParams.get('returnTo'));
    console.log('error:', urlParams.get('error'));
    
    // Check localStorage for auth data
    console.log('\n=== LocalStorage Auth Data ===');
    const authKeys = Object.keys(localStorage).filter(k => k.includes('supabase') || k.includes('auth'));
    authKeys.forEach(key => {
      const value = localStorage.getItem(key);
      console.log(`${key}:`, value ? 'Present' : 'Not found');
    });
    
    // Check cookies
    console.log('\n=== Auth Cookies ===');
    const cookies = document.cookie.split(';');
    const authCookies = cookies.filter(c => c.includes('auth') || c.includes('supabase'));
    authCookies.forEach(cookie => {
      const [name] = cookie.split('=');
      console.log(`Cookie: ${name.trim()}`);
    });
    
    // Test redirect logic
    console.log('\n=== Testing Redirect Logic ===');
    const currentPath = window.location.pathname;
    console.log('Current path:', currentPath);
    
    if (session && currentPath === '/auth') {
      console.log('⚠️ User is authenticated but still on /auth page');
      console.log('Should redirect to:', urlParams.get('redirectedFrom') || '/dashboard');
    } else if (!session && currentPath.startsWith('/dashboard')) {
      console.log('⚠️ User is not authenticated but on dashboard');
      console.log('Should redirect to: /auth');
    } else {
      console.log('✅ User is on the correct page for their auth status');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
  
  console.log('\n=== Test Complete ===');
}

// Function to simulate OAuth completion
function simulateOAuthCompletion() {
  const currentUrl = new URL(window.location.href);
  currentUrl.searchParams.set('auth_completed', 'true');
  currentUrl.searchParams.set('flow_type', 'signup');
  console.log('Simulating OAuth completion redirect to:', currentUrl.toString());
  window.location.href = currentUrl.toString();
}

// Function to clear auth state for testing
function clearAuthState() {
  console.log('Clearing auth state...');
  
  // Clear localStorage
  const authKeys = Object.keys(localStorage).filter(k => 
    k.includes('supabase') || k.includes('auth')
  );
  authKeys.forEach(k => {
    localStorage.removeItem(k);
    console.log('Removed localStorage:', k);
  });
  
  // Clear sessionStorage
  sessionStorage.clear();
  console.log('Cleared sessionStorage');
  
  // Clear cookies
  document.cookie.split(";").forEach(c => {
    const eqPos = c.indexOf("=");
    const name = eqPos > -1 ? c.substr(0, eqPos).trim() : c.trim();
    if (name.includes('auth') || name.includes('supabase')) {
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
      console.log('Cleared cookie:', name);
    }
  });
  
  console.log('✅ Auth state cleared. Refresh the page to test fresh login.');
}

// Export functions to window for easy access
window.testOAuthRedirect = testOAuthRedirect;
window.simulateOAuthCompletion = simulateOAuthCompletion;
window.clearAuthState = clearAuthState;

console.log('OAuth test functions loaded. Available commands:');
console.log('- testOAuthRedirect() - Test current OAuth state');
console.log('- simulateOAuthCompletion() - Simulate OAuth callback');
console.log('- clearAuthState() - Clear all auth data for fresh testing');