import { Component } from 'react'

// Root error boundary. Catches any render/lifecycle error in the tree below so a
// single bad state degrades to a friendly recovery screen instead of a blank
// white page. Self-contained inline styles keep it correct regardless of the
// active design system. (Note: React error boundaries do NOT catch errors thrown
// in async callbacks — those are handled at the call site, e.g. plan generation.)
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    // In production this is where you'd report to a monitoring service.
    // We log locally and never surface a raw stack trace to the user.
    console.error('App crashed:', error, info?.componentStack)
  }

  handleReset = () => {
    this.setState({ error: null })
    if (this.props.onReset) this.props.onReset()
  }

  render() {
    if (this.state.error) {
      return (
        <div style={styles.wrap}>
          <div style={styles.card}>
            <div style={styles.emoji}>🍳💨</div>
            <h2 style={styles.h2}>Something boiled over.</h2>
            <p style={styles.p}>
              The app hit an unexpected error. Nothing left your device — you can
              safely try again.
            </p>
            <div style={styles.row}>
              <button style={styles.primary} onClick={this.handleReset}>
                ↺ Start over
              </button>
              <button style={styles.secondary} onClick={() => window.location.reload()}>
                ⟳ Reload app
              </button>
            </div>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

const styles = {
  wrap: {
    minHeight: '100vh',
    display: 'grid',
    placeItems: 'center',
    padding: '24px',
    background: 'var(--bg-app, #FCF9F5)',
    fontFamily: "var(--font-body, 'Inter', system-ui, sans-serif)",
  },
  card: {
    textAlign: 'center',
    maxWidth: 460,
    background: 'var(--bg-sidebar, #FFFFFF)',
    border: '1px solid var(--border, #EFE5D8)',
    borderRadius: 'var(--radius-lg, 20px)',
    padding: '48px 32px',
    boxShadow: '0 8px 24px rgba(66, 43, 24, 0.06)',
  },
  emoji: { fontSize: '3rem', marginBottom: 16 },
  h2: {
    fontFamily: "var(--font-display, 'Fraunces', Georgia, serif)",
    fontSize: '1.6rem',
    color: 'var(--text-primary, #422B18)',
    margin: '0 0 12px',
  },
  p: { color: 'var(--text-secondary, #7E6E61)', margin: '0 0 24px', lineHeight: 1.5 },
  row: { display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' },
  primary: {
    background: 'var(--color-brown, #5C3E21)',
    color: '#fff',
    border: 'none',
    fontSize: '1rem',
    fontWeight: 600,
    padding: '13px 24px',
    borderRadius: 999,
    cursor: 'pointer',
  },
  secondary: {
    background: 'transparent',
    color: 'var(--text-primary, #422B18)',
    border: '1px solid var(--border, #EFE5D8)',
    fontSize: '1rem',
    fontWeight: 600,
    padding: '13px 24px',
    borderRadius: 999,
    cursor: 'pointer',
  },
}
