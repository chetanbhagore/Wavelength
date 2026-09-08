import { motion } from 'framer-motion';
import AmbientWaveformBackground from '../components/AmbientWaveformBackground';
import FrequencyDial from '../components/FrequencyDial';
import FrequencyReadout from '../components/FrequencyReadout';
import TuneInButton from '../components/TuneInButton';
import { useDial } from '../hooks/useDial';

/**
 * Tuner Screen — the entry point and only persistent "home."
 * No login, no profile. Just an analog dial with presence residue.
 */
export default function TunerScreen({
  onTuneIn,
  lastVisitedFrequencyId,
  frequencyHistory = {},
}) {
  const {
    currentIndex,
    currentFrequency,
    totalFrequencies,
    goNext,
    goPrev,
    handleKeyDown,
  } = useDial();

  const currentVisitInfo = frequencyHistory[currentFrequency.id] || null;

  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '28px',
      padding: '24px 16px',
      position: 'relative',
      zIndex: 1,
      minHeight: 'calc(100dvh - 60px)',
    }}>
      <AmbientWaveformBackground colorAccent={currentFrequency.colorAccent} />

      {/* Manifesto Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 0.55, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '13px',
          letterSpacing: '0.04em',
          color: 'var(--color-text-secondary)',
          textAlign: 'center',
          maxWidth: '360px',
          lineHeight: 1.4,
          marginTop: '-8px',
          userSelect: 'none',
        }}
      >
        not who you follow. who you're in sync with, right now.
      </motion.p>

      <FrequencyDial
        currentIndex={currentIndex}
        totalFrequencies={totalFrequencies}
        currentFrequency={currentFrequency}
        lastVisitedFrequencyId={lastVisitedFrequencyId}
        onNext={goNext}
        onPrev={goPrev}
        onKeyDown={handleKeyDown}
      />

      <FrequencyReadout
        frequency={currentFrequency}
        visitInfo={currentVisitInfo}
      />

      <TuneInButton onClick={() => onTuneIn(currentFrequency)} />
    </div>
  );
}

