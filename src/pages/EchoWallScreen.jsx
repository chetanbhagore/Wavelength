import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import FrequencyFilterChips from '../components/FrequencyFilterChips';
import EchoCard from '../components/EchoCard';
import seedEchoes from '../data/seedEchoes.json';
import { useLocalStorage } from '../hooks/useLocalStorage';

/**
 * Echo Wall — browse accumulated anonymous echoes for a frequency.
 * Chronological (oldest first), capped, no ranking, no sort-by-popular.
 */
export default function EchoWallScreen({ initialFrequencyId, onBack }) {
  const [selectedFrequencyId, setSelectedFrequencyId] = useState(initialFrequencyId || null);
  const [myEchoes] = useLocalStorage('myEchoHistory', []);

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
        gap: '12px',
        padding: '16px 0',
      }}>
        <button
          onClick={onBack}
          aria-label="Back to tuner"
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            border: '1px solid var(--color-border)',
            background: 'transparent',
            color: 'var(--color-text-primary)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            transition: 'border-color 0.2s ease',
          }}
        >
          <ArrowLeft size={18} strokeWidth={1.5} />
        </button>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '22px',
          fontWeight: 600,
          color: 'var(--color-text-primary)',
        }}>
          Echo Wall
        </h1>
      </div>

      {/* Filter chips */}
      <div style={{ marginBottom: '20px' }}>
        <FrequencyFilterChips
          selectedId={selectedFrequencyId}
          onSelect={setSelectedFrequencyId}
        />
      </div>

      {/* Echo list */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        flex: 1,
        overflowY: 'auto',
      }}>
        {allEchoes.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '48px 16px',
            color: 'var(--color-text-secondary)',
            fontFamily: 'var(--font-body)',
            fontSize: '15px',
            fontStyle: 'italic',
          }}>
            no echoes yet — you could leave the first one
          </div>
        ) : (
          allEchoes.map((echo, index) => (
            <EchoCard key={echo.id} echo={echo} index={index} />
          ))
        )}
      </div>

      {/* Echo count */}
      {allEchoes.length > 0 && (
        <div style={{
          textAlign: 'center',
          padding: '16px 0 0',
          fontFamily: 'var(--font-mono)',
          fontSize: '12px',
          color: 'var(--color-text-secondary)',
          opacity: 0.5,
        }}>
          {allEchoes.length} {allEchoes.length === 1 ? 'echo' : 'echoes'}
        </div>
      )}
    </motion.div>
  );
}
