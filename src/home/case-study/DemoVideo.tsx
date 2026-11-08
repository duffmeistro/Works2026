import { useContext, useEffect, useRef, useState, type KeyboardEvent, type MouseEvent, type PointerEvent } from 'react'
import { PanelOpenContext } from '../components/Media'
import { asset, useLive } from './primitives'
import s from './DemoVideo.module.css'

type FullscreenVideo = HTMLVideoElement & { webkitEnterFullscreen?: () => void }
type FullscreenFigure = HTMLElement & { webkitRequestFullscreen?: () => void }

const clamp = (x: number) => Math.max(0, Math.min(1, x))

const attempt = (fn: () => void) => {
  try {
    fn()
  } catch {
    return
  }
}

const fmt = (x: number) => {
  const n = Math.max(0, Math.floor(x + 0.0001))
  return `${Math.floor(n / 60)}:${String(n % 60).padStart(2, '0')}`
}

export function DemoVideo() {
  const [figRef, live] = useLive<HTMLElement>()
  const open = useContext(PanelOpenContext)
  const vidRef = useRef<HTMLVideoElement>(null)
  const scrubbing = useRef(false)
  const userPaused = useRef(false)
  const [time, setTime] = useState(0)
  const [duration, setDuration] = useState(20)
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(true)
  const [scrub, setScrub] = useState(false)

  useEffect(() => {
    const v = vidRef.current
    if (!v) return
    if (live) {
      if (userPaused.current || !v.muted || !v.paused) return
      const pr = v.play()
      if (pr) pr.catch(() => setPlaying(false))
    } else if (!v.paused && v.muted) {
      v.pause()
    }
  }, [live])

  useEffect(() => {
    const v = vidRef.current
    if (!open && v && !v.paused) v.pause()
  }, [open])

  const sync = () => {
    const v = vidRef.current
    if (!v || scrubbing.current) return
    setTime(v.currentTime || 0)
    setDuration(v.duration || 20)
  }

  const toggle = () => {
    const v = vidRef.current
    if (!v) return
    if (v.paused) {
      userPaused.current = false
      const pr = v.play()
      if (pr) pr.catch(() => {})
    } else {
      userPaused.current = true
      v.pause()
    }
  }

  const mute = () => {
    const v = vidRef.current
    if (!v) return
    v.muted = !v.muted
    setMuted(v.muted)
  }

  const full = (e: MouseEvent<HTMLButtonElement>) => {
    const fig = e.currentTarget.closest('figure') as FullscreenFigure | null
    const v = vidRef.current as FullscreenVideo | null
    attempt(() => {
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {})
        return
      }
      if (fig && fig.requestFullscreen) {
        fig.requestFullscreen().catch(() => {
          if (v && v.webkitEnterFullscreen) v.webkitEnterFullscreen()
        })
        return
      }
      if (fig && fig.webkitRequestFullscreen) {
        fig.webkitRequestFullscreen()
        return
      }
      if (v && v.webkitEnterFullscreen) v.webkitEnterFullscreen()
    })
  }

  const seek = (e: PointerEvent<HTMLDivElement>) => {
    const v = vidRef.current
    if (!v) return
    const r = e.currentTarget.getBoundingClientRect()
    const d = v.duration || 20
    const t = clamp((e.clientX - r.left) / r.width) * d
    attempt(() => {
      v.currentTime = t
    })
    setTime(t)
    setDuration(d)
  }

  const down = (e: PointerEvent<HTMLDivElement>) => {
    scrubbing.current = true
    const el = e.currentTarget
    attempt(() => el.setPointerCapture(e.pointerId))
    setScrub(true)
    seek(e)
  }

  const move = (e: PointerEvent<HTMLDivElement>) => {
    if (scrubbing.current) seek(e)
  }

  const up = (e: PointerEvent<HTMLDivElement>) => {
    if (!scrubbing.current) return
    scrubbing.current = false
    const el = e.currentTarget
    attempt(() => el.releasePointerCapture(e.pointerId))
    setScrub(false)
  }

  const key = (e: KeyboardEvent<HTMLDivElement>) => {
    const v = vidRef.current
    if (!v) return
    const d = v.duration || 20
    const t = v.currentTime || 0
    let n: number | null = null
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') n = Math.min(d, t + 1)
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') n = Math.max(0, t - 1)
    else if (e.key === 'Home') n = 0
    else if (e.key === 'End') n = d - 0.05
    else if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault()
      toggle()
      return
    }
    if (n === null) return
    e.preventDefault()
    const next = n
    attempt(() => {
      v.currentTime = next
    })
    setTime(n)
    setDuration(d)
  }

  const vt = Math.min(time, duration)
  const pct = Math.max(0, Math.min(100, (vt / duration) * 100)).toFixed(2)
  const still = scrub || vt < 0.3

  return (
    <figure ref={figRef} className={s.fig} aria-label="Product video: Breeze voice in use (placeholder)">
      <video
        ref={vidRef}
        className={s.video}
        src={asset('breeze-voice-demo.mp4')}
        poster={asset('breeze-voice-demo-poster.jpg')}
        muted
        loop
        playsInline
        preload="metadata"
        onTimeUpdate={sync}
        onLoadedMetadata={sync}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onVolumeChange={(e) => setMuted(e.currentTarget.muted)}
        onClick={toggle}
        aria-label="Breeze voice on a phone: connecting, ready to chat, a voice conversation and the voice settings"
      />
      <span className={s.badge}>
        <span className={s.badgeDot} />
        Video · 0:20
      </span>
      <div className={s.bar}>
        <button type="button" className={s.btn} onClick={toggle} aria-label={playing ? 'Pause' : 'Play'}>
          {playing ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M8 5v14M16 5v14" strokeWidth="2.6" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M7 5v14l11-7z" fill="currentColor" stroke="none" />
            </svg>
          )}
        </button>
        <span className={s.time}>{fmt(vt)}</span>
        <div
          className={scrub ? `${s.scrub} ${s.scrubOn}` : s.scrub}
          role="slider"
          tabIndex={0}
          aria-label="Seek"
          aria-valuemin={0}
          aria-valuemax={Math.round(duration)}
          aria-valuenow={Math.round(vt)}
          aria-valuetext={`${fmt(vt)} of ${fmt(duration)}`}
          onPointerDown={down}
          onPointerMove={move}
          onPointerUp={up}
          onPointerCancel={up}
          onKeyDown={key}
        >
          <div className={s.track}>
            <div className={s.fill} style={{ width: `${pct}%`, transition: still ? 'none' : 'width .26s linear' }} />
            <div className={s.knob} style={{ left: `${pct}%`, transition: `left ${still ? '0s' : '.26s linear'}, transform .15s` }} />
          </div>
        </div>
        <span className={`${s.time} ${s.dur}`}>{fmt(duration)}</span>
        <button type="button" className={s.btn} onClick={mute} aria-label={muted ? 'Unmute' : 'Mute'}>
          {muted ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M4 9.5h3.5L12 6v12l-4.5-3.5H4z" />
              <path d="M16 9.5l5 5M21 9.5l-5 5" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M4 9.5h3.5L12 6v12l-4.5-3.5H4z" />
              <path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11" />
            </svg>
          )}
        </button>
        <button type="button" className={s.btn} onClick={full} aria-label="Full screen">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
          </svg>
        </button>
      </div>
    </figure>
  )
}
