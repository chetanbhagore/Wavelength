import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import seedEchoes from '../data/seedEchoes.json';

// Pre-defined spatial orbital slots around the screen so whispers never collide with the center dial
const WHISPER_SLOTS = [
  { id: 'slot-tl', top: '14%', left: '8%', depth: 'mid' },
  { id: 'slot-tr', top: '18%', right: '9%', depth: 'near' },
  { id: 'slot-bl', bottom: '22%', left: '10%', depth: 'far' },
  { id: 'slot-br', bottom: '26%', right: '8%', depth: 'mid' },
];

/**
 * FloatingWhispers — Ethereal fragments of anonymous thoughts drifting across the screen.
 * Filtered by the active frequency, giving a glimpse into the emotional atmosphere.
 */
export default function FloatingWhispers({ frequency }) {
  const [hoveredId, setHoveredId] = useState(null);

  // Get matching whispers for the active frequency
  const activeWhispers = useMemo(() => {
    const matched = seedEchoes.filter((e) => e.frequencyId === frequency.id);
    const pool = matched.length > 0 ? matched : [
      { id: 'fallback_1', text: 'someone else is feeling this right now.' },
      { id: 'fallback_2', text: 'you are not carrying this alone.' },
      { id: 'fallback_3', text: 'waiting for the storm to clear.' },
    ];

    // Pick up to 4 items and assign to orbital slots
    return WHISPER_SLOTS.map((slot, index) => {
      const echo = pool[index % pool.length];
      return {
        ...slot,
        echoId: `${echo.id}-${frequency.id}`,
        text: echo.text,
      };
    });
  }, [frequency.id]);

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        zIndex: 0,
      }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={frequency.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, filter: 'blur(10px)', transition: { duration: 0.4 } }}
          transition={{ duration: 0.6 }}
          style={{ width: '100%', height: '100%', position: 'relative' }}
        >
          {activeWhispers.map((item) => {
            const isHovered = hoveredId === item.echoId;

            // Visual depth styling
            const depthStyles = {
              near: {
                fontSize: '13px',
                baseOpacity: 0.55,
                blur: '0px',
                driftY: [0, -14, 0],
                driftX: [0, 8, 0],
                duration: 7,
              },
              mid: {
                fontSize: '12px',
                baseOpacity: 0.4,
                blur: '0.5px',
                driftY: [0, -10, 0],
                driftX: [0, -6, 0],
                duration: 9,
              },
              far: {
                fontSize: '11px',
                baseOpacity: 0.28,
                blur: '1.2px',
                driftY: [0, 12, 0],
                driftX: [0, 10, 0],
                duration: 11,
              },
            }[item.depth];

            return (
              <motion.div
                key={item.echoId}
                initial={{ opacity: 0, scale: 0.9, y: 15 }}
                animate={{
                  opacity: isHovered ? 0.95 : depthStyles.baseOpacity,
                  scale: isHovered ? 1.05 : 1,
                  y: isHovered ? 0 : depthStyles.driftY,
                  x: isHovered ? 0 : depthStyles.driftX,
                }}
                transition={{
                  opacity: { duration: 0.3 },
                  scale: { duration: 0.3 },
                  y: {
                    duration: depthStyles.duration,
                    repeat: isHovered ? 0 : Infinity,
                    ease: 'easeInOut',
                  },
                  x: {
                    duration: depthStyles.duration * 1.3,
                    repeat: isHovered ? 0 : Infinity,
                    ease: 'easeInOut',
                  },
                }}
                onMouseEnter={() => setHoveredId(item.echoId)}
                onMouseLeave={() => setHoveredId(null)}
                style={{
                  position: 'absolute',
                  top: item.top,
                  bottom: item.bottom,
                  left: item.left,
                  right: item.right,
                  maxWidth: '220px',
                  padding: '8px 14px',
                  borderRadius: '16px',
                  background: isHovered
                    ? 'rgba(23, 27, 39, 0.85)'
                    : 'rgba(23, 27, 39, 0.35)',
                  border: isHovered
                    ? `1px solid ${frequency.colorAccent}77`
                    : '1px solid rgba(255, 255, 255, 0.05)',
                  boxShadow: isHovered
                    ? `0 8px 30px rgba(0,0,0,0.5), 0 0 20px ${frequency.colorAccent}33`
                    : 'none',
                  backdropFilter: isHovered ? 'blur(12px)' : 'blur(4px)',
                  filter: isHovered ? 'none' : `blur(${depthStyles.blur})`,
                  color: isHovered ? '#FFFFFF' : 'var(--color-text-secondary)',
                  fontFamily: 'var(--font-display)',
                  fontSize: depthStyles.fontSize,
                  fontStyle: 'italic',
                  letterSpacing: '0.02em',
                  lineHeight: 1.45,
                  cursor: 'default',
                  pointerEvents: 'auto',
                  userSelect: 'none',
                  transition: 'background 0.3s, border 0.3s, box-shadow 0.3s, filter 0.3s',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
                  <span
                    style={{
                      width: '4px',
                      height: '4px',
                      borderRadius: '50%',
                      background: frequency.colorAccent,
                      opacity: isHovered ? 1 : 0.6,
                      boxShadow: `0 0 6px ${frequency.colorAccent}`,
                    }}
                  />
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '9px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      opacity: 0.65,
                      fontStyle: 'normal',
                    }}
                  >
                    whisper in ether
                  </span>
                </div>
                "{item.text}"
              </motion.div>
            );
          })}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
