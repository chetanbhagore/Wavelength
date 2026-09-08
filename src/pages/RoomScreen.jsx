import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, LogOut } from 'lucide-react';
import AmbientWaveformBackground from '../components/AmbientWaveformBackground';
import RoomHeader from '../components/RoomHeader';
import RoomAvatarStack from '../components/RoomAvatarStack';
import MessageStream from '../components/MessageStream';
import ResonanceMeter from '../components/ResonanceMeter';
import MessageComposer from '../components/MessageComposer';
import { useRoomSimulation } from '../hooks/useRoomSimulation';
import { useCountdown } from '../hooks/useCountdown';

/**
 * Room Screen — the core synchronous interaction:
 * - Ephemeral chat + progressive sunset countdown + simulated organic participants
 * - Typing indicators ("stranger_XX is typing...")
 * - Collective room-wide resonance flash wave & surge
 * - Serene arrival banner and poetic early leave confirmation
 */
export default function RoomScreen({ frequency, onRoomEnd, demoMode = true }) {
  const announcerRef = useRef(null);
  const [showArrivalBanner, setShowArrivalBanner] = useState(true);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const [resonanceFlash, setResonanceFlash] = useState(false);

  const {
    participants,
    messages,
    addUserMessage,
    addResonance,
    resonanceLevel,
    typingParticipant,
    surgeTrigger,
  } = useRoomSimulation(frequency.id, true);

  const {
    timeRemaining,
    isWarning,
    isUrgent,
    totalDuration,
  } = useCountdown(true, demoMode, onRoomEnd);

  // Trigger room-wide backdrop illumination wave when resonance surges
  useEffect(() => {
    if (surgeTrigger > 0) {
      const startTimer = setTimeout(() => setResonanceFlash(true), 0);
      const endTimer = setTimeout(() => setResonanceFlash(false), 700);
      return () => {
        clearTimeout(startTimer);
        clearTimeout(endTimer);
      };
    }
  }, [surgeTrigger]);


  // Gracefully auto-dismiss arrival banner after 3.2 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowArrivalBanner(false);
    }, 3200);
    return () => clearTimeout(timer);
  }, []);

  // Screen reader announcements at 60s and 10s only
  useEffect(() => {
    if (timeRemaining === 60 || timeRemaining === 10) {
      if (announcerRef.current) {
        announcerRef.current.textContent = `${timeRemaining} seconds remaining`;
      }
    }
  }, [timeRemaining]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100dvh - 60px)',
        background: 'radial-gradient(ellipse at 50% 10%, rgba(124, 92, 255, 0.05) 0%, var(--color-bg) 75%)',
        position: 'relative',
        zIndex: 1,
        overflow: 'hidden',
      }}
    >
      {/* Continuing ambient waveform backdrop with frequency mood physics */}
      <AmbientWaveformBackground colorAccent={frequency.colorAccent} mood={frequency.mood} opacity={0.32} />

      {/* Collective Room-Wide Resonance Flash Wave (Issues #2 & #18) */}
      <AnimatePresence>
        {resonanceFlash && (
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 0.4, scale: 1.3 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.68, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              background: `radial-gradient(ellipse at 50% 40%, ${frequency.colorAccent}77 0%, transparent 68%)`,
              zIndex: 3,
            }}
          />
        )}
      </AnimatePresence>

      {/* Screen reader announcer */}
      <div
        ref={announcerRef}
        role="status"
        aria-live="assertive"
        aria-atomic="true"
        style={{
          position: 'absolute',
          width: '1px',
          height: '1px',
          overflow: 'hidden',
          clip: 'rect(0 0 0 0)',
          whiteSpace: 'nowrap',
        }}
      />

      <RoomHeader
        frequency={frequency}
        timeRemaining={timeRemaining}
        totalDuration={totalDuration}
        isWarning={isWarning}
        isUrgent={isUrgent}
        onRequestLeave={() => setShowLeaveConfirm(true)}
      />

      {/* Room Arrival Confirmation Banner (Issue #24) */}
      <AnimatePresence>
        {showArrivalBanner && (
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            style={{
              margin: '8px 16px 0',
              padding: '8px 14px',
              borderRadius: 'var(--radius-pill)',
              background: 'rgba(255, 255, 255, 0.04)',
              border: `1px solid ${frequency.colorAccent}44`,
              boxShadow: `0 4px 20px rgba(0, 0, 0, 0.4), 0 0 12px ${frequency.colorAccent}22`,
              backdropFilter: 'blur(12px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              alignSelf: 'center',
              zIndex: 12,
            }}
          >
            <Users size={13} style={{ color: frequency.colorAccent }} />
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              color: 'var(--color-text-primary)',
              letterSpacing: '0.02em',
            }}>
              You're in sync. {participants.length} strangers are sharing this frequency with you.
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <RoomAvatarStack
        participants={participants}
        colorAccent={frequency.colorAccent}
        typingParticipant={typingParticipant}
      />

      <ResonanceMeter
        level={resonanceLevel}
        colorAccent={frequency.colorAccent}
        surgeTrigger={surgeTrigger}
      />

      <MessageStream
        messages={messages}
        onResonate={addResonance}
        colorAccent={frequency.colorAccent}
        typingParticipant={typingParticipant}
      />

      <MessageComposer
        onSend={addUserMessage}
        disabled={timeRemaining <= 0}
      />

      {/* Poetic Early Leave Confirmation Modal (Issue #25) */}
      <AnimatePresence>
        {showLeaveConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(5, 4, 10, 0.85)',
              backdropFilter: 'blur(12px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '24px',
              zIndex: 50,
            }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 16 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 16 }}
              transition={{ type: 'spring', stiffness: 320, damping: 24 }}
              style={{
                maxWidth: '380px',
                width: '100%',
                background: 'rgba(18, 14, 28, 0.96)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: 'var(--radius-lg)',
                padding: '24px',
                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8), 0 0 30px rgba(124, 92, 255, 0.1)',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                textAlign: 'center',
              }}
            >
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: 'rgba(255, 84, 112, 0.12)',
                border: '1px solid rgba(255, 84, 112, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto',
                color: '#FF5470',
              }}>
                <LogOut size={20} strokeWidth={1.8} />
              </div>

              <div>
                <h3 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '18px',
                  fontWeight: 600,
                  color: 'var(--color-text-primary)',
                  margin: '0 0 6px 0',
                }}>
                  Depart this frequency?
                </h3>
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '13px',
                  color: 'var(--color-text-secondary)',
                  lineHeight: 1.5,
                  margin: 0,
                }}>
                  The room will dissolve for you, but you can leave an echo behind on the wall before returning to the void.
                </p>
              </div>

              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                marginTop: '8px',
              }}>
                <button
                  onClick={() => {
                    setShowLeaveConfirm(false);
                    onRoomEnd?.();
                  }}
                  style={{
                    padding: '10px 16px',
                    borderRadius: 'var(--radius-pill)',
                    background: 'linear-gradient(135deg, var(--color-gradient-start), var(--color-gradient-end))',
                    border: 'none',
                    color: '#FFFFFF',
                    fontFamily: 'var(--font-body)',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    boxShadow: '0 4px 16px rgba(124, 92, 255, 0.3)',
                  }}
                >
                  Leave Echo & Depart
                </button>

                <button
                  onClick={() => setShowLeaveConfirm(false)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 'var(--radius-pill)',
                    background: 'transparent',
                    border: '1px solid var(--color-border)',
                    color: 'var(--color-text-secondary)',
                    fontFamily: 'var(--font-body)',
                    fontSize: '13px',
                    cursor: 'pointer',
                  }}
                >
                  Stay in Sync
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

