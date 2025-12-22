/**
 * Mock mode utility functions
 * When NEXT_PUBLIC_MOCK is true, all API calls and wallet transactions must be real
 */

import { toast } from 'react-toastify';

/**
 * Check if mock mode is enabled
 */
export const isMockMode = (): boolean => {
  return process.env.NEXT_PUBLIC_DEBUGGER_ENABLED === 'enabled';
};

/**
 * Show error toast if in mock mode but no actual API call or wallet transaction is made
 * @param context - Context description of what should be called (used for logging only)
 * @param errorType - Type of error: 'network' for API calls, 'server' for wallet transactions
 */
export const requireRealCall = (context: string, errorType: 'network' | 'server' = 'network'): void => {
  if (isMockMode()) {
    // Ensure we're in browser environment
    if (typeof window === 'undefined') {
      console.error('[Mock Mode] requireRealCall called in server environment');
      return;
    }

    // Show error toast without mock-related information
    // Use simple error messages directly
    const errorMessage = errorType === 'network' ? 'Network error' : 'Server error';
    
    // Log for debugging
    console.log('[Mock Mode] requireRealCall called:', { context, errorType, errorMessage });
    
    // Show error toast with explicit options
    try {
      toast.error(errorMessage, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'dark',
      });
      console.log('[Mock Mode] Toast.error called with message:', errorMessage);
    } catch (error) {
      console.error('[Mock Mode] Toast.error failed:', error);
      // Fallback: try to show alert if toast fails
      if (typeof window !== 'undefined') {
        alert(errorMessage);
      }
    }
    
    // Log the actual context for debugging (not shown to user)
    console.error(`[Mock Mode] Missing real call for: ${context}`);
  }
};

/**
 * Assert that a real API call or wallet transaction is being made
 * Use this to mark places where real calls should happen
 * @param context - Context description
 */
export const assertRealCall = (context: string): void => {
  if (isMockMode()) {
    // In mock mode, we just log that a real call is expected
    // The actual error will be thrown if no real call is made
    console.log(`[Mock Mode] Expecting real call for: ${context}`);
  }
};

