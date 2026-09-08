import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Radio } from 'lucide-react';
import FrequencyFilterChips from '../components/FrequencyFilterChips';
import EchoCard from '../components/EchoCard';
import seedEchoes from '../data/seedEchoes.json';
import frequencies from '../data/frequencies.json';
import { useLocalStorage } from '../hooks/useLocalStorage';

/**
 * Echo Wall — browse accumulated anonymous echoes for a frequency:
 * - Chronological, capped, zero vanity metrics or like buttons.
 * - Organic card tilts and mood-reactive filter chips (Issues #12 & #26).
 * - Poetic per-mood empty states (Issue #27).
 */
export default function EchoWallScreen({ initialFrequencyId, onBack }) {
  const [selectedFrequencyId, setSelectedFrequencyId] = useState(initialFrequencyId || null);
  const [myEchoes] = useLocalStorage('myEchoHistory', []);

  const selectedFreq = useMemo(() => {
    return frequencies.find((f) => f.id === selectedFrequencyId) || null;
  }, [selectedFrequencyId]);

  const allEchoes = useMemo(() => {
    // Combine seed echoes with user-submitted echoes
    const combined = [...seedEchoes, ...myEchoes];
    // Filter by frequency if selected
    if (selectedFrequencyId) {
      return combined.filter((e) => e.frequencyId === selectedFrequencyId);
    }
    return combined;
  }, [selectedFrequencyId, myEchoes]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        padding: '0 16px 24px',
        position: 'relative',
        zIndex: 1,
        maxWidth: '640px',
        margin: '0 auto',
        width: '100%',
      }}
    >
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 0',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={onBack}
            aria-label="Back to tuner"
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              border: '1px solid var(--color-border)',
              background: 'rgba(255, 255, 255, 0.02)',
              color: 'var(--color-text-primary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              transition: 'border-color 0.2s ease, background-color 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-gradient-start)';
              e.currentTarget.style.background = 'rgba(124, 92, 255, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-border)';
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
            }}
          >
            <ArrowLeft size={18} strokeWidth={1.5} />
          </button>
          <div>
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '22px',
              fontWeight: 600,
              color: 'var(--color-text-primary)',
              margin: 0,
            }}>
              Echo Wall
            </h1>
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: '12px',
              color: 'var(--color-text-secondary)',
              margin: 0,
              opacity: 0.7,
            }}>
              anonymous resonance left behind by strangers
            </p>
          </div>
        </div>
      </div>

      {/* Filter chips */}
      <div style={{ marginBottom: '16px' }}>
        <FrequencyFilterChips
          selectedId={selectedFrequencyId}
          onSelect={setSelectedFrequencyId}
        />
      </div>

      {/* Echo list */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        flex: 1,
        overflowY: 'auto',
        paddingRight: '2px',
      }}>
        {allEchoes.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '56px 20px',
            color: 'var(--color-text-secondary)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '10px',
            background: 'rgba(255, 255, 255, 0.01)',
            borderRadius: 'var(--radius-lg)',
            border: '1px dashed rgba(255, 255, 255, 0.08)',
          }}>
            <Radio size={24} style={{ opacity: 0.4, color: selectedFreq?.colorAccent || 'inherit' }} />
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: '15px',
              fontStyle: 'italic',
              margin: 0,
              color: 'var(--color-text-primary)',
              opacity: 0.9,
            }}>
              {selectedFreq
                ? `The silence on ${selectedFreq.mhz} (${selectedFreq.label}) is waiting for your words.`
                : 'The ether is completely quiet right now.'}
            </p>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              opacity: 0.5,
            }}>
              tune in to this frequency to leave the first echo
            </span>
          </div>
        ) : (
          allEchoes.map((echo, index) => (
            <EchoCard key={echo.id} echo={echo} index={index} />
          ))
        )}
      </div>

      {/* Echo count footer */}
      {allEchoes.length > 0 && (
        <div style={{
          textAlign: 'center',
          padding: '16px 0 0',
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          color: 'var(--color-text-secondary)',
          opacity: 0.6,
          letterSpacing: '0.04em',
        }}>
          {allEchoes.length} {allEchoes.length === 1 ? 'echo' : 'echoes'} preserved in the ether
        </div>
      )}
    </motion.div>
  );
}

