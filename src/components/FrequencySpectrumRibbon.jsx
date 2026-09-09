import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import frequencies from '../data/frequencies.json';

/**
 * Horizontal radio frequency spectrum ribbon.
 * Displays all available frequencies as interactive spectrum nodes.
 * Allows instant 1-tap jumping to any frequency mood.
 */
export default function FrequencySpectrumRibbon({ currentIndex, onSelectIndex }) {
  return (
    <div
      role="tablist"
      aria-label="Frequency spectrum"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px',
        padding: '6px 10px',
        borderRadius: 'var(--radius-pill)',
        background: 'rgba(23, 27, 39, 0.6)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(12px)',
        maxWidth: '92vw',
        overflowX: 'auto',
        scrollbarWidth: 'none',
        userSelect: 'none',
      }}
    >
      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '10px',
          color: 'var(--color-text-secondary)',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          padding: '0 6px',
          opacity: 0.6,
        }}
      >
        Band
      </span>

      {frequencies.map((freq, index) => {
        const isActive = index === currentIndex;

        return (
          <button
            key={freq.id}
            role="tab"
            aria-selected={isActive}
            aria-label={freq.label}
            onClick={() => onSelectIndex(index)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: isActive ? '5px 12px' : '5px 8px',
              borderRadius: 'var(--radius-pill)',
              background: isActive
                ? `linear-gradient(135deg, rgba(255,255,255,0.08) 0%, ${freq.colorAccent}22 100%)`
                : 'transparent',
              border: isActive
                ? `1px solid ${freq.colorAccent}`
                : '1px solid transparent',
              boxShadow: isActive ? `0 0 14px ${freq.colorAccent}33` : 'none',
              cursor: 'pointer',
              outline: 'none',
              transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            {/* Indicator Dot */}
            <motion.span
              animate={{
                scale: isActive ? [1, 1.3, 1] : 1,
                opacity: isActive ? 1 : 0.45,
              }}
              transition={{
                scale: { duration: 1.8, repeat: isActive ? Infinity : 0 },
              }}
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: freq.colorAccent,
                boxShadow: isActive ? `0 0 8px ${freq.colorAccent}` : 'none',
              }}
            />

            {/* Micro mood tag on active */}
            {isActive && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  fontWeight: 600,
                  color: '#FFFFFF',
                  whiteSpace: 'nowrap',
                  letterSpacing: '0.02em',
                }}
              >
                {freq.mood}
              </motion.span>
            )}
          </button>
        );
      })}
    </div>
  );
}

FrequencySpectrumRibbon.propTypes = {
  /** Currently active frequency index */
  currentIndex: PropTypes.number.isRequired,
  /** Callback when user selects a frequency index */
  onSelectIndex: PropTypes.func.isRequired,
};
