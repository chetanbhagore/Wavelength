import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info } from 'lucide-react';

/**
 * Ambient aggregate resonance meter:
 * - Shows collective room "energy" — never individual likes or vanity metrics.
 * - Dynamic surge flare when resonance increases or peer resonance fires.
 * - Interactive philosophy popover explaining the anti-metric ethos.
 */
export default function ResonanceMeter({ level, colorAccent, surgeTrigger }) {
  const [showPhilosophy, setShowPhilosophy] = useState(false);

  return (
    <div style={{
      padding: '0 16px',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      gap: '6px',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 2px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            color: 'var(--color-text-secondary)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            opacity: 0.7,
          }}>
            Room Resonance
          </span>

          {/* Philosophy popover trigger */}
          <button
            onClick={() => setShowPhilosophy((p) => !p)}
            aria-label="Why no likes? Anti-metric philosophy"
            title="Why no likes? Read philosophy"
            style={{
              background: 'transparent',
              border: 'none',
              padding: '2px',
              cursor: 'pointer',
              color: showPhilosophy ? colorAccent : 'var(--color-text-secondary)',
              display: 'inline-flex',
              alignItems: 'center',
              opacity: showPhilosophy ? 1 : 0.6,
              transition: 'all 0.2s ease',
            }}
          >
            <Info size={11} strokeWidth={2} />
          </button>
        </div>

        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '10px',
          color: level > 0.4 ? colorAccent : 'var(--color-text-secondary)',
          opacity: 0.8,
          transition: 'color 0.4s ease',
        }}>
          {level >= 0.8 ? 'high resonance' : level >= 0.4 ? 'in phase' : 'quiet presence'}
        </span>
      </div>

      {/* Progress bar container */}
      <div style={{
        width: '100%',
        height: '3px',
        borderRadius: '2px',
        backgroundColor: 'var(--color-border)',
        overflow: 'hidden',
        position: 'relative',
      }}>
        <motion.div
          animate={{ width: `${Math.max(8, level * 100)}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          style={{
            height: '100%',
            borderRadius: '2px',
            background: `linear-gradient(90deg, ${colorAccent}40, ${colorAccent})`,
            boxShadow: level > 0.25 ? `0 0 12px ${colorAccent}88` : 'none',
            position: 'relative',
          }}
        >
          {/* Light wave surge flare on resonance trigger */}
          {surgeTrigger > 0 && (
            <motion.div
              key={surgeTrigger}
              initial={{ left: '-20%', opacity: 1 }}
              animate={{ left: '120%', opacity: 0 }}
              transition={{ duration: 0.65, ease: 'easeInOut' }}
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                width: '40px',
                background: `linear-gradient(90deg, transparent, #FFFFFF, transparent)`,
                filter: 'blur(1px)',
              }}
            />
          )}
        </motion.div>
      </div>

      {/* Anti-metric philosophy popover */}
      <AnimatePresence>
        {showPhilosophy && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'absolute',
              top: '26px',
              left: '16px',
              right: '16px',
              zIndex: 30,
              padding: '12px 14px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(18, 14, 30, 0.96)',
              border: `1px solid ${colorAccent}44`,
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6), 0 0 16px rgba(124, 92, 255, 0.15)',
              backdropFilter: 'blur(16px)',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <span style={{
                fontFamily: 'var(--font-display)',
                fontSize: '12px',
                fontWeight: 600,
                color: colorAccent,
                letterSpacing: '0.02em',
              }}>
                Why No Like Counters?
              </span>
              <button
                onClick={() => setShowPhilosophy(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-text-secondary)',
                  cursor: 'pointer',
                  fontSize: '12px',
                  padding: '2px 4px',
                }}
              >
                ✕
              </button>
            </div>
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: '12px',
              color: 'var(--color-text-primary)',
              lineHeight: 1.5,
              margin: 0,
              opacity: 0.9,
            }}>
              Wavelength replaces individual vanity metrics with collective room resonance. When you tap a message, you illuminate the space for everyone — without creating competition, influencers, or engagement bait.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

