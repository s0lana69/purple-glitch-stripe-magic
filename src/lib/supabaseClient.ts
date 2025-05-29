// This project uses Firebase, not Supabase
// This file is kept for backward compatibility but returns dummy clients

console.warn('⚠️ Supabase client accessed but this project uses Firebase. This is a dummy client.');

// Create a dummy Supabase client that doesn't throw errors
export const supabase = {
  auth: {
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    getUser: () => Promise.resolve({ data: { user: null }, error: null }),
    signOut: () => Promise.resolve({ error: null }),
    signInWithOAuth: () => Promise.resolve({ data: null, error: { message: 'This project uses Firebase, not Supabase' } }),
    updateUser: () => Promise.resolve({ data: null, error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } }, error: null }),
  },
  from: () => ({
    select: () => ({ data: null, error: { message: 'This project uses Firebase, not Supabase' } }),
    insert: () => ({ data: null, error: { message: 'This project uses Firebase, not Supabase' } }),
    update: () => ({ data: null, error: { message: 'This project uses Firebase, not Supabase' } }),
    delete: () => ({ data: null, error: { message: 'This project uses Firebase, not Supabase' } }),
    upsert: () => ({ data: null, error: { message: 'This project uses Firebase, not Supabase' } }),
    eq: function() { return this; },
    single: function() { return this; },
  }),
  rpc: () => Promise.resolve({ data: null, error: { message: 'This project uses Firebase, not Supabase' } }),
};

// Export other functions that might be imported
export const createBrowserClient = () => supabase;
export const createServerClient = () => supabase;
export const createClient = () => supabase;
