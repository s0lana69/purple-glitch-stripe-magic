import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  updateProfile,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { auth, db } from './firebase';

// Types
export interface FirebaseUser extends User {
  customClaims?: Record<string, any>;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  createdAt: Timestamp;
  lastLoginAt: Timestamp;
  subscription: {
    plan: 'free' | 'pro' | 'enterprise';
    status: 'active' | 'canceled' | 'past_due' | 'trialing';
    currentPeriodEnd?: Timestamp;
    trialEnd?: Timestamp;
    stripeCustomerId?: string;
    stripeSubscriptionId?: string;
  };
  youtube: {
    connected: boolean;
    channelId?: string;
    channelName?: string;
    accessToken?: string;
    refreshToken?: string;
    connectedAt?: Timestamp;
  };
  profile: {
    firstName?: string;
    lastName?: string;
    company?: string;
    industry?: string;
    phone?: string;
  };
}

// Authentication functions
export const firebaseAuth = {
  // Sign in with email and password
  signIn: async (email: string, password: string) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      await updateLastLogin(result.user.uid);
      return result;
    } catch (error) {
      console.error('Firebase sign in error:', error);
      throw error;
    }
  },

  // Sign up with email and password
  signUp: async (email: string, password: string, displayName?: string) => {
    console.log('🔥 [FIREBASE DEBUG] Starting signup process for:', email);
    try {
      console.log('📝 [FIREBASE DEBUG] Creating user with email and password...');
      const result = await createUserWithEmailAndPassword(auth, email, password);
      console.log('✅ [FIREBASE DEBUG] User created successfully, UID:', result.user.uid);
      
      // Update profile with display name if provided
      if (displayName) {
        console.log('👤 [FIREBASE DEBUG] Updating profile with display name:', displayName);
        await updateProfile(result.user, { displayName });
        console.log('✅ [FIREBASE DEBUG] Profile updated successfully');
      }

      // Create user profile in Firestore
      console.log('💾 [FIREBASE DEBUG] Creating user profile in Firestore...');
      await createUserProfile(result.user, { displayName });
      console.log('✅ [FIREBASE DEBUG] User profile created in Firestore successfully');
      
      return result;
    } catch (error: any) {
      console.error('❌ [FIREBASE DEBUG] Firebase sign up error:', error);
      console.error('❌ [FIREBASE DEBUG] Error code:', error.code);
      console.error('❌ [FIREBASE DEBUG] Error message:', error.message);
      throw error;
    }
  },

  // Sign in with Google
  signInWithGoogle: async () => {
    try {
      const provider = new GoogleAuthProvider();
      provider.addScope('profile');
      provider.addScope('email');
      
      const result = await signInWithPopup(auth, provider);
      
      // Check if user profile exists, create if not
      const userDoc = await getDoc(doc(db, 'users', result.user.uid));
      if (!userDoc.exists()) {
        await createUserProfile(result.user);
      } else {
        await updateLastLogin(result.user.uid);
      }
      
      return result;
    } catch (error) {
      console.error('Firebase Google sign in error:', error);
      throw error;
    }
  },

  // Sign out
  signOut: async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Firebase sign out error:', error);
      throw error;
    }
  },

  // Reset password
  resetPassword: async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error('Firebase password reset error:', error);
      throw error;
    }
  },

  // Update password
  updatePassword: async (currentPassword: string, newPassword: string) => {
    try {
      const user = auth.currentUser;
      if (!user || !user.email) throw new Error('No authenticated user');

      // Re-authenticate user
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);

      // Update password
      await updatePassword(user, newPassword);
    } catch (error) {
      console.error('Firebase update password error:', error);
      throw error;
    }
  },

  // Get current user
  getCurrentUser: () => auth.currentUser,

  // Listen to auth state changes
  onAuthStateChanged: (callback: (user: User | null) => void) => {
    return onAuthStateChanged(auth, callback);
  },
};

