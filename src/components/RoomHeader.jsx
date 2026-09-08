import { Activity, LogOut } from 'lucide-react';
import CountdownRing from './CountdownRing';

/**
 * Room header with frequency label, waveform icon, countdown ring, and leave action.
 */
export default function RoomHeader({ frequency, timeRemaining, totalDuration, isWarning, isUrgent, onLeave }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '12px 16px',
      borderBottom: '1px solid var(--color-border)',
      background: 'var(--color-surface)',
      backdropFilter: 'blur(12px)',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        minWidth: 0,
      }}>
        <Activity
          size={16}
          strokeWidth={1.5}
          style={{ color: frequency.colorAccent, flexShrink: 0 }}
        />
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
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <CountdownRing
          timeRemaining={timeRemaining}
          totalDuration={totalDuration}
          isWarning={isWarning}
          isUrgent={isUrgent}
        />

        {onLeave && (
          <button
            onClick={onLeave}
            aria-label="Leave room"
            title="Leave frequency"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              border: '1px solid var(--color-border)',
              background: 'transparent',
              color: 'var(--color-text-secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-error)';
              e.currentTarget.style.color = 'var(--color-error)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-border)';
              e.currentTarget.style.color = 'var(--color-text-secondary)';
            }}
          >
            <LogOut size={15} strokeWidth={1.5} />
          </button>
        )}
      </div>
    </div>
  );
}
