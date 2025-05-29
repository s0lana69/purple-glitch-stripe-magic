/**
 * Script to fix OAuth authentication state issues
 * Run this script to clear corrupted authentication state
 */

// Clear all Supabase-related cookies and localStorage
function clearAuthState() {
  console.log('Clearing authentication state...');
  
  // Clear localStorage
  if (typeof localStorage !== 'undefined') {
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.startsWith('sb-') || key.startsWith('supabase'))) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
      console.log(`Removed localStorage key: ${key}`);
    });
  }
  
  // Clear sessionStorage
  if (typeof sessionStorage !== 'undefined') {
    const keysToRemove = [];
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key && (key.startsWith('sb-') || key.startsWith('supabase'))) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => {
      sessionStorage.removeItem(key);
      console.log(`Removed sessionStorage key: ${key}`);
    });
  }
  
  // Clear cookies (if js-cookie is available)
  if (typeof window !== 'undefined' && window.Cookies) {
    const allCookies = window.Cookies.get();
    Object.keys(allCookies).forEach(cookieName => {
      if (cookieName.startsWith('sb-') || cookieName.startsWith('supabase') || cookieName.includes('auth-token')) {
        window.Cookies.remove(cookieName, { path: '/' });
        window.Cookies.remove(cookieName, { path: '/', domain: '.trueviral.ai' });
        window.Cookies.remove(cookieName, { path: '/', domain: 'trueviral.ai' });
        console.log(`Removed cookie: ${cookieName}`);
      }
    });
  }
  
  console.log('Authentication state cleared successfully!');
  console.log('Please refresh the page and try logging in again.');
}

// Run the cleanup
if (typeof window !== 'undefined') {
  clearAuthState();
} else {
  console.log('This script should be run in a browser environment.');
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { clearAuthState };
}