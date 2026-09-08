import { motion } from 'framer-motion';

/**
 * Row of pseudonymous participant avatars with organic individuality:
 * - Varied breathing pulse rates and ambient glow diameters
 * - Dynamic spring overshoot entrance
 * - Distinct avatar scale variations and subtle hue tinting
 */
export default function RoomAvatarStack({ participants, colorAccent }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '14px',
      padding: '12px 16px 8px',
      flexWrap: 'wrap',
    }}>
      {participants.map((p, index) => {
        // Individualized rhythm and dimensions based on index & id
        const pulseDuration = 2.0 + (index % 4) * 0.45;
        const avatarSize = index % 3 === 0 ? 42 : index % 3 === 1 ? 38 : 40;
        const participantColor = p.avatarColor || colorAccent;
        const initials = p.displayName?.split('_')?.[1] || p.displayName?.slice(0, 2) || '??';

        return (
          <motion.div
            key={p.id}
            initial={{ scale: 0, opacity: 0, y: -12 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{
              type: 'spring',
              stiffness: 280,
              damping: 15,
              delay: index * 0.1,
            }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <div style={{ position: 'relative' }}>
              {/* Individual organic ambient breathing ring */}
              <motion.div
                animate={{
                  boxShadow: [
                    `0 0 0 1.5px ${participantColor}44, 0 0 8px ${participantColor}22`,
                    `0 0 0 3.5px ${participantColor}22, 0 0 14px ${participantColor}33`,
                    `0 0 0 1.5px ${participantColor}44, 0 0 8px ${participantColor}22`,
                  ],
                  scale: [1, 1.03, 1],
                }}
                transition={{
                  duration: pulseDuration,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: (index * 0.4) % 1.6,
                }}
                style={{
                  width: `${avatarSize}px`,
                  height: `${avatarSize}px`,
                  borderRadius: '50%',
                  background: `linear-gradient(135deg, ${participantColor}40 0%, ${participantColor}18 100%)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: avatarSize > 40 ? '14px' : '13px',
                  fontWeight: 600,
                  color: participantColor,
                  fontFamily: 'var(--font-mono)',
                  border: `1px solid ${participantColor}33`,
                  backdropFilter: 'blur(8px)',
                }}
              >
                {initials}
              </motion.div>

              {/* Online micro-sparkle dot */}
              <span style={{
                position: 'absolute',
                bottom: '1px',
                right: '1px',
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: '#00F0FF',
                boxShadow: '0 0 6px #00F0FF',
                border: '1px solid rgba(0, 0, 0, 0.8)',
              }} />
            </div>

            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              color: 'var(--color-text-secondary)',
              whiteSpace: 'nowrap',
              letterSpacing: '-0.01em',
              opacity: 0.85,
            }}>
              {p.displayName}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
}

