import { motion, AnimatePresence } from 'framer-motion';
import { useState, useCallback } from 'react';

/**
 * Echo Modal — ritual closure at end of room.
 * Single-line input, ~80 chars, "drop echo" or "skip."
 * Falling+fade animation on submit.
 */
export default function EchoModal({ frequency, onSubmit, onSkip }) {
  const [text, setText] = useState('');
  const [isDropping, setIsDropping] = useState(false);

  const handleDrop = useCallback(() => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setIsDropping(true);
    setTimeout(() => {
      onSubmit(trimmed);
    }, 700);
  }, [text, onSubmit]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 60,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        background: 'rgba(5, 6, 10, 0.9)',
        backdropFilter: 'blur(20px)',
      }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        style={{
          width: '100%',
          maxWidth: '440px',
          background: 'var(--color-surface)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border)',
          padding: '32px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '24px',
            fontWeight: 600,
            color: 'var(--color-text-primary)',
            marginBottom: '8px',
          }}>
            leave an echo
          </h2>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '14px',
            color: 'var(--color-text-secondary)',
            lineHeight: 1.5,
          }}>
            one line for the next people who tune into this frequency
          </p>
        </div>

        <AnimatePresence mode="wait">
          {isDropping ? (
            <motion.div
              key="dropping"
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: 0, y: 60 }}
              transition={{ duration: 0.6, ease: 'easeIn' }}
              style={{
                width: '100%',
                padding: '14px 16px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--color-surface-2)',
                fontFamily: 'var(--font-body)',
                fontSize: '15px',
                color: 'var(--color-text-primary)',
                fontStyle: 'italic',
                textAlign: 'center',
              }}
            >
              "{text}"
            </motion.div>
          ) : (
            <motion.div key="input" style={{ width: '100%' }}>
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="your echo..."
                maxLength={80}
                autoFocus
                aria-label="Write your echo"
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)',
                  background: 'var(--color-surface-2)',
                  color: 'var(--color-text-primary)',
                  fontFamily: 'var(--font-body)',
                  fontSize: '15px',
                  outline: 'none',
                  textAlign: 'center',
                  transition: 'border-color 0.2s ease',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = frequency.colorAccent;
                  e.target.style.boxShadow = `0 0 20px ${frequency.colorAccent}22`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--color-border)';
                  e.target.style.boxShadow = 'none';
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && text.trim()) handleDrop();
                }}
              />
              <div style={{
                textAlign: 'right',
                marginTop: '6px',
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                color: 'var(--color-text-secondary)',
                opacity: 0.5,
              }}>
                {text.length}/80
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!isDropping && (
          <div style={{
            display: 'flex',
            gap: '12px',
            width: '100%',
          }}>
            <button
              className="btn-primary"
              onClick={handleDrop}
              disabled={!text.trim()}
              style={{
                flex: 1,
                opacity: text.trim() ? 1 : 0.4,
                cursor: text.trim() ? 'pointer' : 'default',
              }}
            >
              drop echo
            </button>
            <button
              className="btn-secondary"
              onClick={onSkip}
              style={{ flex: 1 }}
            >
              skip
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
