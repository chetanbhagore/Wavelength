import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MessageBubble from './MessageBubble';

/**
 * Scrolling message list for the Room.
 * Uses aria-live for accessibility. Auto-scrolls to latest message or typing indicator.
 */
export default function MessageStream({ messages, onResonate, colorAccent, typingParticipant }) {
  const bottomRef = useRef(null);
  const containerRef = useRef(null);

  // Auto-scroll to bottom on new messages or when someone starts typing
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length, typingParticipant]);

  return (
    <div
      ref={containerRef}
      role="log"
      aria-live="polite"
      aria-label="Room messages"
      style={{
        flex: 1,
        overflowY: 'auto',
        padding: '12px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        minHeight: 0,
      }}
    >
      {messages.length === 0 && !typingParticipant && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          color: 'var(--color-text-secondary)',
          fontFamily: 'var(--font-body)',
          fontSize: '14px',
          fontStyle: 'italic',
          opacity: 0.6,
        }}>
          waiting for the first words...
        </div>
      )}

      {messages.map((msg) => (
        msg.isSystem ? (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 0.65, y: 0 }}
            style={{
              textAlign: 'center',
              padding: '6px 0',
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              color: 'var(--color-text-secondary)',
              letterSpacing: '0.04em',
              fontStyle: 'italic',
            }}
          >
            • {msg.text} •
          </motion.div>
        ) : (
          <MessageBubble
            key={msg.id}
            message={msg}
            onResonate={onResonate}
            colorAccent={colorAccent}
          />
        )
      ))}

      {/* Dynamic typing indicator */}
      <AnimatePresence>
        {typingParticipant && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            style={{
              padding: '6px 12px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              alignSelf: 'flex-start',
              marginRight: '40px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.04)',
            }}
          >
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              color: typingParticipant.avatarColor || colorAccent,
              opacity: 0.85,
            }}>
              {typingParticipant.displayName} is typing
            </span>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  animate={{
                    opacity: [0.25, 1, 0.25],
                    y: [0, -2.5, 0],
                  }}
                  transition={{
                    duration: 0.85,
                    repeat: Infinity,
                    delay: i * 0.16,
                    ease: 'easeInOut',
                  }}
                  style={{
                    width: '3.5px',
                    height: '3.5px',
                    borderRadius: '50%',
                    backgroundColor: typingParticipant.avatarColor || colorAccent,
                    display: 'inline-block',
                    boxShadow: `0 0 6px ${typingParticipant.avatarColor || colorAccent}66`,
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div ref={bottomRef} />
    </div>
  );
}

