import { Activity, LogOut } from 'lucide-react';
import PropTypes from 'prop-types';
import { FrequencyShape } from '../types/propTypes';
import CountdownRing from './CountdownRing';

/**
 * Room header with frequency label, waveform icon, countdown ring, and graceful leave action.
 */
export default function RoomHeader({
  frequency,
  timeRemaining,
  totalDuration,
  isWarning,
  isUrgent,
  onRequestLeave,
}) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '12px 16px',
      borderBottom: '1px solid var(--color-border)',
      background: 'rgba(10, 8, 18, 0.85)',
      backdropFilter: 'blur(16px)',
      zIndex: 10,
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        minWidth: 0,
      }}>
        <div style={{
          width: '28px',
          height: '28px',
          borderRadius: '50%',
          background: `${frequency.colorAccent}18`,
          border: `1px solid ${frequency.colorAccent}33`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          <Activity
            size={14}
            strokeWidth={2}
            style={{ color: frequency.colorAccent }}
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: '14px',
            fontWeight: 600,
            color: 'var(--color-text-primary)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>
            {frequency.label}
          </span>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            color: frequency.colorAccent,
            opacity: 0.8,
          }}>
            {frequency.mhz} MHz
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <CountdownRing
          timeRemaining={timeRemaining}
          totalDuration={totalDuration}
          isWarning={isWarning}
          isUrgent={isUrgent}
        />

        {onRequestLeave && (
          <button
            type="button"
            onClick={onRequestLeave}
            aria-label="Leave room"
            title="Leave frequency"
            style={{
              width: '44px',
              height: '44px',
              minWidth: '44px',
              minHeight: '44px',
              borderRadius: '50%',
              border: '1px solid var(--color-border)',
              background: 'rgba(255, 255, 255, 0.03)',
              color: 'var(--color-text-secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255, 84, 112, 0.5)';
              e.currentTarget.style.color = '#FF5470';
              e.currentTarget.style.background = 'rgba(255, 84, 112, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-border)';
              e.currentTarget.style.color = 'var(--color-text-secondary)';
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
            }}
          >
            <LogOut size={16} strokeWidth={1.8} />
          </button>
        )}
      </div>
    </div>
  );
}

RoomHeader.propTypes = {
  /** Active frequency object */
  frequency: FrequencyShape.isRequired,
  /** Seconds remaining */
  timeRemaining: PropTypes.number.isRequired,
  /** Total session duration */
  totalDuration: PropTypes.number.isRequired,
  /** Whether in warning phase */
  isWarning: PropTypes.bool,
  /** Whether in urgent phase */
  isUrgent: PropTypes.bool,
  /** Callback to initiate leave */
  onRequestLeave: PropTypes.func.isRequired,
};
