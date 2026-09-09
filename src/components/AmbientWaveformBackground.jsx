import { useEffect, useRef, useMemo } from 'react';

/**
 * Full-bleed animated SVG waveform & atmospheric mood-reactive particle background.
 * Adapts canvas physics to the active frequency mood:
 * - 'restless': Insomnia rain drizzle / slow vertical streaks
 * - 'electric': Kinetic golden embers & rising sparks
 * - 'hopeful-lonely': Soft breathing bokeh orbs in mist
 * - 'bittersweet': Floating prismatic crystals with gentle tilt
 * - 'anxious': Micro-pulse static grains and subtle scanline sweep
 * - 'warm': Radiant expanding sunbeam motes
 * - 'aching': Slow deep sorrowful ocean swell
 * - 'determined': Ascending aurora light beams
 *
 * Respects prefers-reduced-motion and tab backgrounding.
 */
export default function AmbientWaveformBackground({
  colorAccent = '#7C5CFF',
  mood = 'restless',
  opacity = 1,
}) {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const startTimeRef = useRef(null);
  const particlesRef = useRef([]);
  const energyRef = useRef(1.0);

  const reducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  const mouseRef = useRef({ x: -1000, y: -1000, targetX: -1000, targetY: -1000, active: false });
  const trailParticlesRef = useRef([]);

  // Surge energy on frequency or mood shift (Sprint 1 Issue #6)
  useEffect(() => {
    energyRef.current = 2.0; // Temporary swell on tuning
  }, [mood, colorAccent]);

  // Pointer movement listener for magnetic ether interaction
  useEffect(() => {
    const handlePointerMove = (e) => {
      mouseRef.current.targetX = e.clientX;
      mouseRef.current.targetY = e.clientY;
      mouseRef.current.active = true;

      // Emit 1-2 ether wake particles on cursor movement
      if (Math.random() < 0.6) {
        trailParticlesRef.current.push({
          x: e.clientX + (Math.random() - 0.5) * 12,
          y: e.clientY + (Math.random() - 0.5) * 12,
          vx: (Math.random() - 0.5) * 1.2,
          vy: -0.4 - Math.random() * 0.8,
          life: 1.0,
          maxLife: 1.0,
          size: 1.0 + Math.random() * 2.2,
        });
        if (trailParticlesRef.current.length > 45) {
          trailParticlesRef.current.shift();
        }
      }
    };

    const handlePointerLeave = () => {
      mouseRef.current.active = false;
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerleave', handlePointerLeave);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerleave', handlePointerLeave);
    };
  }, []);

  // Initialize or re-seed particles when mood changes (throttled on mobile for high performance)
  useEffect(() => {
    const w = window.innerWidth || 1000;
    const h = window.innerHeight || 800;
    const isMobile = w < 768;
    const baseCount = mood === 'hopeful-lonely' ? 24 : mood === 'restless' ? 55 : 45;
    const count = isMobile ? Math.round(baseCount * 0.42) : baseCount;
    const particles = [];

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        radius: mood === 'hopeful-lonely'
          ? 3.5 + Math.random() * 7.5 // Bokeh orbs
          : 0.8 + Math.random() * 1.8,
        length: mood === 'restless' ? 8 + Math.random() * 16 : 0, // Rain streak length
        baseAlpha: mood === 'hopeful-lonely' ? 0.08 + Math.random() * 0.16 : 0.18 + Math.random() * 0.45,
        speedX: getMoodSpeedX(mood),
        speedY: getMoodSpeedY(mood),
        phase: Math.random() * Math.PI * 2,
        rotation: Math.random() * Math.PI,
      });
    }
    particlesRef.current = particles;
  }, [mood]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      // Clamped to 2 to eliminate mobile GPU fill-rate bottle-necks on 3x Retina
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener('resize', resize);

    if (reducedMotion) {
      drawStaticWaveform(ctx, colorAccent);
      return () => window.removeEventListener('resize', resize);
    }

    const draw = (timestamp) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = (timestamp - startTimeRef.current) / 1000;

      // Smooth mouse easing
      const mouse = mouseRef.current;
      mouse.x += (mouse.targetX - mouse.x) * 0.14;
      mouse.y += (mouse.targetY - mouse.y) * 0.14;

      // Smooth decay of tuning surge toward baseline 1.0
      energyRef.current += (1.0 - energyRef.current) * 0.035;
      const currentEnergy = energyRef.current;

      const w = window.innerWidth;
      const h = window.innerHeight;

      ctx.clearRect(0, 0, w, h);

      const { r, g, b } = parseHexColor(colorAccent);

      // 0. Magnetic Bioluminescent Cursor Glow
      if (mouse.active && mouse.x > 0 && mouse.y > 0) {
        const glowRadius = 180;
        const radialGrad = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, glowRadius);
        radialGrad.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.14)`);
        radialGrad.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, 0.04)`);
        radialGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = radialGrad;
        ctx.fillRect(mouse.x - glowRadius, mouse.y - glowRadius, glowRadius * 2, glowRadius * 2);
      }

      // 1. Draw mood-tuned layered waveforms reacting to tuning energy & mouse
      const baseWaveSpeed = mood === 'electric' ? 1.2 : mood === 'aching' ? 0.45 : 0.75;
      const waveSpeed = baseWaveSpeed * (0.8 + currentEnergy * 0.2);
      const ampBoost = 0.75 + currentEnergy * 0.25;

      drawWave(ctx, w, h, elapsed * waveSpeed, 0.32, 0.11 * ampBoost, colorAccent, 0.20, mouse);
      drawWave(ctx, w, h, elapsed * waveSpeed, 0.52, 0.08 * ampBoost, colorAccent, 0.14, mouse);
      drawWave(ctx, w, h, elapsed * waveSpeed, 0.74, 0.05 * ampBoost, colorAccent, 0.09, mouse);

      // 2. Draw cursor trail wake particles
      const trail = trailParticlesRef.current;
      const enableShadowBlur = w >= 768;
      for (let i = trail.length - 1; i >= 0; i--) {
        const tp = trail[i];
        tp.x += tp.vx;
        tp.y += tp.vy;
        tp.life -= 0.024;
        if (tp.life <= 0) {
          trail.splice(i, 1);
          continue;
        }
        const alpha = (tp.life / tp.maxLife) * 0.55;
        ctx.beginPath();
        ctx.arc(tp.x, tp.y, tp.size * (tp.life / tp.maxLife), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
        if (enableShadowBlur) {
          ctx.shadowColor = colorAccent;
          ctx.shadowBlur = 8;
        }
        ctx.fill();
        if (enableShadowBlur) {
          ctx.shadowBlur = 0;
        }
      }
      const particles = particlesRef.current;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.speedX;
        p.y += p.speedY;

        // Custom sway based on mood
        if (mood === 'electric') {
          p.x += Math.sin(elapsed * 3 + p.phase) * 0.6;
        } else if (mood === 'bittersweet') {
          p.rotation += 0.01;
        }

        // Screen wrap-around bounds
        if (p.y < -20) p.y = h + 20;
        if (p.y > h + 20) p.y = -20;
        if (p.x < -20) p.x = w + 20;
        if (p.x > w + 20) p.x = -20;

        const pulse = Math.sin(elapsed * 1.8 + p.phase);
        const currentAlpha = Math.max(0.04, p.baseAlpha + pulse * 0.12);

        // Render depending on mood archetype
        if (mood === 'restless') {
          // Luminous rain streaks falling down
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x - 1, p.y + p.length);
          ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${currentAlpha * 0.8})`;
          ctx.lineWidth = 1.2;
          ctx.stroke();
        } else if (mood === 'hopeful-lonely') {
          // Soft glowing bokeh orbs
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * (1 + pulse * 0.2), 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${currentAlpha})`;
          if (enableShadowBlur) {
            ctx.shadowColor = `rgba(${r}, ${g}, ${b}, 0.5)`;
            ctx.shadowBlur = 12;
          }
          ctx.fill();
        } else if (mood === 'bittersweet') {
          // Drifting crystalline diamonds
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.beginPath();
          ctx.moveTo(0, -p.radius * 2);
          ctx.lineTo(p.radius, 0);
          ctx.lineTo(0, p.radius * 2);
          ctx.lineTo(-p.radius, 0);
          ctx.closePath();
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${currentAlpha})`;
          if (enableShadowBlur) {
            ctx.shadowColor = `rgba(${r}, ${g}, ${b}, 0.6)`;
            ctx.shadowBlur = 6;
          }
          ctx.fill();
          ctx.restore();
        } else {
          // Electric embers, determined aurora motes, or standard light motes
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${currentAlpha})`;
          if (enableShadowBlur) {
            ctx.shadowColor = `rgba(${r}, ${g}, ${b}, 0.7)`;
            ctx.shadowBlur = mood === 'electric' ? 10 : 6;
          }
          ctx.fill();
        }
      }
      if (enableShadowBlur) {
        ctx.shadowBlur = 0;
      }

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
  }, [colorAccent, mood, reducedMotion]);

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

