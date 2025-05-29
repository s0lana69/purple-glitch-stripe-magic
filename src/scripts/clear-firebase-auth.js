/**
 * Clear Firebase Authentication Script
 * Clears all Firebase authentication data from browser storage
 */

const fs = require('fs');
const path = require('path');

function clearFirebaseAuth() {
  console.log('🔥 Clearing Firebase Authentication Data...\n');

  // Instructions for manual clearing
  console.log('📝 Manual Steps to Clear Firebase Auth:');
  console.log('======================================');
  console.log('1. Open your browser Developer Tools (F12)');
  console.log('2. Go to Application/Storage tab');
  console.log('3. Clear the following:');
  console.log('   - Local Storage (all firebase-related keys)');
  console.log('   - Session Storage (all firebase-related keys)');
  console.log('   - Cookies (especially auth-related)');
  console.log('   - IndexedDB (firebase-related databases)');
  console.log('');

  // Create a client-side script to run in browser
  const clientScript = `
// Firebase Auth Clear Script - Run this in browser console
console.log('🔥 Clearing Firebase Auth Data...');

// Clear localStorage
Object.keys(localStorage).forEach(key => {
  if (key.includes('firebase') || key.includes('auth') || key.includes('user')) {
    localStorage.removeItem(key);
    console.log('Cleared localStorage:', key);
  }
});

// Clear sessionStorage
Object.keys(sessionStorage).forEach(key => {
  if (key.includes('firebase') || key.includes('auth') || key.includes('user')) {
    sessionStorage.removeItem(key);
    console.log('Cleared sessionStorage:', key);
  }
});

// Clear cookies
document.cookie.split(";").forEach(function(c) { 
  const eqPos = c.indexOf("=");
  const name = eqPos > -1 ? c.substr(0, eqPos) : c;
  if (name.includes('auth') || name.includes('session') || name.includes('token')) {
    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
    console.log('Cleared cookie:', name);
  }
});

console.log('✅ Firebase auth data cleared!');
console.log('Please refresh the page to complete the logout.');
`;

  // Save the client script
  const scriptPath = path.join(process.cwd(), 'public', 'clear-firebase-auth.js');
  fs.writeFileSync(scriptPath, clientScript);
  
  console.log('🌐 Browser Script Created:');
  console.log(`   File: ${scriptPath}`);
  console.log('   Usage: Copy and paste the script content into browser console');
  console.log('');

  // Create a simple HTML page for easy clearing
  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Clear Firebase Auth</title>
    <style>
        body { font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; }
        .button { background: #f44336; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; font-size: 16px; margin: 10px 0; }
        .button:hover { background: #da190b; }
        .success { color: green; font-weight: bold; }
        .info { background: #f0f0f0; padding: 15px; border-radius: 5px; margin: 10px 0; }
    </style>
</head>
<body>
    <h1>🔥 Clear Firebase Authentication</h1>
    <div class="info">
        <p>This tool will clear all Firebase authentication data from your browser.</p>
        <p>Click the button below to clear auth data and logout.</p>
    </div>
    
    <button class="button" onclick="clearAuth()">Clear Firebase Auth Data</button>
    <button class="button" onclick="location.reload()">Refresh Page</button>
    
    <div id="status"></div>

    <script>
        function clearAuth() {
            const status = document.getElementById('status');
            status.innerHTML = '<p>🔄 Clearing Firebase auth data...</p>';
            
            let cleared = [];
            
            // Clear localStorage
            Object.keys(localStorage).forEach(key => {
                if (key.includes('firebase') || key.includes('auth') || key.includes('user')) {
                    localStorage.removeItem(key);
                    cleared.push('localStorage: ' + key);
                }
            });
            
            // Clear sessionStorage
            Object.keys(sessionStorage).forEach(key => {
                if (key.includes('firebase') || key.includes('auth') || key.includes('user')) {
                    sessionStorage.removeItem(key);
                    cleared.push('sessionStorage: ' + key);
                }
            });
            
            // Clear cookies
            document.cookie.split(";").forEach(function(c) { 
                const eqPos = c.indexOf("=");
                const name = eqPos > -1 ? c.substr(0, eqPos).trim() : c.trim();
                if (name.includes('auth') || name.includes('session') || name.includes('token') || name.includes('firebase')) {
                    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
                    cleared.push('cookie: ' + name);
                }
            });
            
            status.innerHTML = \`
                <div class="success">
                    <p>✅ Firebase auth data cleared!</p>
                    <p>Cleared \${cleared.length} items:</p>
                    <ul>\${cleared.map(item => '<li>' + item + '</li>').join('')}</ul>
                    <p><strong>Please refresh the page or restart your application.</strong></p>
                </div>
            \`;
        }
    </script>
</body>
</html>
`;

  const htmlPath = path.join(process.cwd(), 'public', 'clear-firebase-auth.html');
  fs.writeFileSync(htmlPath, htmlContent);

  console.log('📄 Clear Auth Page Created:');
  console.log(`   File: ${htmlPath}`);
  console.log(`   URL: http://localhost:3000/clear-firebase-auth.html`);
  console.log('');

  console.log('🚀 Quick Clear Commands:');
  console.log('========================');
  console.log('1. Visit: http://localhost:3000/clear-firebase-auth.html');
  console.log('2. Or run in browser console:');
  console.log('   Object.keys(localStorage).forEach(k => k.includes("firebase") && localStorage.removeItem(k))');
  console.log('');

  console.log('✅ Firebase auth clearing tools created successfully!');
  console.log('Use the HTML page or browser console commands to clear auth data.');
}

// Environment variables check
function checkEnvironment() {
  console.log('🔍 Checking Firebase Environment...\n');
  
  const requiredVars = [
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID'
  ];

  let envStatus = true;
  requiredVars.forEach(varName => {
    if (process.env[varName]) {
      console.log(`✅ ${varName}: Set`);
    } else {
      console.log(`❌ ${varName}: Missing`);
      envStatus = false;
    }
  });

  if (!envStatus) {
    console.log('\n⚠️  Some Firebase environment variables are missing.');
    console.log('Please check your .env.local file.');
  }

  return envStatus;
}

// Run the script
if (require.main === module) {
  // Load environment variables
  require('dotenv').config({ path: '.env.local' });
  
  checkEnvironment();
  clearFirebaseAuth();
}

module.exports = {
  clearFirebaseAuth,
  checkEnvironment
};
