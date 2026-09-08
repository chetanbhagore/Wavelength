import { motion } from 'framer-motion';
import { useState, useCallback } from 'react';

/**
 * A single message bubble in the room.
 * Tapping triggers a resonance pulse (glow burst) with NO visible counter.
 */
export default function MessageBubble({ message, onResonate, colorAccent }) {
  const [showPulse, setShowPulse] = useState(false);

  const handleResonate = useCallback(() => {
    if (message.resonated || message.isUser) return;
    setShowPulse(true);
    onResonate?.(message.id);
    setTimeout(() => setShowPulse(false), 600);
  }, [message.id, message.resonated, message.isUser, onResonate]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
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
        transition: 'background-color 0.2s ease',
        backgroundColor: message.isUser ? 'var(--color-surface-2)' : 'transparent',
        marginLeft: message.isUser ? '40px' : '0',
        marginRight: message.isUser ? '0' : '40px',
      }}
      whileHover={message.isUser ? {} : {
        backgroundColor: 'rgba(255,255,255,0.03)',
      }}
    >
      {/* Resonance pulse effect */}
      {showPulse && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0.6 }}
          animate={{ scale: 1.5, opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          style={{
            position: 'absolute',
            inset: -4,
            borderRadius: 'var(--radius-md)',
            border: `2px solid ${colorAccent}`,
            boxShadow: `0 0 20px ${colorAccent}44`,
            pointerEvents: 'none',
          }}
        />
      )}

      <div style={{
        display: 'flex',
        gap: '8px',
        alignItems: 'baseline',
      }}>
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '12px',
          fontWeight: 500,
          color: message.isUser ? 'var(--color-gradient-start)' : colorAccent,
          flexShrink: 0,
          opacity: 0.8,
        }}>
          {message.sender}:
        </span>
        <span style={{
          fontFamily: 'var(--font-body)',
          fontSize: '15px',
          color: 'var(--color-text-primary)',
          lineHeight: 1.4,
        }}>
          {message.text}
        </span>
      </div>

      {/* Subtle resonated indicator — NO counter */}
      {message.resonated && !message.isUser && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            position: 'absolute',
            right: '8px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '4px',
            height: '4px',
            borderRadius: '50%',
            backgroundColor: colorAccent,
            boxShadow: `0 0 6px ${colorAccent}`,
          }}
        />
      )}
    </motion.div>
  );
}
