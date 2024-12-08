import { createClient } from '@supabase/supabase-js';
import { NetworkError, AuthenticationError } from './errors';
import { env } from '../config/env';
import { toast } from 'sonner';

if (!env.supabase.url || !env.supabase.anonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(env.supabase.url, env.supabase.anonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storageKey: 'supabase.auth.token',
    storage: window.localStorage,
  },
  global: {
    headers: {
      'x-client-info': 'donor-profiling-lab',
    },
  },
  // Add retry configuration
  db: {
    schema: 'public',
  },
  realtime: {
    params: {
      eventsPerSecond: 2,
    },
  },
});

let initialized = false;
let connectionCheckInterval: NodeJS.Timeout | null = null;

export async function initializeSupabase(): Promise<void> {
  if (initialized) return;

  try {
    // Test the connection
    const { error } = await supabase.from('profiles').select('count', { count: 'exact', head: true });
    
    if (error) {
      console.error('Supabase initialization error:', error);
      throw error;
    }

    // Start periodic connection checks
    startConnectionChecks();
    
    initialized = true;
    console.info('Successfully initialized Supabase connection');
  } catch (error) {
    console.error('Failed to initialize Supabase:', error);
    
    if (error instanceof AuthenticationError) {
      toast.error('Authentication error. Please check your credentials.');
      throw error;
    }
    
    if (error instanceof NetworkError || error.message?.includes('Failed to fetch')) {
      toast.error('Network error. Please check your connection.');
      throw new NetworkError('Failed to initialize Supabase connection');
    }
    
    toast.error('Failed to connect to the database. Please try again later.');
    throw error;
  }
}

function startConnectionChecks() {
  if (connectionCheckInterval) {
    clearInterval(connectionCheckInterval);
  }

  connectionCheckInterval = setInterval(async () => {
    try {
      const { error } = await supabase.from('profiles').select('count', { count: 'exact', head: true });
      if (error) throw error;
    } catch (error) {
      console.error('Connection check failed:', error);
      if (!navigator.onLine) {
        toast.error('Network connection lost. Retrying when online...');
      }
    }
  }, 30000); // Check every 30 seconds
}

// Handle online/offline events
window.addEventListener('online', () => {
  toast.success('Connection restored');
  startConnectionChecks();
});

window.addEventListener('offline', () => {
  toast.error('Network connection lost');
  if (connectionCheckInterval) {
    clearInterval(connectionCheckInterval);
  }
});

// Clean up on window unload
window.addEventListener('unload', () => {
  if (connectionCheckInterval) {
    clearInterval(connectionCheckInterval);
  }
});

export function getSupabaseClient() {
  if (!initialized) {
    throw new Error('Supabase client not initialized. Call initializeSupabase() first.');
  }
  return supabase;
}