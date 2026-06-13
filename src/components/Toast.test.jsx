import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'

// Render motion elements as plain DOM with no enter/exit animation, so that
// state-driven removal unmounts synchronously (framer-motion's exit animation
// is rAF-driven and would otherwise linger under fake timers).
vi.mock('framer-motion', async () => {
  const React = await import('react')
  const passthrough = (tag) => ({ children, initial, animate, exit, transition, whileHover, whileTap, ...rest }) =>
    React.createElement(tag, rest, children)
  return {
    AnimatePresence: ({ children }) => React.createElement(React.Fragment, null, children),
    motion: new Proxy({}, { get: (_t, tag) => passthrough(tag) }),
  }
})

import ToastHost from './Toast.jsx'
import { toast } from '../lib/toast.js'

describe('Toast', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  afterEach(() => {
    act(() => {
      vi.runOnlyPendingTimers()
    })
    vi.useRealTimers()
  })

  it('renders a message dispatched via toast()', () => {
    render(<ToastHost />)
    act(() => {
      toast('Grocery list copied!', 'success')
    })
    expect(screen.getByRole('status')).toHaveTextContent('Grocery list copied!')
  })

  it('auto-dismisses after 3 seconds', () => {
    render(<ToastHost />)
    act(() => {
      toast('Temporary message')
    })
    expect(screen.getByText('Temporary message')).toBeInTheDocument()
    act(() => {
      vi.advanceTimersByTime(3100)
    })
    expect(screen.queryByText('Temporary message')).not.toBeInTheDocument()
  })

  it('ignores empty messages', () => {
    render(<ToastHost />)
    act(() => {
      toast('')
    })
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('can stack multiple toasts', () => {
    render(<ToastHost />)
    act(() => {
      toast('First')
      toast('Second')
    })
    expect(screen.getByText('First')).toBeInTheDocument()
    expect(screen.getByText('Second')).toBeInTheDocument()
  })
})
