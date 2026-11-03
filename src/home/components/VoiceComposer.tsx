import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./VoiceComposer.module.css";

/**
 * VoiceComposer
 * A chat composer with voice input that lives inside the text box:
 * an aurora glow rises from the bottom edge with the voice level, and the
 * transcript sweeps in left-to-right in short phrases.
 *
 * Voice is simulated (no microphone access) — ideal for a portfolio demo.
 * To drive it from a real mic, replace `simulateLevel()` with an
 * AnalyserNode RMS value in the 0–1 range.
 */

export type VoiceComposerTheme = "dark" | "light";

export interface VoiceComposerProps {
  theme?: VoiceComposerTheme;
  /** The sentence that gets "dictated" when the mic is tapped. */
  transcript?: string;
  placeholder?: string;
  modeLabel?: string;
  /** Called when the send button is pressed with text in the box. */
  onSubmit?: (text: string) => void;
  className?: string;
}

const DEFAULT_TRANSCRIPT =
  "Summarise this week’s customer calls, pull out any objections around pricing or onboarding, and draft friendly follow-up emails for every deal that’s still open. Flag anything that needs my sign-off before Friday, and suggest a time next week to review the pipeline with the team.";

type Mode = "idle" | "listening" | "ready";
type Word = { id: number; t: string; delay: number };
type Sim = {
  speaking: boolean;
  phaseEnd: number;
  nextWord: number;
  idx: number;
  doneAt: number;
  jit: number;
};

// Motion tuning
const PRESENCE_RISE = 2.8; // glow fade/rise speed when starting
const PRESENCE_FALL = 3.4; // … when stopping
const ATTACK = 15; // how fast the glow jumps up on a syllable
const RELEASE = 4.5; // how slowly it settles back
const BLOB_RATES = [9, 6, 12, 7, 10]; // per-blob lag, for an organic shape
const PHRASE_SIZE = 3; // words revealed together
const PHRASE_GAP = 760; // ms between phrases
const WORD_STAGGER = 110; // ms between words inside a phrase
const FIRST_WORD_DELAY = 1100; // transcription "catch-up" lag
const AUTO_STOP_SILENCE = 1300; // ms of silence after the last word

