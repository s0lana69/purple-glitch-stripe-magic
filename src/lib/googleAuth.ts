import { GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult } from 'firebase/auth';
import { auth } from './firebase'; // Use the actual Firebase auth instance

const googleProvider = new GoogleAuthProvider();

// Configure Google OAuth scopes
googleProvider.addScope('https://www.googleapis.com/auth/userinfo.email');
googleProvider.addScope('https://www.googleapis.com/auth/userinfo.profile');

export async function signInWithGooglePopup() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    console.log('[GoogleAuth] Sign-in successful:', result.user.email);
    return result;
  } catch (error: any) {
    console.error('[GoogleAuth] Popup sign-in error:', error);
    throw error;
  }
}

export async function signInWithGoogleRedirect() {
  try {
    await signInWithRedirect(auth, googleProvider);
  } catch (error: any) {
    console.error('[GoogleAuth] Redirect sign-in error:', error);
    throw error;
  }
}

export async function handleGoogleRedirectResult() {
  try {
    const result = await getRedirectResult(auth);
    if (result) {
      console.log('[GoogleAuth] Redirect result:', result.user.email);
      return result;
    }
    return null;
  } catch (error: any) {
    console.error('[GoogleAuth] Redirect result error:', error);
    throw error;
  }
}