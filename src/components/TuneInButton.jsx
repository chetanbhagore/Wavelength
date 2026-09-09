import { motion } from 'framer-motion';
import { Radio } from 'lucide-react';

/**
 * Primary "Tune In" CTA button with obsidian glass resting state,
 * dynamic gradient expansion on hover, and breathing aura.
 */
export default function TuneInButton({ onClick, disabled }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label="Tune into active frequency"
      initial={{ opacity: 0, y: 8 }}
      animate={{
        opacity: 1,
        y: 0,
        boxShadow: [
          '0 0 24px rgba(124, 92, 255, 0.25)',
          '0 0 38px rgba(255, 79, 163, 0.35)',
          '0 0 24px rgba(124, 92, 255, 0.25)',
        ],
      }}
      transition={{
        boxShadow: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
        default: { duration: 0.4 },
      }}
      whileHover={{
        scale: 1.04,
        boxShadow: '0 0 50px rgba(255, 79, 163, 0.55), 0 0 20px rgba(124, 92, 255, 0.5)',
      }}
      whileTap={{ scale: 0.97 }}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        minWidth: '220px',
        padding: '16px 42px',
        borderRadius: 'var(--radius-pill)',
        border: '1px solid rgba(255, 255, 255, 0.18)',
        background: 'linear-gradient(135deg, rgba(23, 27, 39, 0.95) 0%, rgba(16, 19, 28, 0.95) 100%)',
        color: '#FFFFFF',
        fontFamily: 'var(--font-display)',
        fontSize: '17px',
        fontWeight: 600,
        letterSpacing: '0.04em',
        cursor: 'pointer',
        position: 'relative',
        zIndex: 1,
        transition: 'all 0.3s ease',
      }}
    >
      <Radio size={18} strokeWidth={2} style={{ color: 'var(--color-gradient-start)' }} />
      <span>Tune In</span>
    </motion.button>
  );
}
