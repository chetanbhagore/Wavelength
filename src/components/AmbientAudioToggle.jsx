import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { VolumeX } from 'lucide-react';
import { ambientDrone } from '../utils/ambientAudio';

/**
 * AmbientAudioToggle — Discreet floating pill to enable analog ether drone.
 * Dynamically shifts binaural pitch when frequency mood changes.
 */
export default function AmbientAudioToggle({ frequency }) {
  const [isPlaying, setIsPlaying] = useState(false);

  const handleToggle = () => {
    const nextState = ambientDrone.toggle(frequency?.mood || 'restless');
    setIsPlaying(nextState);
  };

  // When frequency changes, smoothly morph the drone harmonic if audio is active
  useEffect(() => {
    if (isPlaying && frequency?.mood) {
      ambientDrone.setMood(frequency.mood);
    }
  }, [frequency?.mood, isPlaying]);

  // Clean up when unmounting
  useEffect(() => {
    return () => {
      ambientDrone.stop();
    };
  }, []);

  return (
    <motion.button
      type="button"
      onClick={handleToggle}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={isPlaying ? 'Mute ambient ether drone' : 'Play ambient ether drone'}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 16px',
        minHeight: '44px',
        borderRadius: 'var(--radius-pill)',
        background: isPlaying ? 'rgba(23, 27, 39, 0.9)' : 'rgba(23, 27, 39, 0.5)',
        border: isPlaying
          ? `1px solid ${frequency.colorAccent}88`
          : '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: isPlaying
          ? `0 0 16px ${frequency.colorAccent}25`
          : 'none',
        backdropFilter: 'blur(12px)',
        color: isPlaying ? '#FFFFFF' : 'var(--color-text-secondary)',
        cursor: 'pointer',
        outline: 'none',
        transition: 'all 0.25s ease',
      }}
    >
      {isPlaying ? (
        <>
          {/* Animated Equalizer Wave Bars */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '2px', height: '12px' }}>
            {[0.4, 0.9, 0.6, 0.8].map((initHeight, idx) => (
              <motion.span
                key={idx}
                animate={{
                  scaleY: [initHeight, 1.2, 0.3, initHeight],
                }}
                transition={{
                  duration: 0.7 + idx * 0.15,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                style={{
                  width: '2px',
                  height: '10px',
                  borderRadius: '1px',
                  backgroundColor: frequency.colorAccent,
                  transformOrigin: 'bottom',
                  display: 'inline-block',
                }}
              />
            ))}
          </div>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.04em',
            }}
          >
            Ether Drone
          </span>
        </>
      ) : (
        <>
          <VolumeX size={13} style={{ opacity: 0.6 }} />
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              letterSpacing: '0.04em',
              opacity: 0.75,
            }}
          >
            Ambient Sound
          </span>
        </>
      )}
    </motion.button>
  );
}
