import { useState, useEffect } from 'react';
import { Activity, MessageSquareQuote, Radio } from 'lucide-react';

/**
 * Minimal top bar with branding and borderless glass navigation pills:
 * - Auto-dimming during active room presence to prioritize immersion (Issue #14).
 * - Discoverable Demo Mode pill with live indicator and Shift+D shortcut (Issue #34).
 * - Soft borderless glass navigation pills.
 */
export default function TopBar({
  appState,
  onNavigateToEchoWall,
  onNavigateToTuner,
  demoMode,
  onToggleDemoMode,
}) {
  const [isInactive, setIsInactive] = useState(false);
  const isDimmed = appState === 'room' && isInactive;

  // Auto-dimming when in active room state after 2.4s of inactivity (Issue #14)
  useEffect(() => {
    if (appState !== 'room') return;

    let timer = setTimeout(() => setIsInactive(true), 2400);

    const handleActivity = () => {
      setIsInactive(false);
      clearTimeout(timer);
      timer = setTimeout(() => setIsInactive(true), 2400);
    };

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('touchstart', handleActivity);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('touchstart', handleActivity);
    };
  }, [appState]);

  return (
    <header
      onMouseEnter={() => setIsDimmed(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 24px',
        position: 'relative',
        zIndex: 20,
        opacity: isDimmed ? 0.22 : 1,
        transition: 'opacity 0.65s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      {/* Brand logo & discrete demo trigger */}
      <div
        onClick={appState !== 'room' && appState !== 'syncing' ? onNavigateToTuner : undefined}
        onDoubleClick={onToggleDemoMode}
        title={demoMode ? "Wavelength (Demo Mode: 90s • Double-click or Shift+D to toggle)" : "Wavelength (Double-click or Shift+D for 90s demo)"}
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

      {/* Right Controls: Demo Mode Pill & Navigation Pills */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {/* Discoverable Demo Mode Trigger Pill (Issue #34) */}
        <button
          onClick={onToggleDemoMode}
          title="Click or press Shift+D to toggle 90-second Demo Mode"
          aria-label={demoMode ? "Switch to Standard 12-minute sessions" : "Switch to 90-second Demo sessions"}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 10px',
            borderRadius: 'var(--radius-pill)',
            border: demoMode ? '1px solid rgba(255, 176, 32, 0.45)' : '1px solid rgba(255, 255, 255, 0.08)',
            background: demoMode ? 'rgba(255, 176, 32, 0.09)' : 'rgba(255, 255, 255, 0.02)',
            color: demoMode ? 'var(--color-accent-live)' : 'var(--color-text-secondary)',
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '0.04em',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = demoMode ? 'var(--color-accent-live)' : 'rgba(255, 255, 255, 0.2)';
            e.currentTarget.style.background = demoMode ? 'rgba(255, 176, 32, 0.16)' : 'rgba(255, 255, 255, 0.06)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = demoMode ? 'rgba(255, 176, 32, 0.45)' : 'rgba(255, 255, 255, 0.08)';
            e.currentTarget.style.background = demoMode ? 'rgba(255, 176, 32, 0.09)' : 'rgba(255, 255, 255, 0.02)';
          }}
        >
          <span style={{
            width: '5px',
            height: '5px',
            borderRadius: '50%',
            backgroundColor: demoMode ? 'var(--color-accent-live)' : 'rgba(255, 255, 255, 0.3)',
            boxShadow: demoMode ? '0 0 6px var(--color-accent-live)' : 'none',
          }} />
          <span>{demoMode ? 'DEMO: 90s' : 'LIVE: 12m'}</span>
          <span style={{ opacity: 0.55, fontSize: '9px', fontWeight: 400 }}>⇧D</span>
        </button>

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


