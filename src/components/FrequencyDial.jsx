import { motion } from 'framer-motion';
import { useCallback, useRef } from 'react';

/**
 * Circular frequency dial control.
 * Drag/swipe/arrow-key operable with spring physics.
 * Implements role="slider" with aria-valuetext.
 */
export default function FrequencyDial({
  currentIndex,
  totalFrequencies,
  currentFrequency,
  onNext,
  onPrev,
  onKeyDown,
}) {
  const dialRef = useRef(null);
  const rotation = -(currentIndex * (360 / totalFrequencies));

  const handleDragEnd = useCallback((event, info) => {
    if (info.offset.x > 50 || info.offset.y < -50) {
      onPrev();
    } else if (info.offset.x < -50 || info.offset.y > 50) {
      onNext();
    }
  }, [onNext, onPrev]);

  // Touch/wheel handling for precise control
  const handleWheel = useCallback((e) => {
    e.preventDefault();
    if (e.deltaY > 0 || e.deltaX > 0) onNext();
    else onPrev();
  }, [onNext, onPrev]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
      <motion.div
        ref={dialRef}
        role="slider"
        tabIndex={0}
        aria-valuemin={1}
        aria-valuemax={totalFrequencies}
        aria-valuenow={currentIndex + 1}
        aria-valuetext={currentFrequency.label}
        aria-label="Frequency dial"
        onKeyDown={onKeyDown}
        onWheel={handleWheel}
        drag
        dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }}
        dragElastic={0.1}
        onDragEnd={handleDragEnd}
        style={{
          width: 'clamp(220px, 55vw, 320px)',
          height: 'clamp(220px, 55vw, 320px)',
          borderRadius: '50%',
          position: 'relative',
          cursor: 'grab',
          outline: 'none',
          touchAction: 'none',
        }}
        whileTap={{ cursor: 'grabbing' }}
      >
        {/* Top Alignment Needle / Tuning Index Marker */}
        <div style={{
          position: 'absolute',
          top: '-14px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '3px',
          height: '12px',
          borderRadius: '2px',
          background: currentFrequency.colorAccent,
          boxShadow: `0 0 12px ${currentFrequency.colorAccent}`,
          zIndex: 10,
          pointerEvents: 'none',
        }} />

        {/* Outer glow ring */}
        <motion.div
          animate={{ rotate: rotation }}
          transition={{ type: 'spring', stiffness: 260, damping: 26 }}
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            position: 'relative',
            border: '2px solid var(--color-border)',
            background: 'radial-gradient(circle at center, rgba(124,92,255,0.08) 0%, transparent 70%)',
            boxShadow: `0 0 60px ${currentFrequency.colorAccent}25, inset 0 0 40px ${currentFrequency.colorAccent}15`,
          }}
        >
          {/* Frequency tick marks */}
          {Array.from({ length: totalFrequencies }).map((_, i) => {
            const angle = (i * 360) / totalFrequencies - 90;
            const isActive = i === currentIndex;
            const outerR = 48;

            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  width: isActive ? '5px' : '3px',
                  height: isActive ? '18px' : '9px',
                  borderRadius: '3px',
                  background: isActive ? currentFrequency.colorAccent : 'var(--color-text-secondary)',
                  opacity: isActive ? 1 : 0.45,
                  transform: `translate(-50%, -50%) rotate(${angle + 90}deg) translateY(-${outerR}%)`,
                  transformOrigin: 'center center',
                  transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                  boxShadow: isActive
                    ? `0 0 16px ${currentFrequency.colorAccent}, 0 0 6px #fff`
                    : 'none',
                }}
              />
            );
          })}

          {/* Center indicator & Haptic Light Flash */}
          <div style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            width: '42%',
            height: '42%',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${currentFrequency.colorAccent}25, transparent 75%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <motion.div
              key={currentFrequency.id}
              initial={{ scale: 0.75, opacity: 0.9, filter: 'brightness(2)' }}
              animate={{ scale: 1, opacity: 1, filter: 'brightness(1)' }}
              transition={{ type: 'spring', stiffness: 450, damping: 22 }}
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: `linear-gradient(135deg, var(--color-gradient-start), ${currentFrequency.colorAccent})`,
                boxShadow: `0 0 28px ${currentFrequency.colorAccent}88, inset 0 0 8px rgba(255,255,255,0.6)`,
              }}
            />
          </div>

          {/* Waveform decoration around edge */}
          <svg
            viewBox="0 0 200 200"
            style={{
              position: 'absolute',
              inset: '-10%',
              width: '120%',
              height: '120%',
              pointerEvents: 'none',
            }}
          >
            <motion.circle
              cx="100"
              cy="100"
              r="95"
              fill="none"
              stroke={currentFrequency.colorAccent}
              strokeWidth="0.5"
              strokeOpacity="0.3"
              strokeDasharray="4 8"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              style={{ transformOrigin: '100px 100px' }}
            />
          </svg>
        </motion.div>
      </motion.div>

      {/* Swipe hint */}
      <p style={{
        fontFamily: 'var(--font-body)',
        fontSize: '12px',
        color: 'var(--color-text-secondary)',
        opacity: 0.6,
        userSelect: 'none',
      }}>
        ← drag or scroll to change →
      </p>
    </div>
  );
}
