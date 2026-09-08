import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Signal } from 'lucide-react';
import { ambientDrone } from '../utils/ambientAudio';

const NODES = [
  { id: 'n1', city: 'Tokyo', mhz: '107.9', count: 9, color: '#33E6C9', angle: 42, dist: 0.65 },
  { id: 'n2', city: 'Reykjavík', mhz: '94.2', count: 6, color: '#7C5CFF', angle: 120, dist: 0.8 },
  { id: 'n3', city: 'Berlin', mhz: '88.5', count: 8, color: '#FFB020', angle: 195, dist: 0.55 },
  { id: 'n4', city: 'San Francisco', mhz: '101.3', count: 7, color: '#FF4FA3', angle: 280, dist: 0.72 },
  { id: 'n5', city: 'London', mhz: '91.1', count: 5, color: '#3B82F6', angle: 330, dist: 0.45 },
];

/**
 * ConstellationRadar
 * Live cosmic constellation radar widget showing synchronous strangers
 * connected across the globe on emotional frequencies right now.
 */
export default function ConstellationRadar({ activeFrequency }) {
  const [expanded, setExpanded] = useState(false);

  const totalStrangers = NODES.reduce((acc, n) => acc + n.count, 0) + 7;

  return (
    <div
      style={{
        position: 'relative',
        zIndex: 10,
      }}
    >
      {/* Mini Radar Button / Scope */}
      <button
        onClick={() => {
          ambientDrone.playDetentClick();
          setExpanded((prev) => !prev);
        }}
        aria-label="Toggle Live Ether Constellation Radar"
        title="Live Global Ether Radar: Strangers synchronized across frequencies right now"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '5px 12px',
          borderRadius: 'var(--radius-pill)',
          background: 'rgba(17, 21, 33, 0.75)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.45)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'rgba(51, 230, 201, 0.45)';
          e.currentTarget.style.background = 'rgba(23, 29, 45, 0.9)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
          e.currentTarget.style.background = 'rgba(17, 21, 33, 0.75)';
        }}
      >
        {/* Animated Radar Disk */}
        <div
          style={{
            position: 'relative',
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(51, 230, 201, 0.15) 0%, rgba(5, 6, 10, 0.9) 80%)',
            border: '1px solid rgba(51, 230, 201, 0.4)',
            overflow: 'hidden',
            flexShrink: 0,
          }}
        >
          {/* Rotating sweep line */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '50%',
              background: 'conic-gradient(from 0deg, rgba(51, 230, 201, 0.4) 0deg, transparent 60deg, transparent 360deg)',
              animation: 'radar-sweep 3s linear infinite',
            }}
          />
          {/* Center blip */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '3px',
              height: '3px',
              borderRadius: '50%',
              backgroundColor: '#33E6C9',
              boxShadow: '0 0 4px #33E6C9',
            }}
          />
        </div>

        {/* Telemetry text */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Signal size={12} style={{ color: '#33E6C9' }} />
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              fontWeight: 600,
              color: 'var(--color-text-primary)',
              letterSpacing: '0.04em',
            }}
          >
            {totalStrangers} in Ether
          </span>
          <span
            style={{
              width: '4px',
              height: '4px',
              borderRadius: '50%',
              backgroundColor: '#33E6C9',
              boxShadow: '0 0 6px #33E6C9',
            }}
          />
        </div>
      </button>

      {/* Expanded Constellation Flyout Modal / Card */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.94 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              top: '36px',
              right: '0',
              width: '280px',
              background: 'rgba(15, 18, 28, 0.96)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: 'var(--radius-md)',
              padding: '14px',
              boxShadow: '0 16px 40px rgba(0, 0, 0, 0.85), 0 0 24px rgba(51, 230, 201, 0.12)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              zIndex: 30,
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Globe size={14} style={{ color: '#33E6C9' }} />
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    color: 'var(--color-text-primary)',
                  }}
                >
                  Global Ether Array
                </span>
              </div>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '9.5px',
                  color: '#33E6C9',
                  background: 'rgba(51, 230, 201, 0.1)',
                  padding: '2px 6px',
                  borderRadius: 'var(--radius-pill)',
                }}
              >
                LIVE
              </span>
            </div>

            {/* Simulated Live Synchronized Nodes */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {NODES.map((node) => (
                <div
                  key={node.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '5px 8px',
                    borderRadius: '6px',
                    background: node.mhz === activeFrequency?.mhz ? 'rgba(255, 255, 255, 0.06)' : 'transparent',
                    border: node.mhz === activeFrequency?.mhz ? `1px solid ${node.color}55` : '1px solid transparent',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span
                      style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        backgroundColor: node.color,
                        boxShadow: `0 0 6px ${node.color}`,
                      }}
                    />
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--color-text-primary)' }}>
                      {node.city}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10.5px', color: 'var(--color-text-secondary)' }}>
                      {node.mhz} MHz
                    </span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 600, color: node.color }}>
                      {node.count}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '10px', paddingTop: '8px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', textAlign: 'center' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--color-text-secondary)' }}>
                Zero logs • Zero tracking • Pure ephemeral resonance
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes radar-sweep {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
