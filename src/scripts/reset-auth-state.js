// Script to reset authentication state and clear all cookies
// Run this if you're experiencing persistent auth issues

console.log('🔄 Resetting authentication state...');

// Clear all Supabase auth cookies
const cookiesToClear = [
  'sb-jfkmpdfyevlutyrcgnhw-auth-token',
  'sb-jfkmpdfyevlutyrcgnhw-auth-token-code-verifier',
  'supabase-auth-token',
  'supabase.auth.token',
  'sb-auth-token',
  'pkce-code-verifier'
];

// Clear localStorage items
const localStorageKeys = [
  'supabase.auth.token',
  'sb-jfkmpdfyevlutyrcgnhw-auth-token',
  'youtube-status-changed',
  'auth-redirect-path'
];

// Clear sessionStorage items
const sessionStorageKeys = [
  'supabase.auth.token',
  'sb-jfkmpdfyevlutyrcgnhw-auth-token'
];

if (typeof window !== 'undefined') {
  // Clear cookies
  cookiesToClear.forEach(cookieName => {
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.trueviral.ai;`;
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=trueviral.ai;`;
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=localhost;`;
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    console.log(`✅ Cleared cookie: ${cookieName}`);
  });

  // Clear localStorage
  localStorageKeys.forEach(key => {
    try {
      localStorage.removeItem(key);
      console.log(`✅ Cleared localStorage: ${key}`);
    } catch (e) {
      console.warn(`⚠️ Could not clear localStorage ${key}:`, e);
    }
  });

  // Clear sessionStorage
  sessionStorageKeys.forEach(key => {
    try {
      sessionStorage.removeItem(key);
      console.log(`✅ Cleared sessionStorage: ${key}`);
    } catch (e) {
      console.warn(`⚠️ Could not clear sessionStorage ${key}:`, e);
    }
  });

  console.log('🎯 Authentication state reset complete!');
  console.log('📝 Next steps:');
  console.log('1. Refresh the page');
  console.log('2. Try logging in again');
  console.log('3. If issues persist, try in an incognito window');
  
} else {
  console.log('❌ This script must be run in a browser environment');
}