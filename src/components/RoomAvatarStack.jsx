import { motion } from 'framer-motion';

/**
 * Row of pseudonymous participant avatars with organic individuality (Sprint 2 Issues #9 & #19):
 * - Varied breathing pulse rates, aura diameters, and subtle border radius geometry
 * - Staggered spring overshoot entrance with blur-to-sharp emergence
 * - Dynamic presence state: accelerated luminous pulse when participant is typing
 * - Distinct avatar scale variations and subtle hue tinting
 */
export default function RoomAvatarStack({ participants, colorAccent, typingParticipant, surgeTrigger = 0 }) {
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
        const pulseDuration = 2.1 + (index % 4) * 0.45;
        const avatarSize = index % 3 === 0 ? 42 : index % 3 === 1 ? 38 : 40;
        const participantColor = p.avatarColor || colorAccent;
        const initials = p.displayName?.split('_')?.[1] || p.displayName?.slice(0, 2) || '??';
        const isTyping = typingParticipant && (typingParticipant.id === p.id || typingParticipant.displayName === p.displayName);

        // Organic subtle geometry asymmetry for each stranger
        const borderRadius = index % 3 === 0 ? '48%' : index % 3 === 1 ? '52%' : '50%';

        return (
          <motion.div
            key={p.id}
            initial={{ scale: 0.4, opacity: 0, filter: 'blur(8px)', y: -16 }}
            animate={surgeTrigger > 0 ? {
              scale: [1, 1.09, 1],
              y: [0, -3, 0],
              opacity: 1,
            } : { scale: 1, opacity: 1, filter: 'blur(0px)', y: 0 }}
            transition={surgeTrigger > 0 ? {
              duration: 0.5,
              delay: index * 0.04,
              ease: 'easeOut',
            } : {
              type: 'spring',
              stiffness: 300,
              damping: 18,
              delay: index * 0.12,
            }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <div style={{ position: 'relative' }}>
              {/* Individual organic ambient breathing ring & typing surge */}
              <motion.div
                animate={{
                  boxShadow: isTyping
                    ? [
                        `0 0 0 2px ${participantColor}, 0 0 16px ${participantColor}88`,
                        `0 0 0 4px ${participantColor}66, 0 0 24px ${participantColor}`,
                        `0 0 0 2px ${participantColor}, 0 0 16px ${participantColor}88`,
                      ]
                    : [
                        `0 0 0 1.5px ${participantColor}44, 0 0 8px ${participantColor}22`,
                        `0 0 0 3.5px ${participantColor}22, 0 0 14px ${participantColor}33`,
                        `0 0 0 1.5px ${participantColor}44, 0 0 8px ${participantColor}22`,
                      ],
                  scale: isTyping ? [1, 1.08, 1] : [1, 1.03, 1],
                }}
                transition={{
                  duration: isTyping ? 1.0 : pulseDuration,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: (index * 0.35) % 1.5,
                }}
                style={{
                  width: `${avatarSize}px`,
                  height: `${avatarSize}px`,
                  borderRadius,
                  background: isTyping
                    ? `linear-gradient(135deg, ${participantColor}66 0%, ${participantColor}33 100%)`
                    : `linear-gradient(135deg, ${participantColor}40 0%, ${participantColor}18 100%)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: avatarSize > 40 ? '14px' : '13px',
                  fontWeight: 600,
                  color: isTyping ? '#FFFFFF' : participantColor,
                  fontFamily: 'var(--font-mono)',
                  border: isTyping ? `1.5px solid ${participantColor}` : `1px solid ${participantColor}33`,
                  backdropFilter: 'blur(8px)',
                  transition: 'all 0.3s ease',
                }}
              >
                {initials}
              </motion.div>

              {/* Online indicator / typing beacon */}
              <motion.span
                animate={isTyping ? { scale: [1, 1.4, 1], backgroundColor: ['#00F0FF', '#FFFFFF', '#00F0FF'] } : {}}
                transition={{ duration: 0.8, repeat: Infinity }}
                style={{
                  position: 'absolute',
                  bottom: '1px',
                  right: '1px',
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: isTyping ? '#FFFFFF' : '#00F0FF',
                  boxShadow: isTyping ? '0 0 8px #FFFFFF' : '0 0 6px #00F0FF',
                  border: '1px solid rgba(0, 0, 0, 0.8)',
                }}
                title={isTyping ? `${p.displayName} is typing...` : `${p.displayName} present`}
              />
            </div>

            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              color: isTyping ? '#FFFFFF' : 'var(--color-text-secondary)',
              whiteSpace: 'nowrap',
              letterSpacing: '-0.01em',
              opacity: isTyping ? 1 : 0.85,
              transition: 'color 0.2s ease',
            }}>
              {p.displayName}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
}
