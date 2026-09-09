import { createContext, useState, useCallback, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import {
  APP_STATES,
  STORAGE_KEYS,
  DEMO_TOAST_DURATION_MS,
} from '../constants/index.js';
import { createEcho } from '../services/RoomService';

/**
 * @typedef {Object} AppStateContextValue
 * @property {string} appState - Current application state ('tuner' | 'syncing' | 'room' | 'echoModal' | 'echoWall')
 * @property {boolean} demoMode - Whether 90-second demo mode is active
 * @property {string|null} demoToast - Current demo toast message or null
 * @property {Object|null} selectedFrequency - Currently selected frequency object
 * @property {string|null} lastVisitedFrequencyId - ID of last visited frequency
 * @property {Object} frequencyHistory - Map of frequency visit history
 * @property {Function} handleTuneIn - Transition from tuner to syncing with a frequency
 * @property {Function} handleSyncComplete - Transition from syncing to room
 * @property {Function} handleRoomEnd - Transition from room to echo modal or tuner
 * @property {Function} handleEchoSubmit - Submit echo and transition to echo wall
 * @property {Function} handleEchoSkip - Skip echo and transition to echo wall
 * @property {Function} handleBackToTuner - Return to tuner from any state
 * @property {Function} handleNavigateToEchoWall - Navigate directly to echo wall
 * @property {Function} handleToggleDemoMode - Toggle between demo and standard modes
 */

const AppStateContext = createContext(null);

/**
 * Provides the global application state machine context.
 * Manages the 5-stage linear navigation flow:
 * tuner → syncing → room → echoModal → echoWall → tuner
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components
 * @returns {React.ReactElement}
 */
export function AppStateProvider({ children }) {
  const [appState, setAppState] = useState(APP_STATES.TUNER);
  const [demoMode, setDemoMode] = useState(true);
  const [demoToast, setDemoToast] = useState(null);
  const [selectedFrequency, setSelectedFrequency] = useState(null);

  const [lastVisitedFrequencyId, setLastVisitedFrequencyId] = useLocalStorage(
    STORAGE_KEYS.LAST_VISITED_FREQUENCY,
    null
  );
  const [frequencyHistory, setFrequencyHistory] = useLocalStorage(
    STORAGE_KEYS.FREQUENCY_HISTORY,
    {}
  );
  const [, setMyEchoes] = useLocalStorage(STORAGE_KEYS.ECHO_HISTORY, []);

  // ─── Demo Mode Toggle ───
  const handleToggleDemoMode = useCallback(() => {
    setDemoMode((prev) => {
      const next = !prev;
      setDemoToast(
        next
          ? 'Demo Mode (90s sessions) Active'
          : 'Standard Mode (12m sessions) Active'
      );
      return next;
    });
  }, []);

  // Global Shift+D shortcut listener for judge inspection
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.shiftKey && (e.key === 'D' || e.key === 'd')) {
        const tag = document.activeElement?.tagName?.toLowerCase();
        if (tag !== 'input' && tag !== 'textarea') {
          e.preventDefault();
          handleToggleDemoMode();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleToggleDemoMode]);

  // Dismiss demo toast after configured duration
  useEffect(() => {
    if (demoToast) {
      const timer = setTimeout(() => setDemoToast(null), DEMO_TOAST_DURATION_MS);
      return () => clearTimeout(timer);
    }
  }, [demoToast]);

  // ─── State Transitions ───
  const handleNavigateToEchoWall = useCallback(() => {
    setAppState(APP_STATES.ECHO_WALL);
  }, []);

  const handleTuneIn = useCallback(
    (frequency) => {
      setSelectedFrequency(frequency);
      setLastVisitedFrequencyId(frequency.id);
      setFrequencyHistory((prev) => ({
        ...prev,
        [frequency.id]: {
          count: (prev[frequency.id]?.count || 0) + 1,
          lastVisited: Date.now(),
        },
      }));
      setAppState(APP_STATES.SYNCING);
    },
    [setFrequencyHistory, setLastVisitedFrequencyId]
  );

  const handleSyncComplete = useCallback(() => {
    setAppState(APP_STATES.ROOM);
  }, []);

  const handleRoomEnd = useCallback((skipEcho = false) => {
    if (skipEcho) {
      setSelectedFrequency(null);
      setAppState(APP_STATES.TUNER);
    } else {
      setAppState(APP_STATES.ECHO_MODAL);
    }
  }, []);

  const handleEchoSubmit = useCallback(
    (text) => {
      if (!selectedFrequency) return;
      const newEcho = createEcho(selectedFrequency.id, text);
      setMyEchoes((prev) => [...prev, newEcho]);
      setAppState(APP_STATES.ECHO_WALL);
    },
    [selectedFrequency, setMyEchoes]
  );

  const handleEchoSkip = useCallback(() => {
    setAppState(APP_STATES.ECHO_WALL);
  }, []);

  const handleBackToTuner = useCallback(() => {
    setSelectedFrequency(null);
    setAppState(APP_STATES.TUNER);
  }, []);

  const value = useMemo(
    () => ({
      appState,
      demoMode,
      demoToast,
      selectedFrequency,
      lastVisitedFrequencyId,
      frequencyHistory,
      handleTuneIn,
      handleSyncComplete,
      handleRoomEnd,
      handleEchoSubmit,
      handleEchoSkip,
      handleBackToTuner,
      handleNavigateToEchoWall,
      handleToggleDemoMode,
    }),
    [
      appState,
      demoMode,
      demoToast,
      selectedFrequency,
      lastVisitedFrequencyId,
      frequencyHistory,
      handleTuneIn,
      handleSyncComplete,
      handleRoomEnd,
      handleEchoSubmit,
      handleEchoSkip,
      handleBackToTuner,
      handleNavigateToEchoWall,
      handleToggleDemoMode,
    ]
  );

  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  );
}

AppStateProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { AppStateContext };
export default AppStateContext;

