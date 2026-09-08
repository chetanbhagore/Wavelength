import { motion } from 'framer-motion';

/**
 * Ambient aggregate resonance meter.
 * Shows collective room "energy" — never individual counts.
 */
export default function ResonanceMeter({ level, colorAccent }) {
  return (
    <div style={{
      padding: '0 16px',
      height: '4px',
      position: 'relative',
    }}>
      <div style={{
        width: '100%',
        height: '2px',
        borderRadius: '1px',
        backgroundColor: 'var(--color-border)',
        overflow: 'hidden',
      }}>
        <motion.div
          animate={{ width: `${level * 100}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          style={{
            height: '100%',
            borderRadius: '1px',
            background: `linear-gradient(90deg, ${colorAccent}66, ${colorAccent})`,
            boxShadow: level > 0.3 ? `0 0 12px ${colorAccent}44` : 'none',
          }}
        />
      </div>
    </div>
  );
}
