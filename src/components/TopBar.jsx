import { Activity, MessageSquareQuote, Radio, Clock } from 'lucide-react';

/**
 * Minimal top bar with branding, screen navigation, and demo mode toggle.
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
      zIndex: 10,
    }}>
      <div
        onClick={appState !== 'room' && appState !== 'syncing' ? onNavigateToTuner : undefined}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          cursor: appState !== 'room' && appState !== 'syncing' ? 'pointer' : 'default',
          userSelect: 'none',
        }}
      >
        <Activity
          size={20}
          strokeWidth={1.5}
          style={{ color: 'var(--color-gradient-start)' }}
        />
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

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {appState === 'tuner' && (
          <>
            <button
              onClick={onToggleDemoMode}
              aria-label="Toggle Demo Mode"
              title={demoMode ? "Demo Mode: 90s session" : "Full Mode: 12m session"}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '6px 12px',
                borderRadius: 'var(--radius-pill)',
                border: demoMode ? '1px solid var(--color-accent-live)' : '1px solid var(--color-border)',
                background: demoMode ? 'rgba(255, 176, 32, 0.08)' : 'var(--color-surface)',
                color: demoMode ? 'var(--color-accent-live)' : 'var(--color-text-secondary)',
                fontSize: '12px',
                fontFamily: 'var(--font-mono)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              <Clock size={13} strokeWidth={1.5} />
              <span>{demoMode ? '90s Demo' : '12m Standard'}</span>
            </button>

            <button
              onClick={onNavigateToEchoWall}
            aria-label="View Echo Wall"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: 'var(--radius-pill)',
              border: '1px solid var(--color-border)',
              background: 'var(--color-surface)',
              color: 'var(--color-text-secondary)',
              fontSize: '13px',
              fontFamily: 'var(--font-body)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-gradient-start)';
              e.currentTarget.style.color = 'var(--color-text-primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-border)';
              e.currentTarget.style.color = 'var(--color-text-secondary)';
            }}
          >
            <MessageSquareQuote size={15} strokeWidth={1.5} />
            <span>Echo Wall</span>
          </button>
        </>
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
              border: '1px solid var(--color-border)',
              background: 'var(--color-surface)',
              color: 'var(--color-text-secondary)',
              fontSize: '13px',
              fontFamily: 'var(--font-body)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-gradient-start)';
              e.currentTarget.style.color = 'var(--color-text-primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-border)';
              e.currentTarget.style.color = 'var(--color-text-secondary)';
            }}
          >
            <Radio size={15} strokeWidth={1.5} />
            <span>Tuner</span>
          </button>
        )}
      </div>
    </header>
  );
}
