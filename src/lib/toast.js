// Toast event bus. Fire a toast from anywhere:
//   import { toast } from '../lib/toast.js'
//   toast('Saved!', 'success')
// The <ToastHost/> component (mounted once at the app root) listens for these
// events and renders the messages. Kept separate from the component so the
// helper can be imported without pulling in React / breaking fast-refresh.

export const TOAST_EVENT = 'souschef:toast'

let counter = 0

export function toast(message, type = 'info') {
  if (typeof window === 'undefined' || !message) return
  window.dispatchEvent(
    new CustomEvent(TOAST_EVENT, { detail: { id: ++counter, message, type } }),
  )
}
