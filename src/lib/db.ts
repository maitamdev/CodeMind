/**
 * Database helper functions using Supabase
 * 
 * IMPORTANT: This file provides compatibility functions for existing MySQL queries.
 * For new code, prefer using db-helpers.ts which provides better Supabase integration.
 * 
 * For complex queries with JOINs and subqueries, you have two options:
 * 1. Use PostgreSQL functions (RPC) - see MIGRATION_GUIDE.md
 * 2. Refactor to use Supabase query builder - see db-helpers.ts
 */

import { supabaseAdmin } from './supabase';
import { queryBuilder, queryOneBuilder, update as updateHelper, insert as insertHelper, deleteRows as deleteHelper } from './db-helpers';


/**
 * Transaction helper (Supabase supports transactions via RPC)
 */
export async function transaction<T>(
  callback: (client: any) => Promise<T>
): Promise<T> {
  // Supabase doesn't have explicit transactions in the JS client
  // For transactions, we need to use PostgreSQL functions or Supabase Edge Functions
  // This is a compatibility wrapper
  try {
    return await callback(supabaseAdmin);
  } catch (error) {
    console.error('Transaction error:', error);
    throw error;
  }
}

/**
 * Test connection
 */
export async function testConnection() {
  try {
    if (!supabaseAdmin) {
      console.error('❌ Supabase admin client not initialized');
      return false;
    }
    
    const { data, error } = await supabaseAdmin.from('users').select('id').limit(1);
    if (error) {
      console.error('❌ Database connection failed:', error);
      return false;
    }
    console.log('✅ Database connected successfully!');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
}

// Export Supabase client for direct use
export { supabaseAdmin as db };
// Export helper functions for easier migration
export { queryBuilder, queryOneBuilder, insert, update, deleteRows, rpc } from './db-helpers';