export default function VoiceComposer({
  theme = "dark",
  transcript = DEFAULT_TRANSCRIPT,
  placeholder = "Ask me anything…",
  modeLabel = "Agent",
  onSubmit,
  className,
}: VoiceComposerProps) {
  const [mode, setMode] = useState<Mode>("idle");
  const [words, setWords] = useState<Word[]>([]);
  const [text, setText] = useState("");

  const boxRef = useRef<HTMLDivElement>(null);
  const script = useMemo(() => transcript.split(/\s+/).filter(Boolean), [transcript]);

  // Animation engine lives in a ref so the rAF loop never triggers re-renders.
  const eng = useRef({
    p: 0,
    target: 0,
    env: 0,
    as: [0, 0, 0, 0, 0],
    raf: 0,
    last: 0,
    sim: null as Sim | null,
    buf: [] as Word[],
    seq: 0,
  });

  const paint = () => {
    const b = boxRef.current;
    if (!b) return;
    const e = eng.current;
    b.style.setProperty("--p", e.p.toFixed(4));
    b.style.setProperty("--amp", e.env.toFixed(4));
    for (let i = 0; i < 5; i++) b.style.setProperty(`--a${i + 1}`, e.as[i].toFixed(4));
  };

  const stop = (keep: boolean) => {
    const e = eng.current;
    e.target = 0;
    e.sim = null;
    const t = keep ? e.buf.map((w) => w.t).join(" ") : "";
    e.buf = [];
    setWords([]);
    setText(t);
    setMode(t ? "ready" : "idle");
    loop();
  };

  const tick = (now: number) => {
    const e = eng.current;
    e.raf = 0;
    const dt = Math.min(0.05, Math.max(0, (now - e.last) / 1000));
    e.last = now;
    const t = now / 1000;

    // Presence: eased rise / fall of the whole glow
    const k = e.target > e.p ? PRESENCE_RISE : PRESENCE_FALL;
    e.p += (e.target - e.p) * (1 - Math.exp(-dt * k));

    // Simulated speech envelope + phrase-based transcript
    let raw = 0;
    let finish = false;
    const s = e.sim;
    if (s) {
      if (now > s.phaseEnd) {
        if (s.idx >= script.length) {
          s.speaking = false;
          if (!s.doneAt) s.doneAt = now;
          s.phaseEnd = Infinity;
        } else {
          s.speaking = !s.speaking;
          s.phaseEnd = now + (s.speaking ? 1000 + Math.random() * 1500 : 280 + Math.random() * 420);
          if (s.speaking) s.nextWord = Math.max(s.nextWord, now + 450);
        }
      }
      if (s.speaking) {
        s.jit += (0.55 + Math.random() * 0.55 - s.jit) * 0.08;
        const syl = Math.abs(Math.sin(t * Math.PI * 2 * 4.1 + 1.4 * Math.sin(t * Math.PI * 2 * 0.63)));
        raw = (0.4 + 0.6 * syl) * s.jit;
        if (now > s.nextWord && s.idx < script.length) {
          const n = Math.min(PHRASE_SIZE, script.length - s.idx);
          for (let j = 0; j < n; j++) {
            e.buf.push({ id: e.seq++, t: script[s.idx++], delay: j * WORD_STAGGER });
          }
          setWords(e.buf.slice());
          s.nextWord = now + PHRASE_GAP + Math.random() * 80;
        }
      } else {
        raw = 0.1 + 0.035 * Math.sin(t * 2.7);
      }
      if (s.doneAt && now - s.doneAt > AUTO_STOP_SILENCE) finish = true;
    }

    const rate = raw > e.env ? ATTACK : RELEASE;
    e.env += (raw - e.env) * (1 - Math.exp(-dt * rate));

    for (let i = 0; i < 5; i++) {
      const wob = 0.8 + 0.24 * Math.sin(t * (1.1 + i * 0.37) + i * 1.9);
      const target = Math.min(1, e.env * wob);
      e.as[i] += (target - e.as[i]) * (1 - Math.exp(-dt * BLOB_RATES[i]));
    }
    paint();

    if (finish) return stop(true);
    if (e.target > 0 || e.p > 0.002 || e.env > 0.002) loop();
    else {
      e.p = 0;
      e.env = 0;
      e.as = [0, 0, 0, 0, 0];
      paint();
    }
  };

  // Always call the latest tick (fresh closure over `script`)
  const tickRef = useRef(tick);
  tickRef.current = tick;

  function loop() {
    const e = eng.current;
    if (!e.raf) {
      e.last = performance.now();
      e.raf = requestAnimationFrame((n) => tickRef.current(n));
    }
  }

  const start = () => {
    const e = eng.current;
    const now = performance.now();
    e.buf = [];
    e.sim = { speaking: false, phaseEnd: now + 420, nextWord: now + FIRST_WORD_DELAY, idx: 0, doneAt: 0, jit: 1 };
    e.target = 1;
    setWords([]);
    setText("");
    setMode("listening");
    loop();
  };

  useEffect(() => {
    const e = eng.current;
    return () => {
      if (e.raf) cancelAnimationFrame(e.raf);
      e.raf = 0;
    };
  }, []);

  const listening = mode === "listening";
  const hasText = text.trim().length > 0;
  const actionMode = listening ? styles.mStop : hasText ? styles.mSend : styles.mEmpty;

  const onMic = () => (listening ? stop(true) : start());
  const onAction = () => {
    if (listening) return stop(false);
    if (hasText) {
      onSubmit?.(text);
      setText("");
      setMode("idle");
    }
  };

  return (
    <div
      className={[styles.root, theme === "light" ? styles.light : styles.dark, className].filter(Boolean).join(" ")}
    >
      <div className={styles.composer} ref={boxRef}>
        <div className={styles.glow} aria-hidden="true">
          {[styles.b1, styles.b2, styles.b3, styles.b4, styles.b5].map((b, i) => (
            <div key={i} className={`${styles.blob} ${b}`}>
              <div className={styles.core} />
            </div>
          ))}
        </div>
        <div className={styles.edgeSoft} aria-hidden="true" />
        <div className={styles.edge} aria-hidden="true" />

        <div className={styles.fieldWrap}>
          {listening ? (
            <div className={styles.transcript} aria-live="polite">
              {words.length === 0 && <span className={styles.hint}>Listening…</span>}
              {words.map((w) => (
                <span key={w.id} className={styles.word} style={{ animationDelay: `${w.delay}ms` }}>
                  {w.t}
                </span>
              ))}
            </div>
          ) : (
            <textarea
              className={`${styles.field} ${text.length > 140 ? styles.tall : ""}`}
              rows={2}
              placeholder={placeholder}
              aria-label="Message"
              value={text}
              onChange={(ev) => {
                setText(ev.target.value);
                setMode(ev.target.value.trim() ? "ready" : "idle");
              }}
            />
          )}
        </div>

        <div className={styles.row}>
          <button className={styles.btn} type="button" aria-label="Add attachment">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </button>
          <div className={styles.spacer} />
          <button className={`${styles.btn} ${styles.pill}`} type="button" aria-label={`Mode: ${modeLabel}`}>
            <span>{modeLabel}</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M7 10l5 5 5-5" />
            </svg>
          </button>
          <button
            className={`${styles.btn} ${styles.mic} ${listening ? styles.on : ""}`}
            type="button"
            aria-label={listening ? "Stop dictation" : "Start voice input"}
            aria-pressed={listening}
            onClick={onMic}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="9" y="3" width="6" height="11.5" rx="3" />
              <path d="M5.5 11.5a6.5 6.5 0 0 0 13 0M12 18v3" />
            </svg>
          </button>
          <button
            className={`${styles.btn} ${styles.action} ${actionMode}`}
            type="button"
            aria-label={listening ? "Cancel voice input" : "Send message"}
            disabled={!listening && !hasText}
            onClick={onAction}
          >
            <span className={`${styles.ic} ${styles.icUp}`}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 19V5M6 11l6-6 6 6" />
              </svg>
            </span>
            <span className={`${styles.ic} ${styles.icX}`}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path d="M7 7l10 10M17 7L7 17" />
              </svg>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
