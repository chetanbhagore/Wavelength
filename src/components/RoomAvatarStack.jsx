import { motion } from 'framer-motion';

/**
 * Row of pseudonymous participant avatars with staggered pulse-in animation.
 * Each avatar has an ambient ring animation while "active."
 */
export default function RoomAvatarStack({ participants, colorAccent }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '12px',
      padding: '16px',
      flexWrap: 'wrap',
    }}>
      {participants.map((p, index) => (
        <motion.div
          key={p.id}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: 'spring',
            stiffness: 400,
            damping: 20,
            delay: index * 0.08,
          }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <div style={{ position: 'relative' }}>
            {/* Ambient ring */}
            <motion.div
              animate={{
                boxShadow: [
                  `0 0 0 2px ${colorAccent}33`,
                  `0 0 0 4px ${colorAccent}22`,
                  `0 0 0 2px ${colorAccent}33`,
                ],
              }}
              transition={{
                duration: 2 + (index % 3) * 0.4,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: (index * 0.3) % 1.5,
              }}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${colorAccent}40, ${colorAccent}20)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                fontWeight: 600,
                color: colorAccent,
                fontFamily: 'var(--font-mono)',
              }}
            >
              {p.displayName?.split('_')?.[1] || p.displayName?.slice(0, 2) || '??'}
            </motion.div>
          </div>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            color: 'var(--color-text-secondary)',
            whiteSpace: 'nowrap',
          }}>
            {p.displayName}
          </span>
        </motion.div>
      ))}
    </div>
  );
}
