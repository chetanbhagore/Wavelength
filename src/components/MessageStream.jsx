import { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';

/**
 * Scrolling message list for the Room.
 * Uses aria-live for accessibility. Auto-scrolls to latest message.
 */
export default function MessageStream({ messages, onResonate, colorAccent }) {
  const bottomRef = useRef(null);
  const containerRef = useRef(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  return (
    <div
      ref={containerRef}
      role="log"
      aria-live="polite"
      aria-label="Room messages"
      style={{
        flex: 1,
        overflowY: 'auto',
        padding: '12px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        minHeight: 0,
      }}
    >
      {messages.length === 0 && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          color: 'var(--color-text-secondary)',
          fontFamily: 'var(--font-body)',
          fontSize: '14px',
          fontStyle: 'italic',
          opacity: 0.6,
        }}>
          waiting for the first words...
        </div>
      )}

      {messages.map((msg) => (
        <MessageBubble
          key={msg.id}
          message={msg}
          onResonate={onResonate}
          colorAccent={colorAccent}
        />
      ))}

      <div ref={bottomRef} />
    </div>
  );
}
