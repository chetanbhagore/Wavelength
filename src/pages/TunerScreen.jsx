import AmbientWaveformBackground from '../components/AmbientWaveformBackground';
import FrequencyDial from '../components/FrequencyDial';
import FrequencyReadout from '../components/FrequencyReadout';
import TuneInButton from '../components/TuneInButton';
import { useDial } from '../hooks/useDial';

/**
 * Tuner Screen — the entry point and only persistent "home."
 * No login, no profile. Just a dial.
 */
export default function TunerScreen({ onTuneIn }) {
  const {
    currentIndex,
    currentFrequency,
    totalFrequencies,
    goNext,
    goPrev,
    handleKeyDown,
  } = useDial();

  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '32px',
      padding: '24px 16px',
      position: 'relative',
      zIndex: 1,
      minHeight: 'calc(100dvh - 60px)',
    }}>
      <AmbientWaveformBackground colorAccent={currentFrequency.colorAccent} />

      <FrequencyDial
        currentIndex={currentIndex}
        totalFrequencies={totalFrequencies}
        currentFrequency={currentFrequency}
        onNext={goNext}
        onPrev={goPrev}
        onKeyDown={handleKeyDown}
      />

      <FrequencyReadout frequency={currentFrequency} />

      <TuneInButton onClick={() => onTuneIn(currentFrequency)} />
    </div>
  );
}