// User profile functions
export const userProfileService = {
  // Get user profile
  getUserProfile: async (uid: string): Promise<UserProfile | null> => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        return userDoc.data() as UserProfile;
      }
      return null;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  },

  // Update user profile
  updateUserProfile: async (uid: string, updates: Partial<UserProfile>) => {
    try {
      const userRef = doc(db, 'users', uid);
      await updateDoc(userRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  },

  // Update subscription info
  updateSubscription: async (uid: string, subscription: UserProfile['subscription']) => {
    try {
      const userRef = doc(db, 'users', uid);
      await updateDoc(userRef, {
        subscription,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating subscription:', error);
      throw error;
    }
  },

  // Update YouTube connection
  updateYouTubeConnection: async (uid: string, youtube: UserProfile['youtube']) => {
    try {
      const userRef = doc(db, 'users', uid);
      await updateDoc(userRef, {
        youtube,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating YouTube connection:', error);
      throw error;
    }
  },
};

// Helper functions
async function createUserProfile(user: User, additionalData?: { displayName?: string }) {
  console.log('👤 [FIREBASE DEBUG] Creating user profile for UID:', user.uid);
  console.log('📧 [FIREBASE DEBUG] User email:', user.email);
  console.log('🏷️ [FIREBASE DEBUG] Display name:', additionalData?.displayName || user.displayName || 'none');
  
  const userProfile: UserProfile = {
    uid: user.uid,
    email: user.email!,
    displayName: additionalData?.displayName || user.displayName || '',
    photoURL: user.photoURL || '',
    createdAt: serverTimestamp() as Timestamp,
    lastLoginAt: serverTimestamp() as Timestamp,
    subscription: {
      plan: 'free',
      status: 'active',
      trialEnd: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) as any, // 14 days trial
    },
    youtube: {
      connected: false,
    },
    profile: {},
  };

  console.log('📋 [FIREBASE DEBUG] User profile structure:', JSON.stringify(userProfile, null, 2));
  
  try {
    console.log('💾 [FIREBASE DEBUG] Writing to Firestore collection: users, document:', user.uid);
    await setDoc(doc(db, 'users', user.uid), userProfile);
    console.log('✅ [FIREBASE DEBUG] User profile written to Firestore successfully');
  } catch (error: any) {
    console.error('❌ [FIREBASE DEBUG] Failed to write user profile to Firestore:', error);
    console.error('❌ [FIREBASE DEBUG] Firestore error code:', error.code);
    console.error('❌ [FIREBASE DEBUG] Firestore error message:', error.message);
    
    if (error.code === 'permission-denied') {
      console.error('🔐 [FIREBASE DEBUG] Permission denied - check Firestore security rules');
    } else if (error.code === 'unavailable') {
      console.error('🌐 [FIREBASE DEBUG] Firestore service unavailable - check network connection');
    }
    
    throw error;
  }
}

async function updateLastLogin(uid: string) {
  try {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, {
      lastLoginAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating last login:', error);
  }
}

// Auth state management
export class AuthStateManager {
  private static instance: AuthStateManager;
  private listeners: ((user: User | null) => void)[] = [];
  private currentUser: User | null = null;

  static getInstance(): AuthStateManager {
    if (!AuthStateManager.instance) {
      AuthStateManager.instance = new AuthStateManager();
    }
    return AuthStateManager.instance;
  }

  constructor() {
    // Listen to auth state changes
    onAuthStateChanged(auth, (user) => {
      this.currentUser = user;
      this.listeners.forEach(listener => listener(user));
    });
  }

  addListener(listener: (user: User | null) => void): () => void {
    this.listeners.push(listener);
    // Immediately call with current user
    listener(this.currentUser);
    
    // Return unsubscribe function
    return () => {
      this.removeListener(listener);
    };
  }

  removeListener(listener: (user: User | null) => void) {
    this.listeners = this.listeners.filter(l => l !== listener);
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }
}

export default firebaseAuth;
