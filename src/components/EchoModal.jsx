import { motion, AnimatePresence } from 'framer-motion';
import { useState, useCallback } from 'react';
import { Sparkles } from 'lucide-react';

/**
 * Echo Modal — ritual closure at end of room:
 * - Single-line poetic input, ~80 chars.
 * - 3D physical "drop into the ether" animation with perspective tilt,
 *   scale compression, and trailing dissolution particles (Issue #19).
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
    }, 850);
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
        background: 'rgba(5, 6, 12, 0.92)',
        backdropFilter: 'blur(24px)',
        perspective: '1000px',
      }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        style={{
          width: '100%',
          maxWidth: '440px',
          background: 'rgba(18, 14, 28, 0.96)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(124, 92, 255, 0.12)',
          padding: '32px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 12px',
            borderRadius: 'var(--radius-pill)',
            background: `${frequency.colorAccent}15`,
            border: `1px solid ${frequency.colorAccent}33`,
            color: frequency.colorAccent,
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            marginBottom: '10px',
          }}>
            <Sparkles size={12} />
            <span>frequency {frequency.mhz} MHz</span>
          </div>

          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '24px',
            fontWeight: 600,
            color: 'var(--color-text-primary)',
            margin: '0 0 8px 0',
          }}>
            leave an echo
          </h2>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '14px',
            color: 'var(--color-text-secondary)',
            lineHeight: 1.5,
            margin: 0,
          }}>
            one line for the next strangers who tune into this frequency
          </p>
        </div>

        <AnimatePresence mode="wait">
          {isDropping ? (
            <div style={{
              width: '100%',
              minHeight: '110px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            }}>
              {/* 3D Falling card into the ether */}
              <motion.div
                key="dropping"
                initial={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
                animate={{
                  opacity: 0,
                  y: 140,
                  rotateX: 45,
                  scale: 0.55,
                  filter: 'blur(6px)',
                }}
                transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
                style={{
                  width: '100%',
                  padding: '16px 20px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: `1px solid ${frequency.colorAccent}66`,
                  boxShadow: `0 12px 30px ${frequency.colorAccent}44`,
                  fontFamily: 'var(--font-body)',
                  fontSize: '15px',
                  color: 'var(--color-text-primary)',
                  fontStyle: 'italic',
                  textAlign: 'center',
                  transformOrigin: 'top center',
                }}
              >
                "{text}"
              </motion.div>

              {/* Trailing dissolution sparkles */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0.9, y: 0, x: (i - 2.5) * 24, scale: 1 }}
                  animate={{
                    opacity: 0,
                    y: -40 - (i * 8) % 30,
                    scale: 0.2,
                  }}
                  transition={{ duration: 0.7, delay: i * 0.08, ease: 'easeOut' }}
                  style={{
                    position: 'absolute',
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: frequency.colorAccent,
                    boxShadow: `0 0 10px ${frequency.colorAccent}`,
                    pointerEvents: 'none',
                  }}
                />
              ))}


              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.7 }}
                style={{
                  marginTop: '16px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12px',
                  color: frequency.colorAccent,
                  letterSpacing: '0.04em',
                }}
              >
                releasing into the ether...
              </motion.span>
            </div>
          ) : (
            <motion.div key="input" style={{ width: '100%' }}>
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="what resonated with you here?"
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
                  transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = frequency.colorAccent;
                  e.target.style.boxShadow = `0 0 24px ${frequency.colorAccent}33`;
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
                color: text.length > 65 ? '#FFB020' : 'var(--color-text-secondary)',
                opacity: text.length > 55 ? 0.9 : 0.45,
                transition: 'color 0.2s ease, opacity 0.2s ease',
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
                background: text.trim()
                  ? `linear-gradient(135deg, var(--color-gradient-start), ${frequency.colorAccent})`
                  : undefined,
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

