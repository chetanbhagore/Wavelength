import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AmbientWaveformBackground from '../components/AmbientWaveformBackground';
import FloatingWhispers from '../components/FloatingWhispers';
import FrequencyDial from '../components/FrequencyDial';
import FrequencySpectrumRibbon from '../components/FrequencySpectrumRibbon';
import FrequencyReadout from '../components/FrequencyReadout';
import TuneInButton from '../components/TuneInButton';
import AmbientAudioToggle from '../components/AmbientAudioToggle';
import ConstellationRadar from '../components/ConstellationRadar';
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

  const [showGuidance, setShowGuidance] = useState(() => {
    try {
      return !sessionStorage.getItem('wavelength_tuner_guidance_seen');
    } catch {
      return true;
    }
  });

  const dismissGuidance = useCallback(() => {
    setShowGuidance((prev) => {
      if (!prev) return false;
      try {
        sessionStorage.setItem('wavelength_tuner_guidance_seen', 'true');
      } catch {
        // ignore storage error
      }
      return false;
    });
  }, []);

  // Auto-dismiss after 9 seconds if not interacted
  useEffect(() => {
    if (!showGuidance) return;
    const timer = setTimeout(dismissGuidance, 9000);
    return () => clearTimeout(timer);
  }, [showGuidance, dismissGuidance]);

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

      {/* 2. Floating Ethereal Whispers drifting across the ether with Magnetic Pull */}
      <FloatingWhispers
        frequency={currentFrequency}
        onPullToFrequency={(targetIdx) => {
          dismissGuidance();
          goTo(targetIdx);
        }}
      />

      {/* Header Bar: Manifesto Subtitle & Controls */}
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

        {/* Ambient Audio Toggle & Live Constellation Radar - Delayed entry for quiet first 3 seconds */}
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, delay: 2.8 }}
          style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
        >
          <AmbientAudioToggle frequency={currentFrequency} />
          <ConstellationRadar activeFrequency={currentFrequency} />
        </motion.div>
      </div>

      {/* 3. Main Circular Dial with Auto-Seek */}
      <div style={{ zIndex: 2 }}>
        <FrequencyDial
          currentIndex={currentIndex}
          totalFrequencies={totalFrequencies}
          currentFrequency={currentFrequency}
          lastVisitedFrequencyId={lastVisitedFrequencyId}
          onNext={() => {
            dismissGuidance();
            goNext();
          }}
          onPrev={() => {
            dismissGuidance();
            goPrev();
          }}
          onKeyDown={(e) => {
            dismissGuidance();
            handleKeyDown(e);
          }}
        />
      </div>

      {/* Disappearing Ambient Guidance Hint (Sprint 4 Issue #28) */}
      <AnimatePresence>
        {showGuidance && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.96 }}
            animate={{ opacity: 0.85, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, filter: 'blur(6px)', scale: 0.96 }}
            transition={{ duration: 0.5, delay: 3.2 }}
            style={{
              zIndex: 2,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 14px',
              borderRadius: 'var(--radius-pill)',
              background: 'rgba(255, 255, 255, 0.04)',
              border: `1px solid ${currentFrequency.colorAccent}33`,
              boxShadow: `0 4px 16px rgba(0, 0, 0, 0.4), 0 0 10px ${currentFrequency.colorAccent}18`,
              backdropFilter: 'blur(12px)',
              pointerEvents: 'none',
              marginTop: '-8px',
              marginBottom: '-4px',
            }}
          >
            <span
              style={{
                width: '5px',
                height: '5px',
                borderRadius: '50%',
                backgroundColor: currentFrequency.colorAccent,
                boxShadow: `0 0 6px ${currentFrequency.colorAccent}`,
              }}
            />
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                color: 'var(--color-text-secondary)',
                letterSpacing: '0.04em',
              }}
            >
              Rotate dial or use <strong style={{ color: '#FFFFFF' }}>← →</strong> keys to tune frequencies
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. Interactive Frequency Spectrum Ribbon */}
      <motion.div
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 2.2 }}
        style={{ zIndex: 2 }}
      >
        <FrequencySpectrumRibbon
          currentIndex={currentIndex}
          onSelectIndex={(idx) => {
            dismissGuidance();
            goTo(idx);
          }}
        />
      </motion.div>

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
