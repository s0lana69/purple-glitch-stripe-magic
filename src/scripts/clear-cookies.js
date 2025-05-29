// Clear all Supabase cookies - run this to reset authentication state
const cookieNames = [
  'sb-jfkmpdfyevlutyrcgnhw-auth-token',
  'sb-jfkmpdfyevlutyrcgnhw-auth-token-code-verifier',
  'supabase-auth-token',
  'supabase.auth.token'
];

if (typeof document !== 'undefined') {
  // Browser environment
  cookieNames.forEach(name => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.localhost;`;
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=localhost;`;
  });
  
  // Clear localStorage
  localStorage.clear();
  sessionStorage.clear();
  
  console.log('Cookies and storage cleared!');
} else {
  console.log('This script should be run in the browser console');
}
