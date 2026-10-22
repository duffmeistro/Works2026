import { useEffect, useLayoutEffect, useRef, useState } from 'react'

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches)
  useEffect(() => {
    const mql = window.matchMedia(query)
    const onChange = () => setMatches(mql.matches)
    onChange()
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [query])
  return matches
}

export function useElementWidth<T extends HTMLElement>(fallback: number) {
  const ref = useRef<T>(null)
  const [width, setWidth] = useState(fallback)
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const measure = () => setWidth(el.clientWidth || fallback)
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [fallback])
  return [ref, width] as const
}

export function useElementHeight<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [height, setHeight] = useState(0)
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const measure = () => setHeight(el.clientHeight)
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  return [ref, height] as const
}

export function useReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)')
}

export function useDocumentTitle(title: string) {
  useEffect(() => {
    const previous = document.title
    document.title = title
    return () => {
      document.title = previous
    }
  }, [title])
}

export function useBodyClass(name: string) {
  useEffect(() => {
    document.body.classList.add(name)
    return () => document.body.classList.remove(name)
  }, [name])
}

export function useCopyEmail(address: string) {
  const [copied, setCopied] = useState(false)
  const timer = useRef<number>()
  useEffect(() => () => window.clearTimeout(timer.current), [])
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(address)
    } catch {
      const el = document.createElement('textarea')
      el.value = address
      el.setAttribute('readonly', '')
      el.style.position = 'fixed'
      el.style.opacity = '0'
      document.body.appendChild(el)
      el.select()
      try {
        document.execCommand('copy')
      } catch {
        return
      } finally {
        document.body.removeChild(el)
      }
    }
    setCopied(true)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setCopied(false), 1800)
  }
  return { copied, copy }
}

export function useArrowKeys(onStep: (step: 1 | -1) => void, enabled: boolean) {
  const handler = useRef(onStep)
  handler.current = onStep
  useEffect(() => {
    if (!enabled) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return
      if (e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) return
      const t = e.target as HTMLElement | null
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return
      e.preventDefault()
      handler.current(e.key === 'ArrowRight' ? 1 : -1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [enabled])
}
