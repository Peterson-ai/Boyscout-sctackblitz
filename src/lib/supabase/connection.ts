import { supabase } from './client';
import { NetworkError } from './errors';
import { withRetry } from './retry';

interface ConnectionState {
  isConnected: boolean;
  lastChecked: Date | null;
  error: Error | null;
  retryCount: number;
  isChecking: boolean;
}

let state: ConnectionState = {
  isConnected: false,
  lastChecked: null,
  error: null,
  retryCount: 0,
  isChecking: false
};

const MAX_RETRIES = 3;
const INITIAL_DELAY = 1000;
const MAX_DELAY = 5000;
const CHECK_INTERVAL = 30000; // 30 seconds

export async function checkConnection(): Promise<boolean> {
  if (state.isChecking) {
    return state.isConnected;
  }

  state.isChecking = true;

  try {
    const result = await withRetry(
      async () => {
        const { data, error } = await supabase
          .from('profiles')
          .select('count')
          .limit(1)
          .single();

        if (error) {
          if (error.code === 'PGRST116') {
            return true;
          }
          throw error;
        }

        return true;
      },
      {
        maxAttempts: MAX_RETRIES,
        delayMs: calculateDelay(),
        backoffFactor: 1.5,
        shouldRetry: (error) => {
          const shouldRetry = isRetryableError(error) && state.retryCount < MAX_RETRIES;
          if (shouldRetry) {
            state.retryCount++;
          }
          return shouldRetry;
        }
      }
    );

    updateState({
      isConnected: result,
      lastChecked: new Date(),
      error: null,
      retryCount: 0
    });

    return result;
  } catch (error) {
    console.error('Connection check failed:', error);
    
    updateState({
      isConnected: false,
      lastChecked: new Date(),
      error: error instanceof Error ? error : new Error('Unknown error')
    });
    
    return false;
  } finally {
    state.isChecking = false;
  }
}

function calculateDelay(): number {
  return Math.min(INITIAL_DELAY * Math.pow(1.5, state.retryCount), MAX_DELAY);
}

function isRetryableError(error: unknown): boolean {
  if (error instanceof NetworkError) return true;
  
  if (error instanceof Error) {
    return error.message.includes('Failed to fetch') || 
           error.message.includes('Network request failed') ||
           error.message.includes('429') || 
           error.message.includes('500') || 
           error.message.includes('503');
  }
  
  return false;
}

function updateState(updates: Partial<ConnectionState>) {
  state = { ...state, ...updates };
}

export function getConnectionState(): ConnectionState {
  return { ...state };
}

export function resetConnectionState(): void {
  state = {
    isConnected: false,
    lastChecked: null,
    error: null,
    retryCount: 0,
    isChecking: false
  };
}

let connectionCheckInterval: NodeJS.Timeout | null = null;

export function startConnectionMonitoring() {
  if (connectionCheckInterval) {
    clearInterval(connectionCheckInterval);
  }

  // Initial check
  checkConnection();

  // Set up periodic checks
  connectionCheckInterval = setInterval(() => {
    checkConnection();
  }, CHECK_INTERVAL);

  // Clean up on window unload
  window.addEventListener('unload', () => {
    if (connectionCheckInterval) {
      clearInterval(connectionCheckInterval);
    }
  });
}

export function stopConnectionMonitoring() {
  if (connectionCheckInterval) {
    clearInterval(connectionCheckInterval);
    connectionCheckInterval = null;
  }
}