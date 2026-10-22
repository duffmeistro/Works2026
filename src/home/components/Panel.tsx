import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent, type ReactNode, type TouchEvent } from 'react'
import { useMediaQuery } from '../hooks'

type PanelProps = {
  label: string
  open: boolean
  onClose: () => void
  onNext?: () => void
  onClosed?: () => void
  children: (goNext: () => void) => ReactNode
}

const DISMISS_DISTANCE = 110
const SWAP_MS = 260

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'

export function Panel({ label, open, onClose, onNext, onClosed, children }: PanelProps) {
  const sheetRef = useRef<HTMLElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const wasOpen = useRef(false)
  const isMobile = useMediaQuery('(max-width: 767px)')
  const [swap, setSwap] = useState(false)
  const [dragY, setDragY] = useState(0)
  const dragStart = useRef<number | null>(null)
  const atTop = useRef(false)
  const handleDrag = useRef(false)

  useEffect(() => {
    if (open) {
      sheetRef.current?.scrollTo({ top: 0 })
      wasOpen.current = true
      const t = window.setTimeout(() => closeRef.current?.focus({ preventScroll: true }), 450)
      return () => window.clearTimeout(t)
    }
    if (wasOpen.current) {
      wasOpen.current = false
      onClosed?.()
    }
  }, [open, onClosed])

  const goNext = () => {
    setSwap(true)
    window.setTimeout(() => {
      sheetRef.current?.scrollTo({ top: 0 })
      onNext?.()
      setSwap(false)
    }, SWAP_MS)
  }

  const release = () => {
    const dy = dragY
    dragStart.current = null
    handleDrag.current = false
    setDragY(0)
    if (dy > DISMISS_DISTANCE) onClose()
  }

  const onTouchStart = (e: TouchEvent) => {
    if (!isMobile) return
    dragStart.current = e.touches[0]?.clientY ?? null
    atTop.current = (sheetRef.current?.scrollTop ?? 0) <= 0
  }
  const onTouchMove = (e: TouchEvent) => {
    const start = dragStart.current
    const y = e.touches[0]?.clientY
    if (!isMobile || start === null || y === undefined || !atTop.current || handleDrag.current) return
    setDragY(Math.max(0, y - start))
  }
  const onHandleDown = (e: PointerEvent) => {
    if (!isMobile) return
    handleDrag.current = true
    dragStart.current = e.clientY
    e.currentTarget.setPointerCapture?.(e.pointerId)
  }
  const onHandleMove = (e: PointerEvent) => {
    if (!handleDrag.current || dragStart.current === null) return
    setDragY(Math.max(0, e.clientY - dragStart.current))
  }

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose()
      return
    }
    if (e.key !== 'Tab') return
    const nodes = [
      ...(closeRef.current ? [closeRef.current] : []),
      ...Array.from(sheetRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []),
    ]
    if (nodes.length === 0) return
    const first = nodes[0]
    const last = nodes[nodes.length - 1]
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  }

  const cls = open ? 'is-open' : ''

  return (
    <>
      <div className={`hm-scrim ${cls}`} onClick={onClose} aria-hidden="true" />
      <button
        ref={closeRef}
        type="button"
        className={`hm-close ${cls}`}
        aria-label="Close project"
        tabIndex={open ? 0 : -1}
        onClick={onClose}
        onKeyDown={onKeyDown}
      >
        <svg width="32" height="32" viewBox="0 0 20 20" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M2 2 L18 18 M18 2 L2 18" />
        </svg>
      </button>
      <aside
        ref={sheetRef}
        className={`hm-sheet ${cls}`}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        aria-hidden={!open}
        onKeyDown={onKeyDown}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={release}
        style={dragY > 0 ? { transform: `translate3d(0, ${dragY}px, 0)`, transition: 'none' } : undefined}
      >
        <div
          className="hm-sheet__handle"
          aria-hidden="true"
          onPointerDown={onHandleDown}
          onPointerMove={onHandleMove}
          onPointerUp={release}
          onPointerCancel={release}
        >
          <span />
        </div>
        <div className={swap ? 'hm-case is-swap' : 'hm-case'}>
          {children(goNext)}
        </div>
      </aside>
    </>
  )
}
