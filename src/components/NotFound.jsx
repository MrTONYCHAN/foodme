// Branded 404 view. Self-contained (inline styles) so it renders correctly
// regardless of which stylesheet/design system is active. Shown when the URL
// path isn't one the app serves — works with the SPA host fallback
// (public/_redirects, netlify.toml, vercel.json) that routes every path here.
export default function NotFound() {
  const goHome = () => {
    window.history.replaceState(null, '', '/')
    window.location.reload()
  }

  return (
    <div style={styles.wrap}>
      <div style={styles.card}>
        <div style={styles.emoji}>🍽️🔍</div>
        <div style={styles.code}>404</div>
        <h1 style={styles.h1}>This dish isn't on the menu.</h1>
        <p style={styles.p}>
          We couldn't find <code style={styles.codeInline}>{window.location.pathname}</code>.
          It may have been moved, or the link was mistyped.
        </p>
        <button style={styles.btn} onClick={goHome}>
          🍳 Back to the kitchen
        </button>
      </div>
    </div>
  )
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
    maxWidth: 480,
    background: 'var(--bg-sidebar, #FFFFFF)',
    border: '1px solid var(--border, #EFE5D8)',
    borderRadius: 'var(--radius-lg, 20px)',
    padding: '48px 32px',
    boxShadow: '0 8px 24px rgba(66, 43, 24, 0.06)',
  },
  emoji: { fontSize: '2.6rem', marginBottom: 12 },
  code: {
    fontFamily: "var(--font-display, 'Fraunces', Georgia, serif)",
    fontWeight: 700,
    fontSize: 'clamp(3.5rem, 12vw, 6rem)',
    lineHeight: 1,
    color: 'var(--color-rust, #C17F5B)',
    marginBottom: 6,
  },
  h1: {
    fontFamily: "var(--font-display, 'Fraunces', Georgia, serif)",
    fontSize: '1.6rem',
    color: 'var(--text-primary, #422B18)',
    margin: '0 0 12px',
  },
  p: { color: 'var(--text-secondary, #7E6E61)', margin: '0 0 24px', lineHeight: 1.5 },
  codeInline: {
    background: 'var(--bg-active, #F2EADF)',
    borderRadius: 6,
    padding: '1px 7px',
    color: 'var(--color-brown, #5C3E21)',
    wordBreak: 'break-all',
  },
  btn: {
    background: 'var(--color-brown, #5C3E21)',
    color: '#fff',
    border: 'none',
    fontSize: '1rem',
    fontWeight: 600,
    padding: '14px 28px',
    borderRadius: 999,
    cursor: 'pointer',
    boxShadow: '0 4px 14px rgba(92, 62, 33, 0.18)',
  },
}
