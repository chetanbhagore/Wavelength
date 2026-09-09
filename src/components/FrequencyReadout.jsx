import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { FrequencyShape, VisitInfoShape } from '../types/propTypes';

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
          {/* Radio Broadcast Coordinates & Signal dBm Meter (Sprint 1 Issues #3, #7, #11) */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            padding: '3px 12px',
            borderRadius: 'var(--radius-pill)',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            color: 'var(--color-text-secondary)',
            letterSpacing: '0.04em',
          }}>
            <span style={{ color: frequency.colorAccent, fontWeight: 700 }}>
              {frequency.mhz || '88.5 MHz'}
            </span>
            <span style={{ opacity: 0.3 }}>|</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1.5px', height: '9px' }}>
                {[3, 5, 7, 9].map((h, i) => (
                  <span
                    key={i}
                    style={{
                      width: '2px',
                      height: `${h}px`,
                      backgroundColor: frequency.colorAccent,
                      borderRadius: '1px',
                      opacity: i <= 2 ? 1 : 0.45,
                    }}
                  />
                ))}
              </div>
              <span style={{ opacity: 0.85 }}>{frequency.signalDbm || -68} dBm</span>
            </div>
          </div>

          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(22px, 5.5vw, 30px)',
            fontWeight: 650,
            lineHeight: 1.2,
            color: '#FFFFFF',
            maxWidth: '420px',
            letterSpacing: '-0.01em',
            textShadow: '0 2px 16px rgba(0,0,0,0.5)',
          }}>
            {frequency.label}
          </h2>

          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '14.5px',
            color: 'var(--color-text-secondary)',
            maxWidth: '340px',
            lineHeight: 1.45,
            opacity: 0.85,
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
              padding: '6px 18px',
              borderRadius: 'var(--radius-pill)',
              background: 'rgba(23, 27, 39, 0.75)',
              border: `1px solid ${frequency.colorAccent}33`,
              backdropFilter: 'blur(10px)',
              boxShadow: `0 0 24px ${frequency.colorAccent}20`,
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
                <span style={{ color: frequency.colorAccent, fontWeight: 700 }}>{displayCount.toLocaleString()}</span> tuned in
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

FrequencyReadout.propTypes = {
  /** Current broadcast frequency */
  frequency: FrequencyShape.isRequired,
  /** Visit history for this frequency */
  visitInfo: VisitInfoShape,
};

