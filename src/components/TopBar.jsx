import { Activity, MessageSquareQuote, Radio } from 'lucide-react';

/**
 * Minimal top bar with branding and borderless glass navigation pills:
 * - Soft borderless glass buttons that blend harmoniously into the header void (Issue #13).
 * - Discrete double-click or long-press on logo toggles demo mode (Issue #29).
 */
export default function TopBar({
  appState,
  onNavigateToEchoWall,
  onNavigateToTuner,
  demoMode,
  onToggleDemoMode,
}) {
  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '16px 24px',
      position: 'relative',
      zIndex: 20,
    }}>
      {/* Brand logo & discrete demo trigger */}
      <div
        onClick={appState !== 'room' && appState !== 'syncing' ? onNavigateToTuner : undefined}
        onDoubleClick={onToggleDemoMode}
        title={demoMode ? "Wavelength (Demo Mode Active: 90s • Double-click or Shift+D to toggle)" : "Wavelength (Double-click or Shift+D for 90s demo)"}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          cursor: appState !== 'room' && appState !== 'syncing' ? 'pointer' : 'default',
          userSelect: 'none',
        }}
      >
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <Activity
            size={20}
            strokeWidth={1.8}
            style={{ color: 'var(--color-gradient-start)' }}
          />
          {/* Subtle demo active indicator dot */}
          {demoMode && (
            <span
              style={{
                position: 'absolute',
                top: '-2px',
                right: '-2px',
                width: '5px',
                height: '5px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-accent-live)',
                boxShadow: '0 0 6px var(--color-accent-live)',
              }}
              title="Demo Mode: 90s sessions active"
            />
          )}
        </div>
        <span style={{
          fontFamily: 'var(--font-display)',
          fontSize: '16px',
          fontWeight: 700,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: 'var(--color-text-primary)',
        }}>
          Wavelength
        </span>
      </div>

      {/* Borderless Glass Navigation Pills */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {appState === 'tuner' && (
          <button
            onClick={onNavigateToEchoWall}
            aria-label="View Echo Wall"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: 'var(--radius-pill)',
              border: '1px solid rgba(255, 255, 255, 0.07)',
              background: 'rgba(255, 255, 255, 0.03)',
              backdropFilter: 'blur(12px)',
              color: 'var(--color-text-secondary)',
              fontSize: '13px',
              fontFamily: 'var(--font-body)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(124, 92, 255, 0.4)';
              e.currentTarget.style.color = 'var(--color-text-primary)';
              e.currentTarget.style.background = 'rgba(124, 92, 255, 0.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.07)';
              e.currentTarget.style.color = 'var(--color-text-secondary)';
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
            }}
          >
            <MessageSquareQuote size={14} strokeWidth={1.8} />
            <span>Echo Wall</span>
          </button>
        )}

        {appState === 'echoWall' && (
          <button
            onClick={onNavigateToTuner}
            aria-label="Return to Tuner"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: 'var(--radius-pill)',
              border: '1px solid rgba(255, 255, 255, 0.07)',
              background: 'rgba(255, 255, 255, 0.03)',
              backdropFilter: 'blur(12px)',
              color: 'var(--color-text-secondary)',
              fontSize: '13px',
              fontFamily: 'var(--font-body)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(124, 92, 255, 0.4)';
              e.currentTarget.style.color = 'var(--color-text-primary)';
              e.currentTarget.style.background = 'rgba(124, 92, 255, 0.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.07)';
              e.currentTarget.style.color = 'var(--color-text-secondary)';
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
            }}
          >
            <Radio size={14} strokeWidth={1.8} />
            <span>Tuner</span>
          </button>
        )}
      </div>
    </header>
  );
}

