import { lazy, Suspense } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AppStateProvider } from './context/AppStateContext';
import { useAppState } from './hooks/useAppState';
import { APP_STATES } from './constants';
import ErrorBoundary from './components/ErrorBoundary';
import TopBar from './components/TopBar';
import SyncOverlay from './components/SyncOverlay';
import EchoModal from './components/EchoModal';
import SignalCursor from './components/SignalCursor';
import TunerScreen from './pages/TunerScreen';
import RoomScreen from './pages/RoomScreen';

// Code-splitting secondary historical screen for optimal initial bundle performance
const EchoWallScreen = lazy(() => import('./pages/EchoWallScreen'));

/**
 * Inner app shell consuming the state machine context.
 * Renders the current screen based on appState and manages overlays.
 * @returns {React.ReactElement}
 */
function AppContent() {
  const {
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
  } = useAppState();

  return (
    <div style={{
      minHeight: '100dvh',
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--color-bg)',
    }}>
      {/* Custom Signal-Probe Cursor for Desktop Pointer Devices */}
      <SignalCursor />

      <TopBar
        appState={appState}
        onNavigateToEchoWall={handleNavigateToEchoWall}
        onNavigateToTuner={handleBackToTuner}
        demoMode={demoMode}
        onToggleDemoMode={handleToggleDemoMode}
      />

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>
        {/* Spatial Page Transitions (Sprint 4 Issue #21) */}
        <AnimatePresence mode="wait">
          {appState === APP_STATES.TUNER && (
            <motion.div
              key="tuner"
              initial={{ opacity: 0, scale: 0.985 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.015, filter: 'blur(8px)' }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
            >
              <TunerScreen
                onTuneIn={handleTuneIn}
                lastVisitedFrequencyId={lastVisitedFrequencyId}
                frequencyHistory={frequencyHistory}
              />
            </motion.div>
          )}

          {appState === APP_STATES.ROOM && selectedFrequency && (
            <motion.div
              key={`room_${selectedFrequency.id}`}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96, filter: 'blur(10px)' }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
            >
              <RoomScreen
                frequency={selectedFrequency}
                onRoomEnd={handleRoomEnd}
                demoMode={demoMode}
              />
            </motion.div>
          )}

          {appState === APP_STATES.ECHO_WALL && (
            <motion.div
              key="echoWall"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12, filter: 'blur(8px)' }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
            >
              <Suspense fallback={
                <div style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: '45vh',
                }}>
                  <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '12px',
                    color: 'var(--color-text-secondary)',
                    letterSpacing: '0.08em',
                  }}>
                    TUNING ARCHIVE ECHOS...
                  </span>
                </div>
              }>
                <EchoWallScreen
                  initialFrequencyId={selectedFrequency?.id}
                  onBack={handleBackToTuner}
                />
              </Suspense>
            </motion.div>
          )}
        </AnimatePresence>
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

        {appState === APP_STATES.SYNCING && selectedFrequency && (
          <SyncOverlay
            key="sync"
            frequency={selectedFrequency}
            onComplete={handleSyncComplete}
          />
        )}

        {appState === APP_STATES.ECHO_MODAL && selectedFrequency && (
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

/**
 * App shell — single-flow navigation.
 * States: tuner → syncing → room → echo → echoWall → tuner
 *
 * DEMO MODE is enabled by default (90s countdown instead of 12 min).
 * @returns {React.ReactElement}
 */
export default function App() {
  return (
    <ErrorBoundary>
      <AppStateProvider>
        <AppContent />
      </AppStateProvider>
    </ErrorBoundary>
  );
}
