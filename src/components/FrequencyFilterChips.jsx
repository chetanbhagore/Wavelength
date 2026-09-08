import frequencies from '../data/frequencies.json';

/**
 * Horizontal scrollable filter chips for the Echo Wall.
 */
export default function FrequencyFilterChips({ selectedId, onSelect }) {
  return (
    <div style={{
      display: 'flex',
      gap: '8px',
      overflowX: 'auto',
      padding: '4px 0',
      scrollbarWidth: 'none',
      msOverflowStyle: 'none',
    }}>
      <style>{`.freq-chips::-webkit-scrollbar { display: none; }`}</style>
      <button
        onClick={() => onSelect(null)}
        style={{
          padding: '8px 16px',
          borderRadius: 'var(--radius-pill)',
          border: `1px solid ${!selectedId ? 'var(--color-gradient-start)' : 'var(--color-border)'}`,
          background: !selectedId ? 'rgba(124, 92, 255, 0.15)' : 'transparent',
          color: !selectedId ? 'var(--color-gradient-start)' : 'var(--color-text-secondary)',
          fontFamily: 'var(--font-body)',
          fontSize: '13px',
          fontWeight: 500,
          cursor: 'pointer',
          whiteSpace: 'nowrap',
          flexShrink: 0,
          transition: 'all 0.2s ease',
        }}
      >
        All frequencies
      </button>
      {frequencies.map((freq) => (
        <button
          key={freq.id}
          onClick={() => onSelect(freq.id)}
          style={{
            padding: '8px 16px',
            borderRadius: 'var(--radius-pill)',
            border: `1px solid ${selectedId === freq.id ? freq.colorAccent : 'var(--color-border)'}`,
            background: selectedId === freq.id ? `${freq.colorAccent}20` : 'transparent',
            color: selectedId === freq.id ? freq.colorAccent : 'var(--color-text-secondary)',
            fontFamily: 'var(--font-body)',
            fontSize: '13px',
            fontWeight: 500,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            flexShrink: 0,
            transition: 'all 0.2s ease',
          }}
        >
          {freq.label}
        </button>
      ))}
    </div>
  );
}
