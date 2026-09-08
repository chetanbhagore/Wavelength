import { useState, useCallback, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import TopBar from './components/TopBar';
import SyncOverlay from './components/SyncOverlay';
import EchoModal from './components/EchoModal';
import TunerScreen from './pages/TunerScreen';
import RoomScreen from './pages/RoomScreen';
import EchoWallScreen from './pages/EchoWallScreen';
import { useLocalStorage } from './hooks/useLocalStorage';

/**
 * App shell — single-flow navigation.
 * States: tuner → syncing → room → echo → echoWall → tuner
 *
 * DEMO MODE is enabled by default (90s countdown instead of 12 min).
 */

export default function App() {
  // App state machine
  const [appState, setAppState] = useState('tuner');
  // 'tuner' | 'syncing' | 'room' | 'echoModal' | 'echoWall'

  const [demoMode, setDemoMode] = useState(true);
  const [demoToast, setDemoToast] = useState(null);
  const [selectedFrequency, setSelectedFrequency] = useState(null);
  const [lastVisitedFrequencyId, setLastVisitedFrequencyId] = useLocalStorage('wavelength_last_visited_id', null);
  const [frequencyHistory, setFrequencyHistory] = useLocalStorage('wavelength_frequency_history', {});
  const [, setMyEchoes] = useLocalStorage('myEchoHistory', []);

  const handleToggleDemoMode = useCallback(() => {
    setDemoMode((prev) => {
      const next = !prev;
      setDemoToast(next ? 'Demo Mode (90s sessions) Active' : 'Standard Mode (12m sessions) Active');
      return next;
    });
  }, []);

  // Global Shift+D shortcut listener for judge inspection (Issue #29)
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

  // Dismiss demo toast after 2.5s
  useEffect(() => {
    if (demoToast) {
      const timer = setTimeout(() => setDemoToast(null), 2500);
      return () => clearTimeout(timer);
    }
  }, [demoToast]);


  // ─── Direct Navigation ───
  const handleNavigateToEchoWall = useCallback(() => {
    setAppState('echoWall');
  }, []);

  // ─── Tuner → Sync ───
  const handleTuneIn = useCallback((frequency) => {
    setSelectedFrequency(frequency);
    setLastVisitedFrequencyId(frequency.id);
    setFrequencyHistory((prev) => ({
      ...prev,
      [frequency.id]: {
        count: (prev[frequency.id]?.count || 0) + 1,
        lastVisited: Date.now(),
      },
    }));
    setAppState('syncing');
  }, [setFrequencyHistory, setLastVisitedFrequencyId]);

  // ─── Sync → Room ───
  const handleSyncComplete = useCallback(() => {
    setAppState('room');
  }, []);

  // ─── Room → Echo Modal ───
  const handleRoomEnd = useCallback(() => {
    setAppState('echoModal');
  }, []);

  // ─── Echo → Echo Wall ───
  const handleEchoSubmit = useCallback((text) => {
    if (!selectedFrequency) return;
    const newEcho = {
      id: `user_echo_${Date.now()}`,
      frequencyId: selectedFrequency.id,
      text,
    };
    setMyEchoes((prev) => [...prev, newEcho]);
    setAppState('echoWall');
  }, [selectedFrequency, setMyEchoes]);

  const handleEchoSkip = useCallback(() => {
    setAppState('echoWall');
  }, []);

  // ─── Echo Wall → Tuner ───
  const handleBackToTuner = useCallback(() => {
    setSelectedFrequency(null);
    setAppState('tuner');
  }, []);

  return (
    <div style={{
      minHeight: '100dvh',
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--color-bg)',
    }}>
      <TopBar
        appState={appState}
        onNavigateToEchoWall={handleNavigateToEchoWall}
        onNavigateToTuner={handleBackToTuner}
        demoMode={demoMode}
        onToggleDemoMode={handleToggleDemoMode}
      />

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {appState === 'tuner' && (
          <TunerScreen
            onTuneIn={handleTuneIn}
            lastVisitedFrequencyId={lastVisitedFrequencyId}
            frequencyHistory={frequencyHistory}
          />
        )}

        {appState === 'room' && selectedFrequency && (
          <RoomScreen
            frequency={selectedFrequency}
            onRoomEnd={handleRoomEnd}
            demoMode={demoMode}
          />
        )}

        {appState === 'echoWall' && (
          <EchoWallScreen
            initialFrequencyId={selectedFrequency?.id}
            onBack={handleBackToTuner}
          />
        )}
      </main>


      {/* Overlays & Notifications */}
      <AnimatePresence>
        {demoToast && (
          <motion.div
            key="demoToast"
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.9 }}
            transition={{ duration: 0.25 }}
            style={{
              position: 'fixed',
              top: '72px',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 100,
              padding: '8px 18px',
              borderRadius: 'var(--radius-pill)',
              background: 'rgba(23, 27, 39, 0.95)',
              border: '1px solid var(--color-accent-live)',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.6), 0 0 16px rgba(255, 176, 32, 0.3)',
              backdropFilter: 'blur(16px)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              pointerEvents: 'none',
            }}
          >
            <span style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-accent-live)',
              boxShadow: '0 0 8px var(--color-accent-live)',
            }} />
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              fontWeight: 600,
              color: 'var(--color-text-primary)',
              letterSpacing: '0.02em',
            }}>
              {demoToast}
            </span>
          </motion.div>
        )}

        {appState === 'syncing' && selectedFrequency && (
          <SyncOverlay
            key="sync"
            frequency={selectedFrequency}
            onComplete={handleSyncComplete}
          />
        )}

        {appState === 'echoModal' && selectedFrequency && (
          <EchoModal
            key="echo"
            frequency={selectedFrequency}
            onSubmit={handleEchoSubmit}
            onSkip={handleEchoSkip}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

