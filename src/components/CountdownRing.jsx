import { useMemo } from 'react';
import { formatTime } from '../utils/formatTime';

/**
 * SVG circular countdown ring with color transitions.
 * Calm (violet/teal) normally, warm amber at <=60s, never alarming red.
 */
export default function CountdownRing({ timeRemaining, totalDuration, isWarning, isUrgent, size = 48 }) {
  const radius = (size - 6) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = timeRemaining / totalDuration;
  const dashOffset = circumference * (1 - progress);

  const strokeColor = useMemo(() => {
    if (isUrgent) return 'var(--color-accent-live)';
    if (isWarning) return 'var(--color-accent-live)';
    return 'var(--color-gradient-start)';
  }, [isWarning, isUrgent]);

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
              transition: 'stroke-dashoffset 1s linear, stroke 0.5s ease',
              filter: isWarning ? `drop-shadow(0 0 6px var(--color-accent-live))` : 'none',
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
          fontWeight: 500,
          color: isWarning || isUrgent ? 'var(--color-accent-live)' : 'var(--color-text-primary)',
          transition: 'color 0.5s ease',
          minWidth: '48px',
        }}
      >
        {timeStr}
      </span>
    </div>
  );
}
