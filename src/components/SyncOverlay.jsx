import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Radio, Sparkles } from 'lucide-react';
import { ambientDrone } from '../utils/ambientAudio';

/**
 * Full-screen transitional state between Tuner and Room.
 * Analog radio frequency needle sweep + vibe phase lock + staggered participant dots.
 * Auto-advances after 2.4s.
 */
export default function SyncOverlay({ frequency, onComplete }) {
  const [syncedCount, setSyncedCount] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [targetCount] = useState(() => Math.floor(Math.random() * 3) + 4); // 4-6
  const mhz = frequency.mhz ? frequency.mhz.replace(' MHz', '') : '94.8';

  useEffect(() => {
    // Phase 1: Precision needle sweep & lock at 950ms + 528Hz Lock Chime
    const lockTimer = setTimeout(() => {
      setIsLocked(true);
      ambientDrone.playLockChime(528);
    }, 950);

    // Phase 2: Stagger organic stranger dots across 700ms - 1700ms with micro-clicks
    const timers = [];
    for (let i = 0; i < targetCount; i++) {
      timers.push(
        setTimeout(() => {
          setSyncedCount(i + 1);
          ambientDrone.playDetentClick();
        }, 700 + i * 220)
      );
    }

    // Phase 3: Auto-advance cleanly at 2.2s
    const advanceTimer = setTimeout(() => {
      onComplete?.();
    }, 2200);

    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(lockTimer);
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
        gap: '36px',
        padding: '24px',
        background: 'radial-gradient(ellipse at center, rgba(16, 19, 28, 0.96) 0%, rgba(5, 6, 10, 0.98) 100%)',
        backdropFilter: 'blur(20px)',
      }}
    >
      {/* Analog Radio Tuner Glass Window */}
      <div style={{
        width: 'min(420px, 90vw)',
        padding: '20px 24px',
        borderRadius: 'var(--radius-lg)',
        background: 'linear-gradient(180deg, rgba(23, 27, 39, 0.8) 0%, rgba(10, 12, 18, 0.95) 100%)',
        border: `1px solid ${isLocked ? frequency.colorAccent : 'var(--color-border)'}`,
        boxShadow: isLocked
          ? `0 0 50px ${frequency.colorAccent}33, inset 0 0 30px ${frequency.colorAccent}15`
          : '0 0 30px rgba(0,0,0,0.5)',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.4s ease',
      }}>
        {/* Top Radio Dial Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          color: 'var(--color-text-secondary)',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Radio size={13} style={{ color: frequency.colorAccent }} />
            Analog Waveform Receiver
          </span>
          <span style={{
            color: isLocked ? frequency.colorAccent : 'var(--color-accent-live)',
            fontWeight: 600,
          }}>
            {isLocked ? 'SIGNAL LOCKED' : 'SEARCHING SPECTRUM...'}
          </span>
        </div>

        {/* Radio Spectrum Scale & Sweeping Needle */}
        <div style={{
          position: 'relative',
          height: '60px',
          background: 'rgba(5, 6, 10, 0.75)',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
        }}>
          {/* Background Spectrum Ticks */}
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0 12px',
            opacity: 0.35,
          }}>
            {Array.from({ length: 28 }).map((_, i) => (
              <div
                key={i}
                style={{
                  width: i % 4 === 0 ? '2px' : '1px',
                  height: i % 4 === 0 ? '24px' : '12px',
                  background: 'var(--color-text-secondary)',
                }}
              />
            ))}
          </div>

          {/* Sweeping Frequency Needle */}
          <motion.div
            initial={{ left: '5%' }}
            animate={isLocked
              ? { left: '50%' }
              : { left: ['5%', '85%', '30%', '50%'] }
            }
            transition={isLocked
              ? { type: 'spring', stiffness: 350, damping: 20 }
              : { duration: 1.1, ease: 'easeInOut' }
            }
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              width: '3px',
              background: isLocked ? frequency.colorAccent : '#FF5470',
              boxShadow: `0 0 16px ${isLocked ? frequency.colorAccent : '#FF5470'}, 0 0 4px #fff`,
              zIndex: 5,
              transform: 'translateX(-50%)',
            }}
          >
            {/* Needle indicator diamond */}
            <div style={{
              position: 'absolute',
              top: '2px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '8px',
              height: '8px',
              borderRadius: '2px',
              background: '#fff',
              boxShadow: `0 0 8px ${frequency.colorAccent}`,
            }} />
          </motion.div>

          {/* Locked frequency badge in center */}
          <div style={{
            position: 'absolute',
            bottom: '6px',
            left: '50%',
            transform: 'translateX(-50%)',
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            letterSpacing: '0.08em',
            color: isLocked ? frequency.colorAccent : 'var(--color-text-secondary)',
            fontWeight: 600,
          }}>
            {mhz} MHz
          </div>
        </div>

        {/* Target Frequency Title & Vibe Phase Match */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: '14px',
            fontWeight: 600,
            color: 'var(--color-text-primary)',
          }}>
            {frequency.label}
          </span>
          {isLocked && (
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                color: 'var(--color-accent-resonance)',
                background: 'rgba(51, 230, 201, 0.1)',
                padding: '2px 8px',
                borderRadius: 'var(--radius-pill)',
                border: '1px solid rgba(51, 230, 201, 0.25)',
              }}
            >
              <Sparkles size={11} />
              99.2% Phase Match
            </motion.span>
          )}
        </div>
      </div>

      {/* Syncing Participants Presence */}
      <div style={{
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '14px',
      }}>
        <motion.p
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 1.8, repeat: Infinity }}
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '18px',
            fontWeight: 500,
            color: 'var(--color-text-primary)',
          }}
        >
          {isLocked ? 'synchronizing with room strangers...' : 'tuning into the frequency...'}
        </motion.p>

        {/* Participant connection dots */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
        }}>
          {Array.from({ length: targetCount }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, opacity: 0 }}
              animate={i < syncedCount ? {
                scale: [1, 1.25, 1],
                opacity: 1,
              } : {
                scale: 0.5,
                opacity: 0.2,
              }}
              transition={{
                scale: { duration: 0.4 },
                default: { type: 'spring', stiffness: 400, damping: 15 },
              }}
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: i < syncedCount ? frequency.colorAccent : 'var(--color-border)',
                boxShadow: i < syncedCount ? `0 0 12px ${frequency.colorAccent}` : 'none',
              }}
            />
          ))}
        </div>

        <p style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '13px',
          color: 'var(--color-text-secondary)',
        }}>
          {syncedCount} {syncedCount === 1 ? 'stranger' : 'strangers'} in phase
        </p>
      </div>
    </motion.div>
  );
}
