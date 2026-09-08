import { motion } from 'framer-motion';

/**
 * Single echo line display — anonymous, no attribution, no counter.
 */
export default function EchoCard({ echo, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.03, ease: 'easeOut' }}
      style={{
        padding: '16px 20px',
        borderRadius: 'var(--radius-md)',
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
        cursor: 'default',
      }}
      whileHover={{
        borderColor: 'var(--color-text-secondary)',
        boxShadow: '0 0 20px rgba(124, 92, 255, 0.1)',
      }}
    >
      <p style={{
        fontFamily: 'var(--font-body)',
        fontSize: '15px',
        color: 'var(--color-text-primary)',
        lineHeight: 1.5,
        fontStyle: 'italic',
      }}>
        "{echo.text}"
      </p>
    </motion.div>
  );
}
