import { motion } from 'framer-motion';

/**
 * Primary "Tune In" CTA button with gradient fill and idle glow-pulse.
 */
export default function TuneInButton({ onClick, disabled }) {
  return (
    <motion.button
      className="btn-primary"
      onClick={onClick}
      disabled={disabled}
      animate={{
        boxShadow: [
          '0 0 20px rgba(124,92,255,0.25)',
          '0 0 40px rgba(124,92,255,0.4)',
          '0 0 20px rgba(124,92,255,0.25)',
        ],
      }}
      transition={{
        duration: 2.5,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      style={{
        minWidth: '200px',
        fontSize: '18px',
        padding: '16px 40px',
        position: 'relative',
        zIndex: 1,
      }}
    >
      Tune In
    </motion.button>
  );
}
