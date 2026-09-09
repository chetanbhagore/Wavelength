import { motion } from 'framer-motion';
import { useCallback, useRef, useState, useEffect } from 'react';
import { Compass } from 'lucide-react';
import frequencies from '../data/frequencies.json';
import { ambientDrone } from '../utils/ambientAudio';

/**
 * Circular frequency dial control with analog tuning aesthetics:
 * - 5px active tick marks with rounded caps and luminous glow trails
 * - Visible analog MHz frequency markings around the dial face
 * - Tactile mechanical detent audio clicks (Web Audio API) on tick changes
 * - 12 o'clock tuning needle and center-orb tactile snap feedback
 * - Presence residue ghost halo on recently vacated frequency (Issue #3)
 * - Role="slider" with aria-valuetext and touch/drag controls
 */
export default function FrequencyDial({
  currentIndex,
  totalFrequencies,
  currentFrequency,
  lastVisitedFrequencyId,
  onNext,
  onPrev,
  onKeyDown,
}) {
  const dialRef = useRef(null);
  const prevIndexRef = useRef(currentIndex);
  const rotation = -(currentIndex * (360 / totalFrequencies));

  // 3D Perspective Tilt State (Phase 3)
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
  const [isRecentSnap, setIsRecentSnap] = useState(false);
  const [particles, setParticles] = useState([]);

  // Trigger tactile analog mechanical click and snap burst on rotary changes
  useEffect(() => {
    if (prevIndexRef.current !== currentIndex) {
      ambientDrone.playDetentClick();
      prevIndexRef.current = currentIndex;
      setIsRecentSnap(true);

      // Radial particle sparks from active 12 o'clock needle
      const newParticles = Array.from({ length: 8 }).map((_, i) => {
        const angle = (i * Math.PI * 2) / 8 + (Math.random() - 0.5) * 0.4;
        const dist = 14 + Math.random() * 18;
        return {
          id: Math.random(),
          tx: Math.cos(angle) * dist,
          ty: Math.sin(angle) * dist - 8,
        };
      });
      setParticles(newParticles);

      const snapTimer = setTimeout(() => setIsRecentSnap(false), 240);
      const particleTimer = setTimeout(() => setParticles([]), 380);
      return () => {
        clearTimeout(snapTimer);
        clearTimeout(particleTimer);
      };
    }
  }, [currentIndex]);

  const handleMouseMove = (e) => {
    if (!dialRef.current || window.matchMedia('(pointer: coarse)').matches) return;
    const rect = dialRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = (e.clientX - centerX) / (rect.width / 2);
    const dy = (e.clientY - centerY) / (rect.height / 2);
    // Subtle physical tilt max ±6.5deg
    setTilt({
      rotateY: Math.max(-1, Math.min(1, dx)) * 6.5,
      rotateX: -Math.max(-1, Math.min(1, dy)) * 6.5,
    });
  };

  const handleMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0 });
  };

  const lastVisitedIndex = lastVisitedFrequencyId
    ? frequencies.findIndex((f) => f.id === lastVisitedFrequencyId)
    : -1;

  const handleDragEnd = useCallback((event, info) => {
    if (info.offset.x > 50 || info.offset.y < -50) {
      onPrev();
    } else if (info.offset.x < -50 || info.offset.y > 50) {
      onNext();
    }
  }, [onNext, onPrev]);

  // Auto-scan / seek mechanism across the analog band
  const [isScanning, setIsScanning] = useState(false);

  const handleAutoScan = useCallback(() => {
    if (isScanning) return;
    setIsScanning(true);
    let stepsLeft = 5 + Math.floor(Math.random() * 4); // 5 to 8 steps
    const interval = setInterval(() => {
      onNext();
      stepsLeft--;
      if (stepsLeft <= 0) {
        clearInterval(interval);
        setIsScanning(false);
        ambientDrone.playLockChime(528); // Station lock chime
      }
    }, 170);
  }, [isScanning, onNext]);

  // Touch/wheel handling for precise control
  const handleWheel = useCallback((e) => {
    e.preventDefault();
    if (e.deltaY > 0 || e.deltaX > 0) onNext();
    else onPrev();
  }, [onNext, onPrev]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
        perspective: '800px',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        ref={dialRef}
        role="slider"
        tabIndex={0}
        data-cursor="dial"
        className="frequency-dial-container"
        aria-valuemin={1}
        aria-valuemax={totalFrequencies}
        aria-valuenow={currentIndex + 1}
        aria-valuetext={currentFrequency.label}
        aria-label="Frequency dial"
        onKeyDown={onKeyDown}
        onWheel={handleWheel}
        drag
        dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        animate={{
          rotateX: tilt.rotateX,
          rotateY: tilt.rotateY,
          scale: isRecentSnap ? 1.06 : 1,
        }}
        transition={{
          rotateX: { type: 'spring', stiffness: 350, damping: 26 },
          rotateY: { type: 'spring', stiffness: 350, damping: 26 },
          scale: { type: 'spring', stiffness: 450, damping: 22 },
        }}
        style={{
          width: 'clamp(220px, 55vw, 320px)',
          height: 'clamp(220px, 55vw, 320px)',
          borderRadius: '50%',
          position: 'relative',
          cursor: 'grab',
          outline: 'none',
          touchAction: 'none',
          transformStyle: 'preserve-3d',
        }}
        whileTap={{ cursor: 'grabbing' }}
      >
        {/* Top Alignment Needle / Tuning Index Marker */}
        <div style={{
          position: 'absolute',
          top: '-14px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: isRecentSnap ? '4px' : '3px',
          height: isRecentSnap ? '15px' : '12px',
          borderRadius: '2px',
          background: currentFrequency.colorAccent,
          boxShadow: isRecentSnap
            ? `0 0 18px ${currentFrequency.colorAccent}, 0 0 6px #fff`
            : `0 0 12px ${currentFrequency.colorAccent}`,
          zIndex: 10,
          pointerEvents: 'none',
          transition: 'all 0.18s ease',
        }} />

        {/* Snap Pop Stardust Particle Sparks */}
        {particles.map((p) => (
          <motion.span
            key={p.id}
            initial={{ opacity: 1, scale: 1, x: '-50%', y: -14 }}
            animate={{ opacity: 0, scale: 0.2, x: `calc(-50% + ${p.tx}px)`, y: -14 + p.ty }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              top: 0,
              left: '50%',
              width: '3.5px',
              height: '3.5px',
              borderRadius: '50%',
              backgroundColor: currentFrequency.colorAccent,
              boxShadow: `0 0 6px ${currentFrequency.colorAccent}`,
              pointerEvents: 'none',
              zIndex: 15,
            }}
          />
        ))}

        {/* Dynamic Radio Equalizer Orbit Ring */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: '-10px',
            borderRadius: '50%',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        >
          {Array.from({ length: 24 }).map((_, idx) => {
            const angle = (idx * 360) / 24;
            return (
              <div
                key={idx}
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  width: '2px',
                  height: `${5 + ((idx * 5) % 8)}px`,
                  background: currentFrequency.colorAccent,
                  opacity: 0.35 + ((idx % 3) * 0.15),
                  transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-54%)`,
                  transformOrigin: 'center center',
                  borderRadius: '1px',
                  boxShadow: `0 0 6px ${currentFrequency.colorAccent}66`,
                  animation: `dial-eq-pulse ${0.9 + ((idx % 4) * 0.25)}s ease-in-out infinite alternate ${idx * 0.05}s`,
                }}
              />
            );
          })}
        </div>

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
          {/* Frequency tick marks & visible MHz figures (Sprint 1 Issues #3 & #7) */}
          {Array.from({ length: totalFrequencies }).map((_, i) => {
            const angle = (i * 360) / totalFrequencies - 90;
            const isActive = i === currentIndex;
            const isResidue = i === lastVisitedIndex && !isActive;
            const outerR = 48;
            const freqObj = frequencies[i];
            const mhzNumber = freqObj?.mhz ? freqObj.mhz.replace(' MHz', '') : '';

            return (
              <div key={i}>
                {/* Physical tick bar */}
                <motion.div
                  animate={isResidue ? {
                    opacity: [0.45, 0.95, 0.45],
                    scaleY: [1, 1.25, 1],
                  } : undefined}
                  transition={isResidue ? {
                    duration: 2.2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  } : undefined}
                  style={{
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    width: isActive ? (isRecentSnap ? '6px' : '5px') : isResidue ? '4px' : '3px',
                    height: isActive ? (isRecentSnap ? '21px' : '18px') : isResidue ? '14px' : '9px',
                    borderRadius: '3px',
                    background: isActive
                      ? currentFrequency.colorAccent
                      : isResidue
                        ? 'var(--color-gradient-start)'
                        : 'var(--color-text-secondary)',
                    opacity: isActive ? 1 : isResidue ? 0.9 : 0.45,
                    transform: `translate(-50%, -50%) rotate(${angle + 90}deg) translateY(-${outerR}%)`,
                    transformOrigin: 'center center',
                    transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                    boxShadow: isActive
                      ? isRecentSnap
                        ? `0 0 24px ${currentFrequency.colorAccent}, 0 0 10px #fff`
                        : `0 0 16px ${currentFrequency.colorAccent}, 0 0 6px #fff`
                      : isResidue
                        ? '0 0 14px rgba(124, 92, 255, 0.95), 0 0 6px #00F0FF'
                        : 'none',
                  }}
                  title={isResidue ? 'Presence residue: you were recently tuned here' : undefined}
                />

                {/* Visible MHz Broadcast coordinate */}
                <div
                  style={{
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    transform: `translate(-50%, -50%) rotate(${angle + 90}deg) translateY(-${outerR - 13}%)`,
                    transformOrigin: 'center center',
                    pointerEvents: 'none',
                    userSelect: 'none',
                  }}
                >
                  <span
                    style={{
                      display: 'inline-block',
                      transform: `rotate(-${angle + 90}deg)`,
                      fontFamily: 'var(--font-mono)',
                      fontSize: isActive ? '10px' : '8px',
                      fontWeight: isActive ? 700 : 500,
                      color: isActive ? '#FFFFFF' : 'var(--color-text-secondary)',
                      opacity: isActive ? 1 : 0.4,
                      letterSpacing: '0.02em',
                      textShadow: isActive ? `0 0 10px ${currentFrequency.colorAccent}` : 'none',
                      transition: 'all 0.25s ease',
                    }}
                  >
                    {mhzNumber}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Analog Tuner Glass Lens Reflection */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.01) 42%, transparent 60%)',
              pointerEvents: 'none',
              zIndex: 4,
            }}
          />


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

      {/* Dial Controls Footer: Swipe hint & Auto-Seek */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginTop: '2px',
      }}>
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: '12px',
          color: 'var(--color-text-secondary)',
          opacity: 0.6,
          userSelect: 'none',
        }}>
          ← drag or scroll →
        </p>

        <span style={{ opacity: 0.25, color: 'var(--color-text-secondary)' }}>•</span>

        <motion.button
          type="button"
          onClick={handleAutoScan}
          disabled={isScanning}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 12px',
            borderRadius: 'var(--radius-pill)',
            background: isScanning ? `${currentFrequency.colorAccent}22` : 'rgba(23, 27, 39, 0.6)',
            border: isScanning ? `1px solid ${currentFrequency.colorAccent}` : '1px solid rgba(255, 255, 255, 0.08)',
            color: isScanning ? currentFrequency.colorAccent : 'var(--color-text-secondary)',
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            cursor: isScanning ? 'wait' : 'pointer',
            transition: 'all 0.2s ease',
            outline: 'none',
          }}
          title="Auto-scan to a random active frequency"
        >
          <motion.span
            animate={isScanning ? { rotate: 360 } : { rotate: 0 }}
            transition={isScanning ? { duration: 0.8, repeat: Infinity, ease: 'linear' } : {}}
            style={{ display: 'flex', alignItems: 'center' }}
          >
            <Compass size={12} strokeWidth={2} />
          </motion.span>
          <span>{isScanning ? 'Seeking...' : 'Auto-Seek'}</span>
        </motion.button>
      </div>

      {/* Presence Residue Living Memory Micro-Indicator (Phase 6) */}
      {lastVisitedIndex >= 0 && lastVisitedIndex !== currentIndex && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 0.8, y: 0 }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontFamily: 'var(--font-mono)',
            fontSize: '10.5px',
            color: 'var(--color-text-secondary)',
            letterSpacing: '0.02em',
            marginTop: '2px',
          }}
        >
          <motion.span
            animate={{ opacity: [0.4, 1, 0.4], scale: [1, 1.3, 1] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              width: '5px',
              height: '5px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-gradient-start)',
              boxShadow: '0 0 8px var(--color-gradient-start)',
            }}
          />
          <span>signal residue • you were just tuned to {frequencies[lastVisitedIndex]?.label}</span>
        </motion.div>
      )}
    </div>
  );
}
