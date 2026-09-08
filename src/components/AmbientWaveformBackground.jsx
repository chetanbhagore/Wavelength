import { useEffect, useRef, useMemo } from 'react';

/**
 * Full-bleed animated SVG waveform background.
 * Uses requestAnimationFrame for a looping sine-wave path morph.
 * Pauses when tab is backgrounded. Respects prefers-reduced-motion.
 */
export default function AmbientWaveformBackground({ colorAccent = '#7C5CFF' }) {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const startTimeRef = useRef(null);

  const reducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = window.innerWidth * window.devicePixelRatio;
      canvas.height = window.innerHeight * window.devicePixelRatio;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener('resize', resize);

    if (reducedMotion) {
      // Draw a static version
      drawStaticWaveform(ctx, canvas, colorAccent);
      return () => window.removeEventListener('resize', resize);
    }

    const draw = (timestamp) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = (timestamp - startTimeRef.current) / 1000;

      const w = window.innerWidth;
      const h = window.innerHeight;

      ctx.clearRect(0, 0, w, h);

      // Draw multiple layered waveforms
      drawWave(ctx, w, h, elapsed, 0.3, 0.08, colorAccent, 0.12);
      drawWave(ctx, w, h, elapsed, 0.5, 0.06, colorAccent, 0.08);
      drawWave(ctx, w, h, elapsed, 0.7, 0.04, colorAccent, 0.05);

      animationRef.current = requestAnimationFrame(draw);
    };

    animationRef.current = requestAnimationFrame(draw);

    const handleVisibilityChange = () => {
      if (document.hidden) {
        cancelAnimationFrame(animationRef.current);
      } else {
        startTimeRef.current = null;
        animationRef.current = requestAnimationFrame(draw);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [colorAccent, reducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
}

function drawWave(ctx, w, h, time, yOffset, amplitude, color, alpha) {
  ctx.beginPath();
  ctx.moveTo(0, h);

  const baseY = h * yOffset;
  const amp = h * amplitude;
  const frequency = 0.003;
  const speed = 0.8;

  for (let x = 0; x <= w; x += 2) {
    const y = baseY +
      Math.sin(x * frequency + time * speed) * amp +
      Math.sin(x * frequency * 1.5 + time * speed * 0.7) * amp * 0.5 +
      Math.sin(x * frequency * 0.5 + time * speed * 1.3) * amp * 0.3;
    ctx.lineTo(x, y);
  }

  ctx.lineTo(w, h);
  ctx.closePath();

  // Parse the hex color and apply alpha
  const r = parseInt(color.slice(1, 3), 16);
  const g = parseInt(color.slice(3, 5), 16);
  const b = parseInt(color.slice(5, 7), 16);
  ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
  ctx.fill();
}

function drawStaticWaveform(ctx, canvas, color) {
  const w = window.innerWidth;
  const h = window.innerHeight;

  drawWave(ctx, w, h, 0, 0.3, 0.08, color, 0.08);
  drawWave(ctx, w, h, 0, 0.5, 0.06, color, 0.05);
  drawWave(ctx, w, h, 0, 0.7, 0.04, color, 0.03);
}
