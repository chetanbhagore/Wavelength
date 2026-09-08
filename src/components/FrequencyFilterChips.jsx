import frequencies from '../data/frequencies.json';

/**
 * Horizontal scrollable filter chips for the Echo Wall:
 * - Active chips dynamically inherit the glowing accent color,
 *   mood aura, and indicator dot of that frequency (Issue #26).
 */
export default function FrequencyFilterChips({ selectedId, onSelect }) {
  return (
    <div style={{
      display: 'flex',
      gap: '8px',
      overflowX: 'auto',
      padding: '6px 2px',
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
          background: !selectedId ? 'rgba(124, 92, 255, 0.18)' : 'rgba(255, 255, 255, 0.02)',
          color: !selectedId ? '#FFFFFF' : 'var(--color-text-secondary)',
          boxShadow: !selectedId ? '0 0 16px rgba(124, 92, 255, 0.4), inset 0 0 8px rgba(124, 92, 255, 0.2)' : 'none',
          fontFamily: 'var(--font-body)',
          fontSize: '13px',
          fontWeight: !selectedId ? 600 : 400,
          cursor: 'pointer',
          whiteSpace: 'nowrap',
          flexShrink: 0,
          transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}
      >
        <span>All frequencies</span>
      </button>

      {frequencies.map((freq) => {
        const isSelected = selectedId === freq.id;
        return (
          <button
            key={freq.id}
            onClick={() => onSelect(freq.id)}
            style={{
              padding: '8px 16px',
              borderRadius: 'var(--radius-pill)',
              border: `1px solid ${isSelected ? freq.colorAccent : 'var(--color-border)'}`,
              background: isSelected ? `${freq.colorAccent}25` : 'rgba(255, 255, 255, 0.02)',
              color: isSelected ? '#FFFFFF' : 'var(--color-text-secondary)',
              boxShadow: isSelected
                ? `0 0 16px ${freq.colorAccent}55, inset 0 0 8px ${freq.colorAccent}33`
                : 'none',
              fontFamily: 'var(--font-body)',
              fontSize: '13px',
              fontWeight: isSelected ? 600 : 400,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              flexShrink: 0,
              transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: freq.colorAccent,
              boxShadow: isSelected ? `0 0 8px ${freq.colorAccent}` : 'none',
              opacity: isSelected ? 1 : 0.6,
            }} />
            <span>{freq.label}</span>
          </button>
        );
      })}
    </div>
  );
}

