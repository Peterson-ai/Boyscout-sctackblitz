export class SupabaseError extends Error {
  constructor(message: string, public originalError?: unknown) {
    super(message);
    this.name = 'SupabaseError';
  }
}

export class NetworkError extends SupabaseError {
  constructor(originalError?: unknown) {
    super('Network connection failed. Please check your internet connection and try again.', originalError);
    this.name = 'NetworkError';
  }
}

export class AuthenticationError extends SupabaseError {
  constructor(originalError?: unknown) {
    super('Authentication failed. Please check your credentials and try again.', originalError);
    this.name = 'AuthenticationError';
  }
}

export class ConnectionError extends SupabaseError {
  constructor(originalError?: unknown) {
    super('Failed to connect to the database. Please try again later.', originalError);
    this.name = 'ConnectionError';
  }
}

export function isNetworkError(error: unknown): boolean {
  if (error instanceof NetworkError) return true;
  
  if (error instanceof Error) {
    return error.message.includes('Failed to fetch') || 
           error.message.includes('Network request failed') ||
           error.message.includes('net::ERR_INTERNET_DISCONNECTED') ||
           error.message.includes('net::ERR_CONNECTION_REFUSED');
  }
  
  return false;
}

export function isAuthError(error: unknown): boolean {
  if (error instanceof AuthenticationError) return true;
  
  if (error instanceof Error) {
    return error.message.includes('Invalid JWT') || 
           error.message.includes('JWT expired') ||
           error.message.includes('Invalid login credentials');
  }
  
  return false;
}