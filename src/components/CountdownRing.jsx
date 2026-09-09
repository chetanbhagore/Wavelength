import { useMemo } from 'react';
import { formatTime } from '../utils/formatTime';

/**
 * SVG circular countdown ring with progressive sunset color transitions:
 * >90s: Calm Ethereal Violet (#7C5CFF)
 * 90s - 30s: Warm Amber Sunset (#FFB020)
 * <30s: Twilight Crimson (#FF5470)
 */
export default function CountdownRing({ timeRemaining, totalDuration, isWarning, isUrgent, size = 48 }) {
  const radius = (size - 6) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = totalDuration > 0 ? timeRemaining / totalDuration : 0;
  const dashOffset = circumference * (1 - progress);

  const { strokeColor, glowFilter, statusPhase } = useMemo(() => {
    if (timeRemaining <= 30 || isUrgent) {
      return {
        strokeColor: '#FF5470',
        glowFilter: 'drop-shadow(0 0 8px rgba(255, 84, 112, 0.6))',
        statusPhase: 'urgent',
      };
    }
    if (timeRemaining <= 90 || isWarning) {
      return {
        strokeColor: '#FFB020',
        glowFilter: 'drop-shadow(0 0 6px rgba(255, 176, 32, 0.45))',
        statusPhase: 'warning',
      };
    }
    return {
      strokeColor: '#7C5CFF',
      glowFilter: 'drop-shadow(0 0 4px rgba(124, 92, 255, 0.3))',
      statusPhase: 'calm',
    };
  }, [timeRemaining, isWarning, isUrgent]);

  const timeStr = formatTime(timeRemaining);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    }}>
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          {/* Background track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="var(--color-border)"
            strokeWidth="3"
            opacity={0.5}
          />
          {/* Progress ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={strokeColor}
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            style={{
              transition: 'stroke-dashoffset 1s linear, stroke 0.8s ease, filter 0.8s ease',
              filter: glowFilter,
            }}
          />
        </svg>
      </div>
      <span
        role="timer"
        aria-live="off"
        aria-label={`${formatTime(timeRemaining)} remaining`}
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '15px',
          fontWeight: 600,
          color: strokeColor,
          transition: 'color 0.8s ease',
          minWidth: '48px',
          letterSpacing: '-0.02em',
        }}
        data-phase={statusPhase}
      >
        {timeStr}
      </span>
    </div>
  );
}

CountdownRing.propTypes = {
  /** Seconds remaining */
  timeRemaining: PropTypes.number.isRequired,
  /** Total session duration in seconds */
  totalDuration: PropTypes.number.isRequired,
  /** Whether in warning phase */
  isWarning: PropTypes.bool,
  /** Whether in urgent phase */
  isUrgent: PropTypes.bool,
  /** Ring diameter in pixels */
  size: PropTypes.number,
};
