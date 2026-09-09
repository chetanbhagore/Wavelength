import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { FrequencyShape } from '../types/propTypes';
import { motion } from 'framer-motion';
import { Radio, LogOut, HeartHandshake } from 'lucide-react';
import { ambientDrone } from '../utils/ambientAudio';

/**
 * DepartureModal (Issue #29)
 * Weighty, poetic exit confirmation reinforcing the sacredness of the remaining time.
 * Leaving severs connection to the synchronous constellation.
 */
export default function DepartureModal({
  frequency,
  timeRemaining = 0,
  onStay,
  onLeaveAndEcho,
  onDirectLeave,
}) {
  const modalRef = useRef(null);

  // Play subtle mechanical audio click on modal appearance
  useEffect(() => {
    ambientDrone.playDetentClick();
  }, []);

  // Keyboard accessibility: Escape to cancel
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onStay();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onStay]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(3, 4, 8, 0.88)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        zIndex: 100,
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onStay();
      }}
    >
      <motion.div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="departure-title"
        aria-describedby="departure-desc"
        initial={{ scale: 0.92, y: 16, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.92, y: 12, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 380, damping: 26 }}
        style={{
          maxWidth: '420px',
          width: '100%',
          background: 'rgba(17, 19, 28, 0.98)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 'var(--radius-lg)',
          padding: '28px 24px',
          boxShadow: `0 24px 60px rgba(0, 0, 0, 0.85), 0 0 40px ${frequency?.colorAccent || '#7C5CFF'}22`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: '18px',
          position: 'relative',
        }}
      >
        {/* Glowing frequency beacon icon */}
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: 'rgba(255, 84, 112, 0.12)',
            border: '1px solid rgba(255, 84, 112, 0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FF5470',
            boxShadow: '0 0 20px rgba(255, 84, 112, 0.25)',
          }}
        >
          <LogOut size={22} strokeWidth={1.8} />
        </div>

        <div>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: frequency?.colorAccent || 'var(--color-accent-live)',
              display: 'block',
              marginBottom: '6px',
            }}
          >
            {frequency?.mhz || '107.9 MHz'} • {frequency?.label || 'Ethereal'}
          </span>
          <h2
            id="departure-title"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '20px',
              fontWeight: 600,
              color: 'var(--color-text-primary)',
              margin: '0 0 8px 0',
              lineHeight: 1.3,
            }}
          >
            Sever Connection to this Constellation?
          </h2>
          <p
            id="departure-desc"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '13.5px',
              color: 'var(--color-text-secondary)',
              lineHeight: 1.55,
              margin: 0,
            }}
          >
            This room is ephemeral. Leaving early dissolves this synchronous constellation. 
            {timeRemaining > 0 && (
              <span style={{ display: 'block', marginTop: '6px', color: 'rgba(255, 255, 255, 0.7)' }}>
                Only <strong style={{ color: '#FFF' }}>{timeRemaining}s</strong> remain before collective dissolution.
              </span>
            )}
          </p>
        </div>

        {/* Action button hierarchy */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            width: '100%',
            marginTop: '6px',
          }}
        >
          {/* Primary Action: Stay */}
          <button
            onClick={() => {
              ambientDrone.playDetentClick();
              onStay();
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '12px 18px',
              borderRadius: 'var(--radius-pill)',
              background: 'linear-gradient(135deg, var(--color-gradient-start), var(--color-gradient-end))',
              border: 'none',
              color: '#FFFFFF',
              fontFamily: 'var(--font-body)',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 4px 20px rgba(124, 92, 255, 0.35)',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.02)';
              e.currentTarget.style.boxShadow = '0 6px 24px rgba(124, 92, 255, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(124, 92, 255, 0.35)';
            }}
          >
            <HeartHandshake size={16} strokeWidth={2} />
            <span>Stay in Resonance</span>
          </button>

          {/* Secondary Action: Leave Echo & Fade */}
          <button
            onClick={() => {
              ambientDrone.playDetentClick();
              onLeaveAndEcho();
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '10px 18px',
              borderRadius: 'var(--radius-pill)',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: 'var(--color-text-primary)',
              fontFamily: 'var(--font-body)',
              fontSize: '13px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.09)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
            }}
          >
            <Radio size={14} strokeWidth={1.8} />
            <span>Leave Residual Echo & Depart</span>
          </button>

          {/* Tertiary Action: Direct return */}
          <button
            onClick={() => {
              ambientDrone.playDetentClick();
              onDirectLeave();
            }}
            style={{
              padding: '6px 12px',
              background: 'transparent',
              border: 'none',
              color: 'var(--color-text-secondary)',
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              cursor: 'pointer',
              opacity: 0.7,
              transition: 'opacity 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '1';
              e.currentTarget.style.textDecoration = 'underline';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '0.7';
              e.currentTarget.style.textDecoration = 'none';
            }}
          >
            sever silently without echo →
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

DepartureModal.propTypes = {
  /** The active frequency */
  frequency: FrequencyShape.isRequired,
  /** Seconds remaining in room */
  timeRemaining: PropTypes.number,
  /** Stay in the room */
  onStay: PropTypes.func.isRequired,
  /** Leave and drop an echo */
  onLeaveAndEcho: PropTypes.func.isRequired,
  /** Leave directly without echo */
  onDirectLeave: PropTypes.func.isRequired,
};
