import { useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
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
  const [selectedFrequency, setSelectedFrequency] = useState(null);
  const [lastVisitedFrequencyId, setLastVisitedFrequencyId] = useLocalStorage('wavelength_last_visited_id', null);
  const [frequencyHistory, setFrequencyHistory] = useLocalStorage('wavelength_frequency_history', {});
  const [, setMyEchoes] = useLocalStorage('myEchoHistory', []);

  const handleToggleDemoMode = useCallback(() => {
    setDemoMode((prev) => !prev);
  }, []);

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


      {/* Overlays */}
      <AnimatePresence>
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
