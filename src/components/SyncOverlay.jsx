import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

/**
 * Full-screen transitional state between Tuner and Room.
 * Radial scan pulse + staggered participant dots.
 * Auto-advances after 1.8–2.2s.
 */
export default function SyncOverlay({ frequency, onComplete }) {
  const [syncedCount, setSyncedCount] = useState(0);
  const [targetCount] = useState(() => Math.floor(Math.random() * 3) + 4); // 4-6

  useEffect(() => {
    // Stagger "found" dots
    const timers = [];
    for (let i = 0; i < targetCount; i++) {
      timers.push(
        setTimeout(() => {
          setSyncedCount(i + 1);
        }, 400 + i * 300)
      );
    }

    // Auto-advance after randomized delay
    const advanceTimer = setTimeout(() => {
      onComplete?.();
    }, 1800 + Math.random() * 400);

    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(advanceTimer);
    };
  }, [onComplete, targetCount]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '32px',
        background: 'var(--color-bg)',
      }}
    >
      {/* Scan pulse rings */}
      <div style={{ position: 'relative', width: '160px', height: '160px' }}>
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{
              scale: [0.8, 2.2],
              opacity: [0.6, 0],
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              ease: 'easeOut',
              delay: i * 0.4,
            }}
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '50%',
              border: `2px solid ${frequency.colorAccent}`,
            }}
          />
        ))}

        {/* Center dot */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            width: '16px',
            height: '16px',
            borderRadius: '50%',
            background: `linear-gradient(135deg, var(--color-gradient-start), ${frequency.colorAccent})`,
            boxShadow: `0 0 30px ${frequency.colorAccent}66`,
          }}
        />
      </div>

      {/* Status text */}
      <div style={{
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}>
        <motion.p
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '20px',
            fontWeight: 500,
            color: 'var(--color-text-primary)',
          }}
        >
          finding your frequency...
        </motion.p>

        {/* Participant dots */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
        }}>
          {Array.from({ length: targetCount }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, opacity: 0 }}
              animate={i < syncedCount ? {
                scale: 1,
                opacity: 1,
              } : {
                scale: 0.5,
                opacity: 0.2,
              }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: i < syncedCount ? frequency.colorAccent : 'var(--color-border)',
                boxShadow: i < syncedCount ? `0 0 8px ${frequency.colorAccent}` : 'none',
              }}
            />
          ))}
        </div>

        <p style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '13px',
          color: 'var(--color-text-secondary)',
        }}>
          {syncedCount} {syncedCount === 1 ? 'person' : 'people'} syncing
        </p>
      </div>
    </motion.div>
  );
}
