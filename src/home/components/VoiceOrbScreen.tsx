import { useState } from 'react';
import VoiceOrb from './VoiceOrb';
import styles from './VoiceOrbScreen.module.css';

/**
 * Voice session screen: the Moss orb full-bleed, with mic / status / end controls.
 * Designed at 390 × 844 but fills whatever box you give it.
 */
export default function VoiceOrbScreen() {
  const [muted, setMuted] = useState(false);
  const [ended, setEnded] = useState(false);
  const [burstKey, setBurstKey] = useState(0);
  const active = !muted && !ended;

  return (
    <div className={styles.screen}>
      <button
        type="button"
        className={styles.orbButton}
        aria-label="Make the orb speak"
        onClick={() => active && setBurstKey((k) => k + 1)}
      >
        <VoiceOrb active={active} burstKey={burstKey} />
      </button>

      <div className={styles.controls}>
        <button
          type="button"
          className={`${styles.pill} ${styles.side} ${muted ? styles.on : ''}`}
          aria-label={muted ? 'Unmute microphone' : 'Mute microphone'}
          aria-pressed={muted}
          onClick={() => { setMuted((m) => !m); setEnded(false); }}
        >
          {muted ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M9 9v2a3 3 0 0 0 5.1 2.1" /><path d="M15 10.5V5a3 3 0 0 0-5.7-1.3" /><path d="M18 11a6 6 0 0 1-1 3.3" /><path d="M6 11a6 6 0 0 0 9.4 4.9" /><path d="M12 17v4" /><path d="M3 3l18 18" />
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="9" y="2.5" width="6" height="12" rx="3" /><path d="M6 11a6 6 0 0 0 12 0" /><path d="M12 17v4" />
            </svg>
          )}
        </button>

        <button
          type="button"
          className={`${styles.pill} ${styles.status}`}
          aria-label={ended ? 'Resume voice session' : 'Voice status: Listening'}
          onClick={() => ended && setEnded(false)}
        >
          <span role="status" aria-live="polite" className={active ? styles.label : `${styles.label} ${styles.dim}`}>
            Listening…
          </span>
          <span className={`${styles.ring} ${active ? '' : styles.ringOff}`} aria-hidden="true">
            <span />
          </span>
        </button>

        <button
          type="button"
          className={`${styles.pill} ${styles.side}`}
          aria-label="End voice session"
          onClick={() => { setEnded(true); setMuted(false); }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" aria-hidden="true">
            <path d="M6 6l12 12" /><path d="M18 6L6 18" />
          </svg>
        </button>
      </div>
    </div>
  );
}
