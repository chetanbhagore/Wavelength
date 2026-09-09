import { useEffect, useRef, useState } from 'react';

/**
 * Signal-Probe Theme Cursor (Phase 1)
 * Replaces default OS cursor on desktop pointer devices with an analog radio signal probe:
 * - 60fps RAF linear interpolation (lerp) for analog weight
 * - State awareness: default, near-dial, dragging, over-whisper, over-button
 * - Fallbacks: auto-disabled on touch/coarse devices and prefers-reduced-motion
 */
export default function SignalCursor() {
  const cursorRef = useRef(null);
  const posRef = useRef({ x: -100, y: -100, targetX: -100, targetY: -100 });
  const rafRef = useRef(null);
  const [cursorState, setCursorState] = useState('default');
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchOrReduced] = useState(() => {
    if (typeof window === 'undefined') return true;
    return (
      window.matchMedia('(pointer: coarse)').matches ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    );
  });
  const isDraggingRef = useRef(false);

  useEffect(() => {
    if (isTouchOrReduced) return;

    document.body.classList.add('custom-cursor-active');

    const handlePointerMove = (e) => {
      posRef.current.targetX = e.clientX;
      posRef.current.targetY = e.clientY;
      if (!isVisible) setIsVisible(true);

      // Detect hover target context using e.target (instant, zero layout thrash)
      if (isDraggingRef.current) {
        setCursorState('dragging');
        return;
      }

      const target = e.target;
      if (!target || !(target instanceof Element)) {
        setCursorState('default');
        return;
      }

      if (target.closest('[data-cursor="whisper"]') || target.closest('.floating-whisper-card')) {
        setCursorState('over-whisper');
      } else if (target.closest('[data-cursor="dial"]') || target.closest('.frequency-dial-container')) {
        setCursorState('near-dial');
      } else if (
        target.closest('button') ||
        target.closest('a') ||
        target.closest('[role="button"]') ||
        target.closest('input') ||
        target.closest('[data-cursor="pointer"]')
      ) {
        setCursorState('over-button');
      } else {
        setCursorState('default');
      }
    };

    const handlePointerDown = (e) => {
      const target = e.target;
      if (target instanceof Element && (target.closest('[data-cursor="dial"]') || target.closest('.frequency-dial-container'))) {
        isDraggingRef.current = true;
        setCursorState('dragging');
      }
    };

    const handlePointerUp = () => {
      if (isDraggingRef.current) {
        isDraggingRef.current = false;
        setCursorState('near-dial');
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerdown', handlePointerDown, { passive: true });
    window.addEventListener('pointerup', handlePointerUp, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    // High-speed smooth RAF loop with 0.48 lerp for instant response
    const render = () => {
      const pos = posRef.current;
      pos.x += (pos.targetX - pos.x) * 0.48;
      pos.y += (pos.targetY - pos.y) * 0.48;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
      }
      rafRef.current = requestAnimationFrame(render);
    };

    rafRef.current = requestAnimationFrame(render);

    return () => {
      document.body.classList.remove('custom-cursor-active');
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isVisible, isTouchOrReduced]);

  if (isTouchOrReduced || !isVisible) return null;

  return (
    <div
      ref={cursorRef}
      className="signal-cursor"
      aria-hidden="true"
      style={{
        width: 0,
        height: 0,
        position: 'fixed',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        zIndex: 99999,
        willChange: 'transform',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '-16px',
          left: '-16px',
          width: '32px',
          height: '32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'transform 0.18s ease-out, opacity 0.18s ease-out',
          transform:
            cursorState === 'over-button'
              ? 'scale(1.22)'
              : cursorState === 'near-dial'
              ? 'scale(1.18)'
              : cursorState === 'dragging'
              ? 'scale(0.85)'
              : 'scale(1)',
        }}
      >
        {/* State: Dragging -> Pure photon light point */}
        {cursorState === 'dragging' ? (
          <div
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: '#FFFFFF',
              boxShadow: '0 0 14px #A78BFA, 0 0 24px #7C5CFF',
            }}
          />
        ) : cursorState === 'over-whisper' ? (
          /* State: Over Whisper -> Short Waveform Arc */
          <div style={{ position: 'relative', width: '24px', height: '24px' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M 2 12 Q 6 4, 12 12 T 22 12"
                stroke="#33E6C9"
                strokeWidth="1.8"
                strokeLinecap="round"
                fill="none"
                style={{ filter: 'drop-shadow(0 0 4px #33E6C9)' }}
              />
            </svg>
            <div
              style={{
                position: 'absolute',
                top: '10px',
                left: '10px',
                width: '4px',
                height: '4px',
                borderRadius: '50%',
                backgroundColor: '#33E6C9',
              }}
            />
          </div>
        ) : cursorState === 'near-dial' ? (
          /* State: Near Dial -> Enlarged ring + directional luminous probe lines */
          <div
            style={{
              width: '26px',
              height: '26px',
              borderRadius: '50%',
              border: '1px solid rgba(167, 139, 250, 0.75)',
              boxShadow: '0 0 12px rgba(124, 92, 255, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            }}
          >
            {/* Center dot */}
            <div
              style={{
                width: '3.5px',
                height: '3.5px',
                borderRadius: '50%',
                backgroundColor: '#A78BFA',
                boxShadow: '0 0 6px #7C5CFF',
              }}
            />
            {/* Crosshair ticks */}
            <span style={{ position: 'absolute', top: '-4px', width: '1px', height: '3px', backgroundColor: 'rgba(167, 139, 250, 0.8)' }} />
            <span style={{ position: 'absolute', bottom: '-4px', width: '1px', height: '3px', backgroundColor: 'rgba(167, 139, 250, 0.8)' }} />
            <span style={{ position: 'absolute', left: '-4px', width: '3px', height: '1px', backgroundColor: 'rgba(167, 139, 250, 0.8)' }} />
            <span style={{ position: 'absolute', right: '-4px', width: '3px', height: '1px', backgroundColor: 'rgba(167, 139, 250, 0.8)' }} />
          </div>
        ) : (
          /* State: Default / Over-Button -> Soft Violet Ring + Center Dot */
          <div
            style={{
              width: cursorState === 'over-button' ? '22px' : '18px',
              height: cursorState === 'over-button' ? '22px' : '18px',
              borderRadius: '50%',
              border: cursorState === 'over-button' ? '1.5px solid #FF4FA3' : '1px solid rgba(167, 139, 250, 0.65)',
              boxShadow: cursorState === 'over-button' ? '0 0 16px rgba(255, 79, 163, 0.65)' : 'var(--cursor-glow)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s ease-out',
            }}
          >
            <div
              style={{
                width: '3px',
                height: '3px',
                borderRadius: '50%',
                backgroundColor: cursorState === 'over-button' ? '#FFFFFF' : '#A78BFA',
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

SignalCursor.propTypes = {};
