import { useMemo } from 'react';
import { motion } from 'framer-motion';
import frequencies from '../data/frequencies.json';

/**
 * Single echo line display — physical analog signal slip (Sprint 3 Issue #10):
 * - Material paper slip / receipt aesthetics with dashed divider & header stamp
 * - Deterministic organic card tilt (-0.6deg to +0.6deg)
 * - Atmospheric depth shadow and frequency-colored mood aura
 */
export default function EchoCard({ echo, index }) {
  const freq = useMemo(() => {
    return frequencies.find((f) => f.id === echo.frequencyId) || null;
  }, [echo.frequencyId]);

  // Deterministic tilt angle based on ID hash for organic wall feel
  const tiltAngle = useMemo(() => {
    let hash = 0;
    const str = echo.id || `${index}`;
    for (let i = 0; i < str.length; i++) {
      hash = (hash * 31 + str.charCodeAt(i)) % 1000;
    }
    return ((hash % 14) - 7) * 0.08; // -0.56deg to +0.56deg
  }, [echo.id, index]);

  const colorAccent = freq?.colorAccent || 'var(--color-gradient-start)';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0, rotate: tiltAngle }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.03, 0.4), ease: 'easeOut' }}
      whileHover={{
        scale: 1.015,
        rotate: 0,
        borderColor: `${colorAccent}88`,
        boxShadow: `0 10px 32px rgba(0, 0, 0, 0.65), 0 0 24px ${colorAccent}33`,
        transition: { duration: 0.2 },
      }}
      style={{
        padding: '16px 20px',
        borderRadius: 'var(--radius-md)',
        background: 'linear-gradient(180deg, rgba(24, 18, 36, 0.82) 0%, rgba(14, 11, 22, 0.88) 100%)',
        border: '1px solid rgba(255, 255, 255, 0.07)',
        borderLeft: `3px solid ${colorAccent}99`,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.45)',
        backdropFilter: 'blur(14px)',
        cursor: 'default',
        transformOrigin: 'center center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Top Physical Receipt Header Stamp (Sprint 3 Issue #10) */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '10px',
        paddingBottom: '6px',
        borderBottom: '1px dashed rgba(255, 255, 255, 0.08)',
        fontFamily: 'var(--font-mono)',
        fontSize: '9px',
        color: 'var(--color-text-secondary)',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        opacity: 0.65,
        userSelect: 'none',
      }}>
        <span>RF SIGNAL SLIP</span>
        <span>{freq?.mhz || 'ANALOG RESIDUAL'}</span>
      </div>

      <p style={{
        fontFamily: 'var(--font-body)',
        fontSize: '15px',
        color: 'var(--color-text-primary)',
        lineHeight: 1.5,
        fontStyle: 'italic',
        margin: 0,
      }}>
        "{echo.text}"
      </p>

      {freq && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          marginTop: '10px',
        }}>
          <span style={{
            width: '4px',
            height: '4px',
            borderRadius: '50%',
            backgroundColor: colorAccent,
            boxShadow: `0 0 6px ${colorAccent}`,
          }} />
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            color: colorAccent,
            opacity: 0.85,
            letterSpacing: '0.02em',
          }}>
            {freq.mhz} • {freq.label}
          </span>
        </div>
      )}
    </motion.div>
  );
}
