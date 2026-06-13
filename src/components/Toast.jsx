import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { TOAST_EVENT } from '../lib/toast.js'

// `<ToastHost/>` is mounted once at the app root and listens for toast events
// (fired via `toast()` in ../lib/toast.js), rendering the message stack.

const STYLE = {
  success: { bg: '#6C7A4E', icon: '✅' },
  error: { bg: '#B04B3E', icon: '⚠️' },
  info: { bg: '#5C3E21', icon: '🍳' },
}

export default function ToastHost() {
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    const onToast = (e) => {
      const t = e.detail
      setToasts((prev) => [...prev, t])
      // Auto-dismiss after 3s.
      setTimeout(() => {
        setToasts((prev) => prev.filter((x) => x.id !== t.id))
      }, 3000)
    }
    window.addEventListener(TOAST_EVENT, onToast)
    return () => window.removeEventListener(TOAST_EVENT, onToast)
  }, [])

  const dismiss = (id) => setToasts((prev) => prev.filter((x) => x.id !== id))

  return (
    <div style={wrap}>
      <AnimatePresence>
        {toasts.map((t) => {
          const s = STYLE[t.type] || STYLE.info
          return (
            <motion.div
              key={t.id}
              role="status"
              initial={{ opacity: 0, y: 24, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.95 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              style={{ ...card, background: s.bg }}
              onClick={() => dismiss(t.id)}
            >
              <span style={{ fontSize: '1.05rem' }}>{s.icon}</span>
              <span>{t.message}</span>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}

const wrap = {
  position: 'fixed',
  bottom: 24,
  left: '50%',
  transform: 'translateX(-50%)',
  zIndex: 9999,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 10,
  pointerEvents: 'none',
}

const card = {
  pointerEvents: 'auto',
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  color: '#fff',
  fontFamily: "var(--font-body, 'Inter', system-ui, sans-serif)",
  fontSize: '0.9rem',
  fontWeight: 600,
  padding: '13px 20px',
  borderRadius: 999,
  boxShadow: '0 12px 30px rgba(66, 43, 24, 0.28)',
  cursor: 'pointer',
  maxWidth: '88vw',
}
