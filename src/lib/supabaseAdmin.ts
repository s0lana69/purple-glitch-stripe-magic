// This project uses Firebase, not Supabase
// This file is kept for backward compatibility but returns dummy clients

console.warn('⚠️ Supabase admin client accessed but this project uses Firebase. This is a dummy client.');

// Create a proper chainable query builder that mimics Supabase's interface
class DummyQueryBuilder {
  private dummyResult = { 
    data: null, 
    error: { message: 'This project uses Firebase, not Supabase' } 
  };

  // Chainable methods return this
  select(...args: any[]) { return this; }
  insert(...args: any[]) { return this; }
  update(...args: any[]) { return this; }
  delete(...args: any[]) { return this; }
  upsert(...args: any[]) { return this; }
  eq(...args: any[]) { return this; }
  neq(...args: any[]) { return this; }
  gt(...args: any[]) { return this; }
  gte(...args: any[]) { return this; }
  lt(...args: any[]) { return this; }
  lte(...args: any[]) { return this; }
  like(...args: any[]) { return this; }
  ilike(...args: any[]) { return this; }
  is(...args: any[]) { return this; }
  in(...args: any[]) { return this; }
  contains(...args: any[]) { return this; }
  containedBy(...args: any[]) { return this; }
  rangeGt(...args: any[]) { return this; }
  rangeGte(...args: any[]) { return this; }
  rangeLt(...args: any[]) { return this; }
  rangeLte(...args: any[]) { return this; }
  rangeAdjacent(...args: any[]) { return this; }
  overlaps(...args: any[]) { return this; }
  textSearch(...args: any[]) { return this; }
  match(...args: any[]) { return this; }
  not(...args: any[]) { return this; }
  or(...args: any[]) { return this; }
  filter(...args: any[]) { return this; }
  order(...args: any[]) { return this; }
  limit(...args: any[]) { return this; }
  range(...args: any[]) { return this; }

  // Terminal methods return Promises
  single(...args: any[]) { 
    return Promise.resolve(this.dummyResult); 
  }
  
  maybeSingle(...args: any[]) { 
    return Promise.resolve(this.dummyResult); 
  }

  // Make the class itself awaitable by implementing then
  then(onFulfilled?: any, onRejected?: any) {
    return Promise.resolve(this.dummyResult).then(onFulfilled, onRejected);
  }
}

// Create a dummy Supabase admin client that doesn't throw errors
export const supabaseAdmin = {
  auth: {
    admin: {
      getUserById: () => Promise.resolve({ data: { user: null }, error: { message: 'This project uses Firebase, not Supabase' } }),
      listUsers: () => Promise.resolve({ data: { users: [] }, error: { message: 'This project uses Firebase, not Supabase' } }),
      deleteUser: () => Promise.resolve({ data: null, error: { message: 'This project uses Firebase, not Supabase' } }),
      updateUserById: () => Promise.resolve({ data: null, error: { message: 'This project uses Firebase, not Supabase' } }),
    },
  },
  from: (table: string) => new DummyQueryBuilder(),
  rpc: (...args: any[]) => Promise.resolve({ data: null, error: { message: 'This project uses Firebase, not Supabase' } }),
};

// Export functions that might be imported
export const createAdminClient = () => supabaseAdmin;
export const createClient = () => supabaseAdmin;
