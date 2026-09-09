/**
 * @module hooks/useAppState
 * Custom hook to consume the global application state machine context.
 * Enforces usage within an AppStateProvider.
 */

import { useContext } from 'react';
import AppStateContext from '../context/AppStateContext';

/**
 * Hook to consume the application state machine context.
 * Must be used within an AppStateProvider.
 *
 * @returns {Object} Application state and transition callbacks.
 * @throws {Error} If used outside of AppStateProvider.
 */
export function useAppState() {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
}

export default useAppState;
