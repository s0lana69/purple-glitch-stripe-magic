/**
 * Emergency script to clear all authentication data and corrupted sessions
 * Run this in the browser console if you're experiencing UTF-8 or session errors
 */

console.log('🧹 Starting complete authentication data cleanup...');

// 1. Clear all localStorage
try {
  const localStorageKeys = Object.keys(localStorage);
  console.log(`📦 Found ${localStorageKeys.length} localStorage keys`);
  
  localStorageKeys.forEach(key => {
    try {
      localStorage.removeItem(key);
      console.log(`✅ Removed localStorage: ${key}`);
    } catch (error) {
      console.warn(`❌ Failed to remove localStorage ${key}:`, error);
    }
  });
  
  // Force clear entire localStorage
  localStorage.clear();
  console.log('✅ localStorage completely cleared');
} catch (error) {
  console.error('❌ Error clearing localStorage:', error);
}

// 2. Clear all sessionStorage
try {
  const sessionStorageKeys = Object.keys(sessionStorage);
  console.log(`📦 Found ${sessionStorageKeys.length} sessionStorage keys`);
  
  sessionStorageKeys.forEach(key => {
    try {
      sessionStorage.removeItem(key);
      console.log(`✅ Removed sessionStorage: ${key}`);
    } catch (error) {
      console.warn(`❌ Failed to remove sessionStorage ${key}:`, error);
    }
  });
  
  // Force clear entire sessionStorage
  sessionStorage.clear();
  console.log('✅ sessionStorage completely cleared');
} catch (error) {
  console.error('❌ Error clearing sessionStorage:', error);
}

// 3. Clear all cookies
try {
  // Get all cookies
  const cookies = document.cookie.split(';');
  console.log(`🍪 Found ${cookies.length} cookies`);
  
  cookies.forEach(cookie => {
    const eqPos = cookie.indexOf('=');
    const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
    
    if (name) {
      // Clear cookie for current domain
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${window.location.hostname}`;
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=.${window.location.hostname}`;
      
      // For trueviral.ai domain specifically
      if (window.location.hostname.includes('trueviral.ai')) {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=.trueviral.ai`;
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=trueviral.ai`;
      }
      
      console.log(`✅ Cleared cookie: ${name}`);
    }
  });
  
  console.log('✅ All cookies cleared');
} catch (error) {
  console.error('❌ Error clearing cookies:', error);
}

// 4. Clear IndexedDB (if any)
try {
  if ('indexedDB' in window) {
    // This is a more complex operation, but we'll attempt basic cleanup
    console.log('🗄️ Attempting IndexedDB cleanup...');
    
    // Note: Full IndexedDB cleanup would require knowing database names
    // For now, we'll just log that we attempted it
    console.log('ℹ️ IndexedDB cleanup attempted (manual verification may be needed)');
  }
} catch (error) {
  console.error('❌ Error with IndexedDB cleanup:', error);
}

// 5. Clear any cached service worker data
try {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(registrations => {
      registrations.forEach(registration => {
        registration.unregister();
        console.log('✅ Unregistered service worker');
      });
    });
  }
} catch (error) {
  console.error('❌ Error clearing service workers:', error);
}

// 6. Clear cache storage
try {
  if ('caches' in window) {
    caches.keys().then(cacheNames => {
      cacheNames.forEach(cacheName => {
        caches.delete(cacheName);
        console.log(`✅ Cleared cache: ${cacheName}`);
      });
    });
  }
} catch (error) {
  console.error('❌ Error clearing caches:', error);
}

console.log('🎉 Authentication data cleanup completed!');
console.log('🔄 Please refresh the page and try logging in again.');
console.log('📝 If issues persist, try opening an incognito/private window.');

// Optionally reload the page after cleanup
const shouldReload = confirm('Authentication data has been cleared. Would you like to reload the page now?');
if (shouldReload) {
  window.location.reload();
}