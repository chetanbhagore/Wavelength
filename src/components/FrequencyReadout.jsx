import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

/**
 * Displays the current frequency label, description, and live count.
 * Crossfades on frequency change. Live count ticks with simulated fluctuation.
 */
export default function FrequencyReadout({ frequency }) {
  const [displayCount, setDisplayCount] = useState(frequency.liveCount);
  const [prevFreqId, setPrevFreqId] = useState(frequency.id);

  if (frequency.id !== prevFreqId) {
    setPrevFreqId(frequency.id);
    setDisplayCount(frequency.liveCount);
  }

  // Simulate live count fluctuation
  useEffect(() => {
    const interval = setInterval(() => {
      setDisplayCount((prev) => {
        const delta = Math.floor(Math.random() * 7) - 3; // -3 to +3
        return Math.max(0, prev + delta);
      });
    }, 2500);

    return () => clearInterval(interval);
  }, [frequency.id]);

  return (
    <div style={{
      textAlign: 'center',
      minHeight: '120px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
    }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={frequency.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(20px, 5vw, 28px)',
            fontWeight: 600,
            lineHeight: 1.2,
            color: 'var(--color-text-primary)',
            maxWidth: '400px',
          }}>
            {frequency.label}
          </h2>

          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '14px',
            color: 'var(--color-text-secondary)',
            maxWidth: '320px',
            lineHeight: 1.4,
          }}>
            {frequency.description}
          </p>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            marginTop: '4px',
          }}>
            <motion.div
              animate={{
                scale: [1, 1.4, 1],
                opacity: [0.6, 1, 0.6],
              }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: frequency.colorAccent,
                boxShadow: `0 0 8px ${frequency.colorAccent}`,
              }}
            />
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '14px',
              fontWeight: 500,
              color: frequency.colorAccent,
            }}>
              {displayCount.toLocaleString()} tuned in
            </span>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
