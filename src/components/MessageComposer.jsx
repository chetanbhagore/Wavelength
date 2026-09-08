import { useState, useCallback } from 'react';
import { Send } from 'lucide-react';

/**
 * Message input composer pinned to bottom with safe-area awareness.
 */
export default function MessageComposer({ onSend, disabled }) {
  const [text, setText] = useState('');

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setText('');
  }, [text, onSend, disabled]);

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '12px 16px',
        paddingBottom: 'max(12px, env(safe-area-inset-bottom, 12px))',
        borderTop: '1px solid var(--color-border)',
        background: 'var(--color-surface)',
      }}
    >
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="type into the frequency..."
        disabled={disabled}
        maxLength={200}
        aria-label="Type a message"
        style={{
          flex: 1,
          padding: '10px 16px',
          borderRadius: 'var(--radius-pill)',
          border: '1px solid var(--color-border)',
          background: 'var(--color-surface-2)',
          color: 'var(--color-text-primary)',
          fontFamily: 'var(--font-body)',
          fontSize: '15px',
          outline: 'none',
          transition: 'border-color 0.2s ease',
        }}
        onFocus={(e) => {
          e.target.style.borderColor = 'var(--color-gradient-start)';
        }}
        onBlur={(e) => {
          e.target.style.borderColor = 'var(--color-border)';
        }}
      />

      <button
        type="submit"
        disabled={!text.trim() || disabled}
        aria-label="Send message"
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          border: 'none',
          background: text.trim()
            ? 'linear-gradient(135deg, var(--color-gradient-start), var(--color-gradient-end))'
            : 'var(--color-surface-2)',
          color: text.trim() ? 'white' : 'var(--color-text-secondary)',
          cursor: text.trim() ? 'pointer' : 'default',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          transition: 'all 0.2s ease',
          boxShadow: text.trim() ? 'var(--shadow-glow-sm)' : 'none',
        }}
      >
        <Send size={18} strokeWidth={1.5} />
      </button>
    </form>
  );
}
