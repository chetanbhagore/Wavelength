import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

/**
 * Displays the current frequency label, description, and live count.
 * Crossfades on frequency change. Live count ticks with simulated fluctuation.
 */
export default function FrequencyReadout({ frequency, visitInfo }) {
  const [displayCount, setDisplayCount] = useState(frequency.liveCount);
  const [prevFreqId, setPrevFreqId] = useState(frequency.id);

  if (frequency.id !== prevFreqId) {
    setPrevFreqId(frequency.id);
    setDisplayCount(frequency.liveCount);
  }

  // Simulate realistic Brownian motion stochastic fluctuation with mean reversion (Issue #34)
  useEffect(() => {
    const baseCount = frequency.liveCount;
    let timer;

    const tick = () => {
      setDisplayCount((current) => {
        // Mean-reverting drift pull toward base count
        const drift = (baseCount - current) * 0.12;
        // Gaussian-like Brownian shock
        const shock = (Math.random() + Math.random() - 1) * 3.5;
        // Occasional organic micro-spike (8% chance)
        const spike = Math.random() < 0.08 ? (Math.random() < 0.5 ? -1 : 1) * Math.floor(Math.random() * 8 + 3) : 0;
        const next = Math.round(current + drift + shock + spike);
        return Math.max(8, next);
      });

      const nextDelay = 2000 + Math.random() * 1400;
      timer = setTimeout(tick, nextDelay);
    };

    const initialDelay = setTimeout(tick, 2200);

    return () => {
      clearTimeout(timer);
      clearTimeout(initialDelay);
    };
  }, [frequency.id, frequency.liveCount]);


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
            flexDirection: 'column',
            alignItems: 'center',
            gap: '6px',
            marginTop: '4px',
          }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '5px 16px',
              borderRadius: 'var(--radius-pill)',
              background: 'rgba(23, 27, 39, 0.65)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(8px)',
              boxShadow: `0 0 20px ${frequency.colorAccent}15`,
            }}>
              <motion.div
                animate={{
                  scale: [1, 1.4, 1],
                  opacity: [0.6, 1, 0.6],
                }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  backgroundColor: frequency.colorAccent,
                  boxShadow: `0 0 10px ${frequency.colorAccent}`,
                }}
              />
              <motion.span
                key={displayCount}
                initial={{ scale: 1.1, filter: 'brightness(1.5)' }}
                animate={{ scale: 1, filter: 'brightness(1)' }}
                transition={{ duration: 0.3 }}
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '15px',
                  fontWeight: 600,
                  letterSpacing: '0.02em',
                  color: 'var(--color-text-primary)',
                }}
              >
                <span style={{ color: frequency.colorAccent }}>{displayCount.toLocaleString()}</span> tuned in
              </motion.span>
            </div>

            {/* Anonymous return continuity memory (Issue #4) */}
            {visitInfo && visitInfo.count > 0 && (
              <motion.span
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 0.75, y: 0 }}
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  color: 'var(--color-text-secondary)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <span style={{
                  width: '4px',
                  height: '4px',
                  borderRadius: '50%',
                  background: 'var(--color-gradient-start)',
                }} />
                you tuned here earlier • frequency revisited
              </motion.span>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

