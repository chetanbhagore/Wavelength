import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import RoomHeader from '../components/RoomHeader';
import RoomAvatarStack from '../components/RoomAvatarStack';
import MessageStream from '../components/MessageStream';
import ResonanceMeter from '../components/ResonanceMeter';
import MessageComposer from '../components/MessageComposer';
import { useRoomSimulation } from '../hooks/useRoomSimulation';
import { useCountdown } from '../hooks/useCountdown';

/**
 * Room Screen — the core synchronous interaction.
 * Ephemeral chat + countdown + simulated participants.
 */
export default function RoomScreen({ frequency, onRoomEnd, demoMode = true }) {
  const announcerRef = useRef(null);
  const {
    participants,
    messages,
    addUserMessage,
    addResonance,
    resonanceLevel,
  } = useRoomSimulation(frequency.id, true);

  const {
    timeRemaining,
    isWarning,
    isUrgent,
    totalDuration,
  } = useCountdown(true, demoMode, onRoomEnd);

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
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100dvh - 60px)',
        background: 'var(--color-bg)',
        position: 'relative',
        zIndex: 1,
      }}
    >
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
        onLeave={onRoomEnd}
      />

      <RoomAvatarStack
        participants={participants}
        colorAccent={frequency.colorAccent}
      />

      <ResonanceMeter
        level={resonanceLevel}
        colorAccent={frequency.colorAccent}
      />

      <MessageStream
        messages={messages}
        onResonate={addResonance}
        colorAccent={frequency.colorAccent}
      />

      <MessageComposer
        onSend={addUserMessage}
        disabled={timeRemaining <= 0}
      />
    </motion.div>
  );
}
