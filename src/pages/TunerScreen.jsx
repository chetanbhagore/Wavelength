import { motion } from 'framer-motion';
import AmbientWaveformBackground from '../components/AmbientWaveformBackground';
import FloatingWhispers from '../components/FloatingWhispers';
import FrequencyDial from '../components/FrequencyDial';
import FrequencySpectrumRibbon from '../components/FrequencySpectrumRibbon';
import FrequencyReadout from '../components/FrequencyReadout';
import TuneInButton from '../components/TuneInButton';
import AmbientAudioToggle from '../components/AmbientAudioToggle';
import { useDial } from '../hooks/useDial';

/**
 * Tuner Screen — the entry point and only persistent "home."
 * No login, no profile. Just an analog dial with presence residue,
 * living mood-reactive weather canvas, floating ethereal whispers,
 * an interactive spectrum band, and analog drone soundscape.
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
    goTo,
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
      gap: '20px',
      padding: '16px',
      position: 'relative',
      zIndex: 1,
      minHeight: 'calc(100dvh - 64px)',
      overflow: 'hidden',
    }}>
      {/* 1. Dynamic Mood-Themed Canvas Weather (Rain, Embers, Bokeh, Prisms) */}
      <AmbientWaveformBackground
        colorAccent={currentFrequency.colorAccent}
        mood={currentFrequency.mood}
      />

      {/* 2. Floating Ethereal Whispers drifting across the ether */}
      <FloatingWhispers frequency={currentFrequency} />

      {/* Header Bar: Manifesto Subtitle & Ambient Audio Drone Toggle */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
        zIndex: 2,
      }}>
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 0.6, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '13px',
            letterSpacing: '0.04em',
            color: 'var(--color-text-secondary)',
            textAlign: 'center',
            maxWidth: '380px',
            lineHeight: 1.4,
            userSelect: 'none',
          }}
        >
          not who you follow. who you're in sync with, right now.
        </motion.p>

        <AmbientAudioToggle frequency={currentFrequency} />
      </div>

      {/* 3. Main Circular Dial with Auto-Seek */}
      <div style={{ zIndex: 2 }}>
        <FrequencyDial
          currentIndex={currentIndex}
          totalFrequencies={totalFrequencies}
          currentFrequency={currentFrequency}
          lastVisitedFrequencyId={lastVisitedFrequencyId}
          onNext={goNext}
          onPrev={goPrev}
          onKeyDown={handleKeyDown}
        />
      </div>

      {/* 4. Interactive Frequency Spectrum Ribbon */}
      <div style={{ zIndex: 2 }}>
        <FrequencySpectrumRibbon
          currentIndex={currentIndex}
          onSelectIndex={goTo}
        />
      </div>

      {/* 5. Frequency Readout & Stochastic Fluctuation */}
      <div style={{ zIndex: 2 }}>
        <FrequencyReadout
          frequency={currentFrequency}
          visitInfo={currentVisitInfo}
        />
      </div>

      {/* 6. Primary "Tune In" Action */}
      <div style={{ zIndex: 2 }}>
        <TuneInButton onClick={() => onTuneIn(currentFrequency)} />
      </div>
    </div>
  );
}
