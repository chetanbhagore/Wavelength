import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import seedEchoes from '../data/seedEchoes.json';
import frequencies from '../data/frequencies.json';
import { ambientDrone } from '../utils/ambientAudio';

// Pre-defined spatial orbital slots: reduced to 2 positions so the dial hero breathes
const WHISPER_SLOTS = [
  { id: 'slot-tr', top: '16%', right: '8%', depth: 'near' },
  { id: 'slot-bl', bottom: '22%', left: '8%', depth: 'mid' },
];

/**
 * FloatingWhispers — Ethereal fragments of anonymous thoughts drifting across the ether.
 * Interactive: Clicking any whisper magnetically pulls the dial to that frequency!
 */
export default function FloatingWhispers({ frequency, onPullToFrequency }) {
  const [hoveredId, setHoveredId] = useState(null);
  const [probeLine, setProbeLine] = useState(null);

  // Get matching whispers: slot 0 from current frequency, slot 1 from an adjacent frequency to invite tuning
  const activeWhispers = useMemo(() => {
    const currentIdx = Math.max(0, frequencies.findIndex((f) => f.id === frequency.id));
    const otherIdx = (currentIdx + 2) % frequencies.length;
    const otherFreq = frequencies[otherIdx] || frequencies[0];

    const currentMatches = seedEchoes.filter((e) => e.frequencyId === frequency.id);
    const otherMatches = seedEchoes.filter((e) => e.frequencyId === otherFreq.id);

    const echo0 = currentMatches[0] || { id: 'fallback_0', text: 'someone else is feeling this right now.' };
    const echo1 = otherMatches[0] || seedEchoes[1] || { id: 'fallback_1', text: 'waiting for the storm to clear.' };

    return [
      {
        ...WHISPER_SLOTS[0],
        echoId: `${echo0.id}-${frequency.id}`,
        text: echo0.text,
        targetFrequencyIndex: currentIdx,
        frequencyLabel: frequency.label,
        frequencyColor: frequency.colorAccent,
        mhz: frequency.mhz,
      },
      {
        ...WHISPER_SLOTS[1],
        echoId: `${echo1.id}-${otherFreq.id}`,
        text: echo1.text,
        targetFrequencyIndex: otherIdx,
        frequencyLabel: otherFreq.label,
        frequencyColor: otherFreq.colorAccent,
        mhz: otherFreq.mhz,
      },
    ];
  }, [frequency.id, frequency.label, frequency.colorAccent, frequency.mhz]);

  const handleWhisperClick = (item, e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const startX = rect.left + rect.width / 2;
    const startY = rect.top + rect.height / 2;
    const endX = window.innerWidth / 2;
    const endY = window.innerHeight / 2;

    setProbeLine({
      x1: startX,
      y1: startY,
      x2: endX,
      y2: endY,
      color: item.frequencyColor,
    });

    ambientDrone.playLockChime(528);
    onPullToFrequency?.(item.targetFrequencyIndex);

    setTimeout(() => {
      setProbeLine(null);
    }, 750);
  };

  return (
    <div
      aria-hidden="true"
      className="floating-whispers-container"
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

            // Visual depth styling - softened for restraint
            const depthStyles = {
              near: {
                fontSize: '12.5px',
                baseOpacity: 0.38,
                blur: '0px',
                driftY: [0, -12, 0],
                driftX: [0, 6, 0],
                duration: 9,
              },
              mid: {
                fontSize: '11.5px',
                baseOpacity: 0.28,
                blur: '0.6px',
                driftY: [0, -8, 0],
                driftX: [0, -5, 0],
                duration: 11,
              },
              far: {
                fontSize: '11px',
                baseOpacity: 0.2,
                blur: '1.2px',
                driftY: [0, 10, 0],
                driftX: [0, 8, 0],
                duration: 13,
              },
            }[item.depth];

            return (
              <motion.div
                key={item.echoId}
                initial={{ opacity: 0, scale: 0.9, y: 15 }}
                animate={{
                  opacity: isHovered ? 0.98 : depthStyles.baseOpacity,
                  scale: isHovered ? 1.06 : 1,
                  y: isHovered ? 0 : depthStyles.driftY,
                  x: isHovered ? 0 : depthStyles.driftX,
                }}
                whileTap={{ scale: 0.96 }}
                transition={{
                  opacity: { duration: 0.25 },
                  scale: { duration: 0.25 },
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
                data-cursor="whisper"
                className="floating-whisper-card"
                onMouseEnter={() => setHoveredId(item.echoId)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={(e) => handleWhisperClick(item, e)}
                title={`Click to magnetically pull dial to ${item.mhz} (${item.frequencyLabel})`}
                style={{
                  position: 'absolute',
                  top: item.top,
                  bottom: item.bottom,
                  left: item.left,
                  right: item.right,
                  maxWidth: '230px',
                  padding: '10px 15px',
                  borderRadius: '16px',
                  background: isHovered
                    ? 'rgba(23, 27, 42, 0.94)'
                    : 'rgba(23, 27, 39, 0.38)',
                  border: isHovered
                    ? `1px solid ${item.frequencyColor}`
                    : '1px solid rgba(255, 255, 255, 0.06)',
                  boxShadow: isHovered
                    ? `0 12px 35px rgba(0,0,0,0.65), 0 0 24px ${item.frequencyColor}44`
                    : 'none',
                  backdropFilter: isHovered ? 'blur(16px)' : 'blur(4px)',
                  filter: isHovered ? 'none' : `blur(${depthStyles.blur})`,
                  color: isHovered ? '#FFFFFF' : 'var(--color-text-secondary)',
                  fontFamily: 'var(--font-display)',
                  fontSize: depthStyles.fontSize,
                  fontStyle: 'italic',
                  letterSpacing: '0.02em',
                  lineHeight: 1.45,
                  cursor: 'pointer',
                  pointerEvents: 'auto',
                  userSelect: 'none',
                  transition: 'background 0.25s, border 0.25s, box-shadow 0.25s, filter 0.25s, color 0.25s',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px', marginBottom: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <span
                      style={{
                        width: '4px',
                        height: '4px',
                        borderRadius: '50%',
                        background: item.frequencyColor,
                        opacity: isHovered ? 1 : 0.6,
                        boxShadow: `0 0 6px ${item.frequencyColor}`,
                      }}
                    />
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '9px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        opacity: 0.75,
                        fontStyle: 'normal',
                        color: item.frequencyColor,
                      }}
                    >
                      {item.mhz || 'ether'}
                    </span>
                  </div>

                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '8.5px',
                      color: item.frequencyColor,
                      fontStyle: 'normal',
                      letterSpacing: '0.04em',
                      opacity: isHovered ? 1 : 0.6,
                    }}
                  >
                    pull dial ⟲
                  </span>
                </div>
                "{item.text}"
              </motion.div>
            );
          })}
        </motion.div>
      </AnimatePresence>

      {/* Luminous SVG Magnetic Probe Beam on Whisper Pull (Phase 5) */}
      {probeLine && (
        <svg
          style={{
            position: 'fixed',
            inset: 0,
            width: '100vw',
            height: '100vh',
            pointerEvents: 'none',
            zIndex: 25,
          }}
        >
          <defs>
            <linearGradient
              id="whisperProbeGrad"
              x1={probeLine.x1}
              y1={probeLine.y1}
              x2={probeLine.x2}
              y2={probeLine.y2}
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor={probeLine.color} stopOpacity="1" />
              <stop offset="60%" stopColor={probeLine.color} stopOpacity="0.8" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.3" />
            </linearGradient>
          </defs>
          <motion.line
            x1={probeLine.x1}
            y1={probeLine.y1}
            x2={probeLine.x2}
            y2={probeLine.y2}
            stroke="url(#whisperProbeGrad)"
            strokeWidth="2.5"
            strokeDasharray="6 4"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: [0, 0.95, 0] }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          />
        </svg>
      )}
    </div>
  );
}

FloatingWhispers.propTypes = {
  /** Active frequency for whisper content */
  frequency: FrequencyShape.isRequired,
  /** Callback when user pulls to a frequency */
  onPullToFrequency: PropTypes.func,
};
