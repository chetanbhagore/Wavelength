import { motion } from 'framer-motion';
import { useState, useCallback } from 'react';

/**
 * A single message bubble in the room.
 * Tapping triggers a chromatic resonance pulse with NO visible counters or viral metrics.
 */
export default function MessageBubble({ message, onResonate, colorAccent }) {
  const [showPulse, setShowPulse] = useState(false);

  const handleResonate = useCallback(() => {
    if (message.resonated || message.isUser) return;
    setShowPulse(true);
    onResonate?.(message.id);
    setTimeout(() => setShowPulse(false), 700);
  }, [message.id, message.resonated, message.isUser, onResonate]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{
        opacity: 1,
        y: [0, -2, 0],
        scale: 1,
      }}
      transition={{
        y: {
          repeat: Infinity,
          duration: 4.5 + ((message.id?.charCodeAt(0) || 0) % 3),
          ease: 'easeInOut',
        },
        opacity: { duration: 0.28, ease: 'easeOut' },
        scale: { duration: 0.28, ease: 'easeOut' },
      }}
      whileTap={message.isUser ? {} : { scale: 0.985 }}
      onClick={handleResonate}
      role={message.isUser ? undefined : 'button'}
      tabIndex={message.isUser ? undefined : 0}
      aria-label={message.isUser ? undefined : `Resonate with message from ${message.sender}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleResonate();
        }
      }}
      style={{
        padding: '8px 12px',
        borderRadius: 'var(--radius-md)',
        cursor: message.isUser ? 'default' : 'pointer',
        position: 'relative',
        transition: 'background-color 0.2s ease, border-color 0.2s ease',
        backgroundColor: message.isUser ? 'var(--color-surface-2)' : 'transparent',
        border: message.isUser ? '1px solid rgba(255, 255, 255, 0.04)' : '1px solid transparent',
        marginLeft: message.isUser ? '40px' : '0',
        marginRight: message.isUser ? '0' : '40px',
      }}
      whileHover={message.isUser ? {} : {
        backgroundColor: 'rgba(255, 255, 255, 0.035)',
        borderColor: 'rgba(255, 255, 255, 0.05)',
      }}
    >
      {/* Chromatic resonance pulse explosion */}
      {showPulse && (
        <>
          <motion.div
            initial={{ scale: 0.9, opacity: 0.8 }}
            animate={{ scale: 1.6, opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              inset: -6,
              borderRadius: 'var(--radius-md)',
              border: `2px solid ${colorAccent}`,
              boxShadow: `0 0 24px ${colorAccent}66, inset 0 0 12px ${colorAccent}44`,
              pointerEvents: 'none',
              zIndex: 10,
            }}
          />
          <motion.div
            initial={{ scale: 0.6, opacity: 0.5 }}
            animate={{ scale: 2.1, opacity: 0 }}
            transition={{ duration: 0.75, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              inset: -12,
              borderRadius: 'var(--radius-md)',
              background: `radial-gradient(circle, ${colorAccent}33 0%, transparent 70%)`,
              pointerEvents: 'none',
              zIndex: 9,
            }}
          />
        </>
      )}

      <div style={{
        display: 'flex',
        gap: '8px',
        alignItems: 'baseline',
      }}>
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '12px',
          fontWeight: 600,
          color: message.isUser ? 'var(--color-gradient-start)' : (message.avatarColor || colorAccent),
          flexShrink: 0,
          opacity: 0.9,
          letterSpacing: '-0.01em',
        }}>
          {message.sender}:
        </span>
        <span style={{
          fontFamily: 'var(--font-body)',
          fontSize: '15px',
          color: 'var(--color-text-primary)',
          lineHeight: 1.45,
          textShadow: message.resonated ? `0 0 16px ${colorAccent}33` : 'none',
          transition: 'text-shadow 0.4s ease',
        }}>
          {message.text}
        </span>
      </div>

      {/* Subtle resonated aura indicator — NO counter */}
      {message.resonated && !message.isUser && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          style={{
            position: 'absolute',
            right: '8px',
            top: '50%',
            transform: 'translateY(-50%)',
            display: 'flex',
            alignItems: 'center',
            gap: '3px',
          }}
          title="Resonating with room"
        >
          <span style={{
            width: '5px',
            height: '5px',
            borderRadius: '50%',
            backgroundColor: colorAccent,
            boxShadow: `0 0 8px ${colorAccent}`,
            display: 'inline-block',
          }} />
        </motion.div>
      )}
    </motion.div>
  );
}

