import { Component } from 'react';
import PropTypes from 'prop-types';
import { RefreshCw, AlertTriangle } from 'lucide-react';

/**
 * ErrorBoundary — Catches unexpected runtime exceptions in the React tree.
 * Displays an analog-themed recovery interface ("Signal Lost / Recalibrate Receiver")
 * rather than an unhandled blank screen crash.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Wavelength Receiver Error caught by Boundary:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          style={{
            minHeight: '100dvh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            background: 'var(--color-bg, #05060A)',
            color: 'var(--color-text-primary, #F5F3F7)',
            textAlign: 'center',
            fontFamily: 'var(--font-body, -apple-system, sans-serif)',
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'rgba(255, 84, 112, 0.12)',
              border: '1px solid rgba(255, 84, 112, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '20px',
              boxShadow: '0 0 30px rgba(255, 84, 112, 0.25)',
            }}
          >
            <AlertTriangle size={32} color="#FF5470" />
          </div>

          <span
            style={{
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: '12px',
              color: '#FF5470',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              marginBottom: '8px',
            }}
          >
            Receiver Carrier Wave Desynchronized
          </span>

          <h1
            style={{
              fontFamily: 'var(--font-display, sans-serif)',
              fontSize: '28px',
              fontWeight: 700,
              marginBottom: '12px',
              color: '#FFFFFF',
            }}
          >
            Signal Lost in the Ether
          </h1>

          <p
            style={{
              maxWidth: '420px',
              fontSize: '14px',
              color: 'var(--color-text-secondary, #ADA8C2)',
              lineHeight: 1.5,
              marginBottom: '28px',
            }}
          >
            The receiver encountered an unexpected frequency fluctuation. No permanent data was stored or compromised.
          </p>

          <button
            type="button"
            onClick={this.handleReset}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '14px 28px',
              borderRadius: '999px',
              border: 'none',
              background: 'linear-gradient(135deg, #7C5CFF, #FF4FA3)',
              color: '#FFFFFF',
              fontFamily: 'var(--font-display, sans-serif)',
              fontSize: '15px',
              fontWeight: 600,
              cursor: 'pointer',
              minHeight: '44px',
              boxShadow: '0 0 25px rgba(124, 92, 255, 0.4)',
              transition: 'transform 0.2s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-1px)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
          >
            <RefreshCw size={16} />
            Recalibrate Receiver
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  /** Child components to wrap with error boundary protection */
  children: PropTypes.node.isRequired,
};