function getMoodSpeedX(mood) {
  switch (mood) {
    case 'restless':
      return -0.3; // slight diagonal wind
    case 'electric':
      return (Math.random() - 0.5) * 0.8;
    case 'bittersweet':
      return 0.4 + Math.random() * 0.4;
    case 'hopeful-lonely':
      return (Math.random() - 0.5) * 0.25;
    default:
      return (Math.random() - 0.5) * 0.35;
  }
}

function getMoodSpeedY(mood) {
  switch (mood) {
    case 'restless':
      return 1.8 + Math.random() * 2.2; // Falling rain downward
    case 'electric':
      return -0.8 - Math.random() * 1.5; // Ascending sparks upward
    case 'determined':
      return -1.0 - Math.random() * 1.2; // Rising aurora
    case 'hopeful-lonely':
      return -0.1 - Math.random() * 0.2; // Slow gentle float
    default:
      return -0.15 - Math.random() * 0.3;
  }
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

function drawWave(ctx, w, h, time, yOffset, amplitude, color, alpha, mouse = null) {
  ctx.beginPath();
  ctx.moveTo(0, h);

  const baseY = h * yOffset;
  const amp = h * amplitude;
  const frequency = 0.0028;
  const speed = 0.75;

  for (let x = 0; x <= w; x += 3) {
    let mouseOffset = 0;
    if (mouse && mouse.active && mouse.x > 0) {
      const dist = Math.abs(x - mouse.x);
      if (dist < 180) {
        const influence = Math.cos((dist / 180) * (Math.PI / 2));
        mouseOffset = Math.sin(dist * 0.04 - time * 3.5) * (amp * 0.45) * influence;
      }
    }

    const y = baseY +
      Math.sin(x * frequency + time * speed) * amp +
      Math.sin(x * frequency * 1.6 + time * speed * 0.7) * amp * 0.45 +
      Math.sin(x * frequency * 0.6 + time * speed * 1.2) * amp * 0.25 +
      mouseOffset;
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

function drawStaticWaveform(ctx, color) {
  const w = window.innerWidth;
  const h = window.innerHeight;

  drawWave(ctx, w, h, 0, 0.32, 0.11, color, 0.15);
  drawWave(ctx, w, h, 0, 0.52, 0.08, color, 0.10);
  drawWave(ctx, w, h, 0, 0.74, 0.05, color, 0.06);
}
