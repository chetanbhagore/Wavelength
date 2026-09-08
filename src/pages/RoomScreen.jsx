import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users } from 'lucide-react';
import AmbientWaveformBackground from '../components/AmbientWaveformBackground';
import RoomHeader from '../components/RoomHeader';
import RoomAvatarStack from '../components/RoomAvatarStack';
import MessageStream from '../components/MessageStream';
import ResonanceMeter from '../components/ResonanceMeter';
import MessageComposer from '../components/MessageComposer';
import DepartureModal from '../components/DepartureModal';
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
  const [showPhilosophyToast, setShowPhilosophyToast] = useState(false);
  const hasSeenPhilosophyRef = useRef(false);

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

  // Dissolution progress (0 at 30s, 1 at 0s)
  const dissolutionProgress = timeRemaining <= 30 ? (30 - Math.max(0, timeRemaining)) / 30 : 0;

  // Intercept user resonance to show immersion philosophy moment on first use (Sprint 3 Issue #2)
  const handleResonate = (messageId) => {
    addResonance(messageId);
    if (!hasSeenPhilosophyRef.current) {
      hasSeenPhilosophyRef.current = true;
      setShowPhilosophyToast(true);
      setTimeout(() => setShowPhilosophyToast(false), 3600);
    }
  };

  // Trigger room-wide backdrop illumination wave when resonance surges (Sprint 3 Issue #16)
  useEffect(() => {
    if (surgeTrigger > 0) {
      const startTimer = setTimeout(() => setResonanceFlash(true), 0);
      const endTimer = setTimeout(() => setResonanceFlash(false), 1100);
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
        filter: dissolutionProgress > 0
          ? `grayscale(${dissolutionProgress * 0.7}) brightness(${1 - dissolutionProgress * 0.15})`
          : 'none',
        transition: 'filter 0.8s ease',
      }}
    >
      {/* Continuing ambient waveform backdrop with frequency mood physics */}
      <AmbientWaveformBackground colorAccent={frequency.colorAccent} mood={frequency.mood} opacity={0.32} />

      {/* Analog CRT Scanlines & Signal Degradation in Final 30s (Sprint 3 Issue #20) */}
      {dissolutionProgress > 0 && (
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.18) 0px, rgba(0,0,0,0.18) 1px, transparent 1px, transparent 3px)',
            opacity: dissolutionProgress * 0.45,
            zIndex: 4,
          }}
        />
      )}

      {/* Collective Room-Wide Resonance Flash Shockwave (Sprint 3 Issue #16) */}
      <AnimatePresence>
        {resonanceFlash && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: [0, 0.55, 0], scale: 1.8 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.1, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              background: `radial-gradient(circle at 50% 50%, ${frequency.colorAccent}77 0%, ${frequency.colorAccent}22 45%, transparent 70%)`,
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
        onResonate={handleResonate}
        colorAccent={frequency.colorAccent}
        typingParticipant={typingParticipant}
      />

      {/* Non-intrusive Anti-Metric Philosophy Toast on first resonance (Sprint 3 Issue #2) */}
      <AnimatePresence>
        {showPhilosophyToast && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            style={{
              position: 'absolute',
              bottom: '76px',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 25,
              padding: '8px 18px',
              borderRadius: 'var(--radius-pill)',
              background: 'rgba(23, 27, 39, 0.95)',
              border: `1px solid ${frequency.colorAccent}77`,
              boxShadow: `0 8px 30px rgba(0,0,0,0.6), 0 0 20px ${frequency.colorAccent}33`,
              backdropFilter: 'blur(16px)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              pointerEvents: 'none',
              maxWidth: '90vw',
              textAlign: 'center',
            }}
          >
            <span style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: frequency.colorAccent,
              boxShadow: `0 0 8px ${frequency.colorAccent}`,
            }} />
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              color: '#FFFFFF',
              letterSpacing: '0.02em',
            }}>
              Resonance: shared vibration without counters or likes.
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <MessageComposer
        onSend={addUserMessage}
        disabled={timeRemaining <= 0}
      />

      {/* Poetic Early Departure Confirmation Modal (Sprint 4 Issue #29) */}
      <AnimatePresence>
        {showLeaveConfirm && (
          <DepartureModal
            frequency={frequency}
            timeRemaining={timeRemaining}
            onStay={() => setShowLeaveConfirm(false)}
            onLeaveAndEcho={() => {
              setShowLeaveConfirm(false);
              onRoomEnd?.();
            }}
            onDirectLeave={() => {
              setShowLeaveConfirm(false);
              onRoomEnd?.(true);
            }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

