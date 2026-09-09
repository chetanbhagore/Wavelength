import { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import { Send } from 'lucide-react';

/**
 * Message input composer pinned to bottom with safe-area awareness:
 * - Unobtrusive character countdown that fades in only when within 30 chars of limit (Issue #28).
 */
export default function MessageComposer({ onSend, disabled }) {
  const [text, setText] = useState('');
  const MAX_CHARS = 200;
  const charsLeft = MAX_CHARS - text.length;
  const showCounter = text.length >= 170;

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
        background: 'rgba(10, 8, 18, 0.9)',
        backdropFilter: 'blur(16px)',
        position: 'relative',
        zIndex: 10,
      }}
    >
      <div style={{ position: 'relative', flex: 1, display: 'flex', alignItems: 'center' }}>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="type into the frequency..."
          disabled={disabled}
          maxLength={MAX_CHARS}
          aria-label="Type a message"
          style={{
            width: '100%',
            padding: '10px 16px',
            paddingRight: showCounter ? '68px' : '16px',
            borderRadius: 'var(--radius-pill)',
            border: '1px solid var(--color-border)',
            background: 'var(--color-surface-2)',
            color: 'var(--color-text-primary)',
            fontFamily: 'var(--font-body)',
            fontSize: '15px',
            outline: 'none',
            transition: 'border-color 0.2s ease, padding-right 0.2s ease',
          }}
          onFocus={(e) => {
            e.target.style.borderColor = 'var(--color-gradient-start)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'var(--color-border)';
          }}
        />

        {/* Minimal countdown cue (Issue #28) */}
        <AnimatePresence>
          {showCounter && (
            <motion.span
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ duration: 0.2 }}
              style={{
                position: 'absolute',
                right: '12px',
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                fontWeight: 600,
                color: charsLeft <= 10 ? '#FF5470' : '#FFB020',
                pointerEvents: 'none',
                userSelect: 'none',
              }}
            >
              {charsLeft}
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      <button
        type="submit"
        disabled={!text.trim() || disabled}
        aria-label="Send message"
        style={{
          width: '44px',
          height: '44px',
          minWidth: '44px',
          minHeight: '44px',
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

MessageComposer.propTypes = {
  /** Callback when user sends a message */
  onSend: PropTypes.func.isRequired,
  /** Whether the composer is disabled (session ended) */
  disabled: PropTypes.bool,
};
