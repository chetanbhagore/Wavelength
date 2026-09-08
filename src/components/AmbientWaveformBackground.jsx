import { useEffect, useRef, useMemo } from 'react';

/**
 * Full-bleed animated SVG waveform & atmospheric particle background.
 * Uses requestAnimationFrame for a looping sine-wave path morph and drifting light motes.
 * Pauses when tab is backgrounded. Respects prefers-reduced-motion.
 */
export default function AmbientWaveformBackground({ colorAccent = '#7C5CFF', opacity = 1 }) {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const startTimeRef = useRef(null);
  const particlesRef = useRef([]);

  const reducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  // Initialize particles
  useEffect(() => {
    const count = 42;
    const particles = [];
    const w = window.innerWidth || 1000;
    const h = window.innerHeight || 800;

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        radius: 0.8 + Math.random() * 1.6,
        baseAlpha: 0.15 + Math.random() * 0.45,
        speedX: (Math.random() - 0.5) * 0.35,
        speedY: -0.15 - Math.random() * 0.3, // slow gentle upward drift
        phase: Math.random() * Math.PI * 2,
      });
    }
    particlesRef.current = particles;
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
      drawStaticWaveform(ctx, canvas, colorAccent);
      return () => window.removeEventListener('resize', resize);
    }

    const draw = (timestamp) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = (timestamp - startTimeRef.current) / 1000;

      const w = window.innerWidth;
      const h = window.innerHeight;

      ctx.clearRect(0, 0, w, h);

      // 1. Draw enhanced layered waveforms with rich glowing depth
      drawWave(ctx, w, h, elapsed, 0.32, 0.11, colorAccent, 0.20);
      drawWave(ctx, w, h, elapsed, 0.52, 0.08, colorAccent, 0.14);
      drawWave(ctx, w, h, elapsed, 0.74, 0.05, colorAccent, 0.09);

      // 2. Draw atmospheric micro-particles / light motes
      const { r, g, b } = parseHexColor(colorAccent);
      const particles = particlesRef.current;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.speedX;
        p.y += p.speedY;

        // Wrap around screen boundaries
        if (p.y < -10) p.y = h + 10;
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;

        // Subtle shimmering alpha
        const pulse = Math.sin(elapsed * 1.5 + p.phase);
        const currentAlpha = Math.max(0.05, p.baseAlpha + pulse * 0.15);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${currentAlpha})`;
        ctx.shadowColor = `rgba(${r}, ${g}, ${b}, 0.6)`;
        ctx.shadowBlur = 6;
        ctx.fill();
      }
      ctx.shadowBlur = 0; // reset shadow

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
        opacity,
        transition: 'opacity 0.6s ease',
      }}
    />
  );
}

function parseHexColor(hex) {
  const clean = hex.replace('#', '');
  if (clean.length === 3) {
    return {
      r: parseInt(clean[0] + clean[0], 16),
      g: parseInt(clean[1] + clean[1], 16),
      b: parseInt(clean[2] + clean[2], 16),
    };
  }
  return {
    r: parseInt(clean.slice(0, 2), 16) || 124,
    g: parseInt(clean.slice(2, 4), 16) || 92,
    b: parseInt(clean.slice(4, 6), 16) || 255,
  };
}

function drawWave(ctx, w, h, time, yOffset, amplitude, color, alpha) {
  ctx.beginPath();
  ctx.moveTo(0, h);

  const baseY = h * yOffset;
  const amp = h * amplitude;
  const frequency = 0.0028;
  const speed = 0.75;

  for (let x = 0; x <= w; x += 3) {
    const y = baseY +
      Math.sin(x * frequency + time * speed) * amp +
      Math.sin(x * frequency * 1.6 + time * speed * 0.7) * amp * 0.45 +
      Math.sin(x * frequency * 0.6 + time * speed * 1.2) * amp * 0.25;
    ctx.lineTo(x, y);
  }

  ctx.lineTo(w, h);
  ctx.closePath();

  const { r, g, b } = parseHexColor(color);

  // Gradient fill from base down
  const gradient = ctx.createLinearGradient(0, baseY - amp, 0, h);
  gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${alpha * 1.3})`);
  gradient.addColorStop(0.6, `rgba(${r}, ${g}, ${b}, ${alpha * 0.7})`);
  gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0.01)`);

  ctx.fillStyle = gradient;
  ctx.fill();
}

function drawStaticWaveform(ctx, canvas, color) {
  const w = window.innerWidth;
  const h = window.innerHeight;

  drawWave(ctx, w, h, 0, 0.32, 0.11, color, 0.15);
  drawWave(ctx, w, h, 0, 0.52, 0.08, color, 0.10);
  drawWave(ctx, w, h, 0, 0.74, 0.05, color, 0.06);
}
