/**
 * Lead Match — swipeable lead-scoring prototype (HubSpot mobile concept)
 * Playground piece for gavworks2026. Self-contained: no dependencies beyond React.
 *
 * Usage:
 *   import LeadMatch from "@/components/playground/LeadMatch";
 *   <LeadMatch />                       // scales to fit its container (max 390px wide)
 *   <LeadMatch accent="#E9623B" />      // swap the accent colour
 *
 * All company, contact and ARR figures are dummy data.
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

/* ------------------------------------------------------------------ data */

type Lead = {
  id: string;
  type: "Company" | "Contact";
  name: string;
  initials: string;
  meta: string;
  sub: string;
  match: number;
  value: string;
  signals: string[];
  facts: { k: string; v: string }[];
  arr: { label: string; v: string; w: string }[];
  range: string;
  basis: string;
};

const LEADS: Lead[] = [
  {
    id: "nw", type: "Company", name: "Northwind Logistics", initials: "NL", meta: "240 employees",
    sub: "Freight & logistics · Dublin", match: 92, value: "€48k",
    signals: ["Pricing page ×3", "Hiring 4 SDRs", "CRM renewal Q1", "Demo requested"],
    facts: [{ k: "Employees", v: "240" }, { k: "Founded", v: "2009" }, { k: "Sales reps", v: "24" }, { k: "Current CRM", v: "Salesforce" }],
    arr: [{ label: "Sales Hub Pro · 24 seats", v: "€31k", w: "65%" }, { label: "Service Hub Starter · 10 seats", v: "€9k", w: "19%" }, { label: "Onboarding & migration", v: "€8k", w: "16%" }],
    range: "€38k – €56k", basis: "Sized from 24 reps, a Q1 Salesforce renewal and 6 similar logistics deals.",
  },
  {
    id: "ab", type: "Contact", name: "Aoife Brennan", initials: "AB", meta: "Decision maker",
    sub: "Head of RevOps · Lumen Health, Cork", match: 88, value: "€32k",
    signals: ["Opened 3 emails", "Webinar attendee", "New in role", "Visited pricing"],
    facts: [{ k: "Company", v: "Lumen Health" }, { k: "Employees", v: "120" }, { k: "Sales reps", v: "14" }, { k: "Current CRM", v: "Pipedrive" }],
    arr: [{ label: "Sales Hub Pro · 14 seats", v: "€18k", w: "56%" }, { label: "Marketing Hub Pro", v: "€10k", w: "31%" }, { label: "Onboarding", v: "€4k", w: "13%" }],
    range: "€26k – €38k", basis: "Sized from Lumen’s 14-person sales team and a RevOps-led evaluation.",
  },
  {
    id: "ka", type: "Company", name: "Kestrel Analytics", initials: "KA", meta: "85 employees",
    sub: "B2B SaaS · Galway", match: 81, value: "€26k",
    signals: ["Series A raised", "Free trial active", "Uses spreadsheets", "Hiring sales lead"],
    facts: [{ k: "Employees", v: "85" }, { k: "Founded", v: "2021" }, { k: "Funding", v: "Series A · €12m" }, { k: "Current CRM", v: "Spreadsheets" }],
    arr: [{ label: "Sales Hub Pro · 12 seats", v: "€15k", w: "58%" }, { label: "Marketing Hub Starter", v: "€7k", w: "27%" }, { label: "Onboarding", v: "€4k", w: "15%" }],
    range: "€20k – €32k", basis: "Sized from post-raise hiring plans and active trial usage.",
  },
  {
    id: "mf", type: "Contact", name: "Marcus Feld", initials: "MF", meta: "Champion",
    sub: "VP Sales · Orbital Payments, Berlin", match: 76, value: "€55k",
    signals: ["Replied to sequence", "Team of 30 reps", "Booked demo before", "Budget approved Q1"],
    facts: [{ k: "Company", v: "Orbital Payments" }, { k: "Employees", v: "310" }, { k: "Sales reps", v: "30" }, { k: "Current CRM", v: "HubSpot Starter" }],
    arr: [{ label: "Sales Hub Enterprise · 30 seats", v: "€42k", w: "76%" }, { label: "Forecasting add-on", v: "€8k", w: "15%" }, { label: "Onboarding", v: "€5k", w: "9%" }],
    range: "€45k – €65k", basis: "Upgrade path from Starter, sized on 30 reps.",
  },
  {
    id: "hs", type: "Company", name: "Harbour & Stone", initials: "HS", meta: "60 employees",
    sub: "Architecture studio · Belfast", match: 69, value: "€14k",
    signals: ["Blog reader", "Expanding to Dublin", "No CRM yet", "Viewed case study"],
    facts: [{ k: "Employees", v: "60" }, { k: "Founded", v: "1998" }, { k: "Offices", v: "Belfast, Dublin" }, { k: "Current CRM", v: "None" }],
    arr: [{ label: "Sales Hub Starter · 8 seats", v: "€6k", w: "43%" }, { label: "Service Hub Starter", v: "€5k", w: "36%" }, { label: "Onboarding", v: "€3k", w: "21%" }],
    range: "€10k – €18k", basis: "Sized from a new Dublin office and project-led client work.",
  },
  {
    id: "pr", type: "Contact", name: "Priya Raman", initials: "PR", meta: "Founder",
    sub: "Co-founder · Tidepool Studio, London", match: 64, value: "€9k",
    signals: ["Visited 6 pages", "Small team", "Referred by partner", "Opened 2 emails"],
    facts: [{ k: "Company", v: "Tidepool Studio" }, { k: "Employees", v: "18" }, { k: "Founded", v: "2022" }, { k: "Current CRM", v: "Notion" }],
    arr: [{ label: "Starter Customer Platform · 6 seats", v: "€5k", w: "56%" }, { label: "Marketing Hub Starter", v: "€2k", w: "22%" }, { label: "Onboarding", v: "€2k", w: "22%" }],
    range: "€7k – €12k", basis: "Sized from team size and a partner referral.",
  },
];

type Filter = "All" | "Companies" | "Contacts";

/* ------------------------------------------------------------------ tokens */

const INK = "#141414";
const BG = "#E2E2E7";
const BACK_CARD = "#F3F3F6";
const PASS_RED = "#FF5468";
const SHEET = "#161615";
const MUTED = "#5E5E5B";
const MUTED_DARK = "#A3A3A0";
const THRESHOLD = 90;
const W = 390;
const H = 844;

/* ------------------------------------------------------------------ helpers */

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const mix = (a: string, b: string, t: number) => {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  return `rgb(${pa.map((v, i) => Math.round(v + (pb[i] - v) * t)).join(",")})`;
};

const BuildingIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4 21V5a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v16" /><path d="M15 10h4a1 1 0 0 1 1 1v10" /><path d="M3 21h18" /><path d="M8 8h3M8 12h3M8 16h3" />
  </svg>
);
const ContactIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="4.5" width="18" height="15" rx="3" /><circle cx="9" cy="10.5" r="2.25" /><path d="M5.75 16.5a3.25 3.25 0 0 1 6.5 0" /><path d="M15 10h3M15 14h3" />
  </svg>
);

/* ------------------------------------------------------------------ component */

const DEMO_DIRS: (1 | -1)[] = [1, -1, 1, 1, -1];

export default function LeadMatch({ accent = "#D9F24B", className, demo = false }: { accent?: string; className?: string; demo?: boolean }) {
  const [filter, setFilter] = useState<Filter>("All");
  const [index, setIndex] = useState(0);
  const [decisions, setDecisions] = useState<Record<string, 1 | -1>>({});
  const [dx, setDx] = useState(0);
  const [dy, setDy] = useState(0);
  const [drag, setDrag] = useState(false);
  const [flash, setFlash] = useState<0 | 1 | -1>(0);
  const [detail, setDetail] = useState(false);

  const dragging = useRef(false);
  const flicking = useRef(false);
  const start = useRef({ x: 0, y: 0 });
  const dxRef = useRef(0);
  const flashT = useRef<ReturnType<typeof setTimeout>>();
  const indexRef = useRef(0);
  indexRef.current = index;

  // scale-to-fit
  const wrapRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setScale(Math.min(1, e.contentRect.width / W)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const deck = useMemo(
    () => LEADS.filter((l) => filter === "All" || (filter === "Companies" ? l.type === "Company" : l.type === "Contact")),
    [filter]
  );
  const deckRef = useRef(deck);
  deckRef.current = deck;
  const current = deck[index] ?? null;

  const commit = useCallback((dir: 1 | -1) => {
    const cur = deckRef.current[indexRef.current];
    if (!cur) return;
    setDecisions((d) => ({ ...d, [cur.id]: dir }));
    setIndex((i) => i + 1);
    setDrag(false); setDx(0); setDy(0); setDetail(false);
    setFlash(dir);
    clearTimeout(flashT.current);
    flashT.current = setTimeout(() => setFlash(0), 320);
  }, []);

  const flick = useCallback((dir: 1 | -1) => {
    if (dragging.current || flicking.current || !deckRef.current[indexRef.current]) return;
    flicking.current = true;
    setDetail(false); setDrag(false); setDx(dir * 130); setDy(-8);
    setTimeout(() => { flicking.current = false; commit(dir); }, 180);
  }, [commit]);

  // drag handling — tracked on window so it survives leaving the card
  const pt = (e: PointerEvent | MouseEvent | TouchEvent | React.PointerEvent) => {
    const t = ("touches" in e && e.touches[0]) || ("changedTouches" in e && e.changedTouches[0]) || (e as MouseEvent);
    return { x: t.clientX, y: t.clientY };
  };

  const onMove = useCallback((e: PointerEvent) => {
    if (!dragging.current) return;
    const p = pt(e);
    dxRef.current = (p.x - start.current.x) / (scaleRef.current || 1);
    setDx(dxRef.current);
    setDy(((p.y - start.current.y) / (scaleRef.current || 1)) * 0.25);
  }, []);

  const onUp = useCallback(() => {
    if (!dragging.current) return;
    dragging.current = false;
    window.removeEventListener("pointermove", onMove);
    window.removeEventListener("pointerup", onUp);
    window.removeEventListener("pointercancel", onUp);
    const d = dxRef.current;
    if (d > THRESHOLD) commit(1);
    else if (d < -THRESHOLD) commit(-1);
    else { setDrag(false); setDx(0); setDy(0); }
  }, [commit, onMove]);

  const scaleRef = useRef(1);
  scaleRef.current = scale;

  const onDown = (e: React.PointerEvent) => {
    if (dragging.current || (e.target as HTMLElement).closest("button")) return;
    dragging.current = true;
    dxRef.current = 0;
    start.current = pt(e);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    setDrag(true); setDx(0); setDy(0);
  };

  useEffect(() => () => {
    window.removeEventListener("pointermove", onMove);
    window.removeEventListener("pointerup", onUp);
    window.removeEventListener("pointercancel", onUp);
    clearTimeout(flashT.current);
  }, [onMove, onUp]);

  // demo: drag the top card off on its own, then deal the deck back in
  useEffect(() => {
    if (!demo) return;
    let raf = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let step = 0;
    const swipe = () => {
      if (indexRef.current >= DEMO_DIRS.length) {
        setIndex(0); setDecisions({});
        timer = setTimeout(swipe, 1300);
        return;
      }
      const dir = DEMO_DIRS[step++ % DEMO_DIRS.length];
      const t0 = performance.now();
      setDrag(true);
      const tick = (now: number) => {
        const p = Math.min(1, (now - t0) / 650);
        const e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
        setDx(dir * 140 * e);
        setDy(-10 * Math.sin(Math.PI * p));
        if (p < 1) raf = requestAnimationFrame(tick);
        else {
          commit(dir);
          timer = setTimeout(swipe, 1100);
        }
      };
      raf = requestAnimationFrame(tick);
    };
    timer = setTimeout(swipe, 700);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
      setDrag(false); setDx(0); setDy(0);
    };
  }, [demo, commit]);

  const pickFilter = (f: Filter) => {
    setFilter(f); setIndex(0); setDecisions({}); setDx(0); setDy(0); setDrag(false); setDetail(false);
  };
  const undo = () => {
    if (index === 0) return;
    const prev = deck[index - 1];
    setDecisions((d) => { const n = { ...d }; if (prev) delete n[prev.id]; return n; });
    setIndex(index - 1); setDetail(false);
  };
  const reset = () => { setIndex(0); setDecisions({}); setDetail(false); };

  const remaining = Math.max(0, deck.length - index);
  const added = Object.values(decisions).filter((v) => v === 1).length;
  const isEmpty = index >= deck.length;
  const sheetOpen = detail && !!current;
  const t = current ?? LEADS[0];
  const segColors = [accent, "#9A9AA3", "#55555D"];

  // action button animation
  let pp = clamp01(-dx / THRESHOLD);
  let ap = clamp01(dx / THRESHOLD);
  if (flash === -1) pp = 1;
  if (flash === 1) ap = 1;
  const btnTr = drag
    ? "transform 90ms linear, background-color 90ms linear, opacity 90ms linear"
    : "transform 420ms cubic-bezier(.34,1.56,.64,1), background-color 260ms ease, opacity 260ms ease";
  const cardEase = "transform 480ms cubic-bezier(.2,.9,.25,1), background-color 320ms ease, opacity 320ms ease";

  const font = "'Manrope', system-ui, sans-serif";

  return (
    <div ref={wrapRef} className={className} style={{ width: "100%", maxWidth: W }}>
      <style>{`.lm-root button { font-family: inherit; }
        .lm-root button:focus-visible { outline: 2px solid ${INK}; outline-offset: 2px; }`}</style>
      <div style={{ width: W * scale, height: H * scale }}>
        <div
          className="lm-root"
          onKeyDown={(e) => {
            if (e.key === "Escape" && sheetOpen) { e.stopPropagation(); setDetail(false); }
          }}
          style={{
            width: W, height: H, transform: `scale(${scale})`, transformOrigin: "0 0",
            position: "relative", overflow: "clip", borderRadius: 56, backgroundColor: BG,
            fontFamily: font, color: INK, WebkitFontSmoothing: "antialiased",
          }}
        >
          {/* Dynamic Island + status bar */}
          <div style={{ position: "absolute", top: 11, left: "50%", transform: "translateX(-50%)", width: 124, height: 36, borderRadius: 20, background: "#000", zIndex: 900 }} />
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 54, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "4px 30px 0 38px", boxSizing: "border-box", zIndex: 800 }}>
            <span style={{ fontSize: 16, fontWeight: 600, letterSpacing: "-0.01em" }}>9:41</span>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <svg width="18" height="12" viewBox="0 0 18 12" aria-hidden="true"><rect x="0" y="8" width="3" height="4" rx="1" fill={INK} /><rect x="5" y="5.5" width="3" height="6.5" rx="1" fill={INK} /><rect x="10" y="3" width="3" height="9" rx="1" fill={INK} /><rect x="15" y="0" width="3" height="12" rx="1" fill={INK} /></svg>
              <svg width="16" height="12" viewBox="0 0 16 12" aria-hidden="true"><path d="M8 11.5l2.4-2.6a3.4 3.4 0 0 0-4.8 0z M3.6 6.9a6.2 6.2 0 0 1 8.8 0l1.4-1.5a8.3 8.3 0 0 0-11.6 0z M0.6 3.6a10.4 10.4 0 0 1 14.8 0L16 3a11.4 11.4 0 0 0-16 0z" fill={INK} /></svg>
              <svg width="27" height="13" viewBox="0 0 27 13" aria-hidden="true"><rect x="0.5" y="0.5" width="23" height="12" rx="3.5" fill="none" stroke={INK} strokeOpacity={0.4} /><rect x="2" y="2" width="20" height="9" rx="2" fill={INK} /><rect x="25" y="4.5" width="1.6" height="4" rx="0.8" fill={INK} fillOpacity={0.45} /></svg>
            </div>
          </div>

          {/* Header */}
          <div style={{ position: "absolute", top: 62, left: 20, right: 20, display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <h1 style={{ margin: 0, fontSize: 29, lineHeight: 1, fontWeight: 500, letterSpacing: "-0.03em" }}>Lead match</h1>
              <p style={{ margin: 0, fontSize: 14, color: MUTED }}>{remaining} to review · {added} added to pipeline</p>
            </div>
            <button aria-label="Filters" style={{ width: 44, height: 44, borderRadius: 22, border: "none", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={INK} strokeWidth={1.8} strokeLinecap="round" aria-hidden="true"><path d="M4 7h10M18 7h2M4 17h4M12 17h8" /><circle cx="16" cy="7" r="2" /><circle cx="10" cy="17" r="2" /></svg>
            </button>
          </div>

          {/* Filter chips */}
          <div style={{ position: "absolute", top: 150, left: 20, right: 20, display: "flex", justifyContent: "center", gap: 8 }}>
            {(["All", "Companies", "Contacts"] as Filter[]).map((f) => {
              const on = f === filter;
              return (
                <button key={f} onClick={() => pickFilter(f)} aria-pressed={on}
                  style={{ height: 38, padding: "0 16px", borderRadius: 19, border: "none", fontSize: 14, fontWeight: 500, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, background: on ? INK : "#F4F4F7", color: on ? "#fff" : INK }}>
                  {f === "Companies" && <BuildingIcon />}
                  {f === "Contacts" && <ContactIcon />}
                  {f}
                  {f === "All" && (
                    <span style={{ minWidth: 20, height: 20, padding: "0 6px", boxSizing: "border-box", borderRadius: 10, fontSize: 11, fontWeight: 600, color: INK, display: "flex", alignItems: "center", justifyContent: "center", background: accent }}>
                      {filter === "All" ? remaining : LEADS.length}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Card stack */}
          <div style={{ position: "absolute", top: 204, left: 20, right: 20, height: 456 }}>
            {isEmpty && (
              <div style={{ position: "absolute", left: 0, right: 0, top: 36, height: 420, borderRadius: 34, border: "1.5px dashed #C4C4C0", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, textAlign: "center", padding: 32, boxSizing: "border-box" }}>
                <span style={{ fontSize: 72, fontWeight: 200, lineHeight: 1, letterSpacing: "-0.04em" }}>{added}</span>
                <p style={{ margin: 0, fontSize: 22, fontWeight: 500, letterSpacing: "-0.02em" }}>You’re through today’s matches</p>
                <p style={{ margin: 0, fontSize: 14, color: MUTED, maxWidth: 240 }}>New leads are scored every morning against your ideal customer profile.</p>
                <button onClick={reset} style={{ marginTop: 6, height: 44, padding: "0 22px", borderRadius: 22, border: "none", background: INK, color: "#fff", fontSize: 14, fontWeight: 500, cursor: "pointer" }}>Review again</button>
              </div>
            )}

            {deck.map((lead, i) => {
              const d = i - index;
              let transform = "none";
              let bg = accent;
              let op = 1;
              let content = 1;
              let z = 100 - d;
              if (d < 0) {
                const dir = decisions[lead.id] || -1;
                transform = `translate(${dir * 560}px, 60px) rotate(${dir * 18}deg)`;
                z = 200 + i;
              } else if (d === 0) {
                transform = `translate(${dx}px, ${dy}px) rotate(${dx * 0.05}deg)`;
              } else {
                transform = d === 1 ? "translateY(-16px) scale(0.94)" : "translateY(-32px) scale(0.88)";
                bg = BACK_CARD;
                content = 0;
                if (d > 2) op = 0;
              }
              const top = d === 0;
              const contact = lead.type === "Contact";
              return (
                <div key={lead.id} onPointerDown={top ? onDown : undefined} aria-hidden={!top}
                  style={{
                    position: "absolute", left: 0, right: 0, top: 36, height: 420, borderRadius: 34, boxSizing: "border-box", overflow: "hidden",
                    touchAction: "none", userSelect: "none", cursor: top ? (drag ? "grabbing" : "grab") : "default", transformOrigin: "50% 0%",
                    boxShadow: "0 -4px 14px rgba(20,20,20,0.08), 0 2px 6px rgba(20,20,20,0.06), 0 16px 36px rgba(20,20,20,0.14)",
                    transform, transition: top && drag ? "none" : cardEase, backgroundColor: bg, zIndex: z, opacity: op, pointerEvents: top ? "auto" : "none",
                  }}>
                  <svg width="300" height="300" viewBox="0 0 300 300" aria-hidden="true" style={{ position: "absolute", right: -110, top: 40, pointerEvents: "none", transition: "opacity 260ms ease", opacity: content }}>
                    <g fill="none" stroke={INK} strokeOpacity={0.09} strokeWidth={1}>
                      {[40, 62, 84, 106, 128, 149].map((r) => <circle key={r} cx="150" cy="150" r={r} />)}
                    </g>
                  </svg>
                  <div style={{ position: "absolute", inset: 0, padding: 22, boxSizing: "border-box", display: "flex", flexDirection: "column", justifyContent: "space-between", transition: "opacity 260ms ease", opacity: content }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 48, height: 48, borderRadius: 24, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 600, letterSpacing: "0.02em", background: contact ? INK : "#fff", color: contact ? "#fff" : INK }}>{lead.initials}</div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 14, fontWeight: 600 }}>{contact ? <ContactIcon /> : <BuildingIcon />}{lead.type}</span>
                        <span style={{ fontSize: 13, color: "rgba(20,20,20,0.78)" }}>{lead.meta}</span>
                      </div>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      <h2 style={{ margin: 0, fontSize: 32, lineHeight: 1.02, fontWeight: 500, letterSpacing: "-0.03em" }}>{lead.name}</h2>
                      <span style={{ fontSize: 14, color: "rgba(20,20,20,0.78)" }}>{lead.sub}</span>
                    </div>

                    <div style={{ display: "flex", alignItems: "flex-end", gap: 10 }}>
                      <span style={{ fontSize: 116, lineHeight: 0.82, fontWeight: 200, letterSpacing: "-0.055em" }}>{lead.match}</span>
                      <span style={{ fontSize: 13, lineHeight: 1.2, fontWeight: 500, paddingBottom: 6, whiteSpace: "nowrap" }}>% match score</span>
                    </div>

                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {lead.signals.map((s) => (
                        <span key={s} style={{ fontSize: 12, fontWeight: 500, padding: "6px 10px", borderRadius: 999, background: "rgba(255,255,255,0.55)" }}>{s}</span>
                      ))}
                    </div>

                    <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        <span style={{ fontSize: 12, color: "rgba(20,20,20,0.78)" }}>Est. ARR</span>
                        <span style={{ fontSize: 24, fontWeight: 500, letterSpacing: "-0.02em" }}>{lead.value}</span>
                      </div>
                      <button onClick={() => setDetail(true)} tabIndex={top ? 0 : -1}
                        style={{ height: 44, padding: "0 20px", borderRadius: 22, border: "none", background: INK, color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>See details</button>
                    </div>
                  </div>

                  {/* swipe stamps */}
                  <div style={{ ...stamp, transform: "translateX(-50%) rotate(-6deg)", background: INK, color: "#fff", opacity: top ? clamp01(dx / THRESHOLD) : 0 }}>+ ADD TO PIPELINE</div>
                  <div style={{ ...stamp, transform: "translateX(-50%) rotate(6deg)", background: "#E4E4E0", color: INK, opacity: top ? clamp01(-dx / THRESHOLD) : 0 }}>PASS</div>
                </div>
              );
            })}
          </div>

          {/* Actions */}
          <div style={{ position: "absolute", top: 680, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 20 }}>
              <button aria-label="Pass on lead" onClick={() => flick(-1)}
                style={{ ...roundBtn, boxShadow: "0 6px 16px rgba(20,20,20,0.10)", background: mix("#FFFFFF", PASS_RED, pp), transform: `scale(${1 + 0.22 * pp - 0.12 * ap}) rotate(${Math.round(-90 * pp)}deg)`, opacity: 1 - 0.45 * ap, transition: btnTr }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={pp > 0.5 ? "#fff" : INK} strokeWidth={2} strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
              </button>
              <button aria-label="Add lead to pipeline" onClick={() => flick(1)}
                style={{ ...roundBtn, boxShadow: "0 6px 16px rgba(20,20,20,0.18)", background: INK, transform: `scale(${1 + 0.22 * ap - 0.12 * pp}) rotate(${Math.round(90 * ap)}deg)`, opacity: 1 - 0.45 * pp, transition: btnTr }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2} strokeLinecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>
              </button>
            </div>
            <button aria-label="Undo" onClick={undo} disabled={index === 0}
              style={{ width: 44, height: 44, borderRadius: 22, border: "none", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: index === 0 ? "default" : "pointer", opacity: index === 0 ? 0.4 : 1 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={INK} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 14L4 9l5-5" /><path d="M4 9h10a6 6 0 0 1 0 12h-3" /></svg>
            </button>
          </div>

          {/* Detail sheet */}
          <button aria-label="Close details" onClick={() => setDetail(false)} tabIndex={sheetOpen ? 0 : -1}
            style={{ position: "absolute", inset: 0, zIndex: 700, border: "none", padding: 0, margin: 0, cursor: "default", background: "rgba(20,20,20,0.42)", transition: "opacity 420ms ease", opacity: sheetOpen ? 1 : 0, pointerEvents: sheetOpen ? "auto" : "none" }} />
          <div role="dialog" aria-label={`${t.name} details`} aria-hidden={!sheetOpen}
            style={{
              position: "absolute", left: 0, right: 0, bottom: 0, height: 676, zIndex: 710, willChange: "transform",
              boxShadow: "0 -12px 40px rgba(0,0,0,0.18)", transition: "transform 560ms cubic-bezier(0.32, 0.72, 0, 1)",
              transform: sheetOpen ? "translateY(0)" : "translateY(calc(100% + 24px))", pointerEvents: sheetOpen ? "auto" : "none",
              background: SHEET, color: "#fff", borderRadius: "34px 34px 56px 56px", padding: "14px 22px 34px", boxSizing: "border-box",
              display: "flex", flexDirection: "column", gap: 22,
            }}>
            <div style={{ alignSelf: "center", width: 40, height: 5, borderRadius: 3, background: "#3A3A38" }} />

            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 52, height: 52, borderRadius: 26, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 600, background: accent, color: INK }}>{t.initials}</div>
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2, minWidth: 0 }}>
                <span style={{ fontSize: 22, fontWeight: 500, letterSpacing: "-0.02em" }}>{t.name}</span>
                <span style={{ fontSize: 13, color: MUTED_DARK }}>{t.sub}</span>
              </div>
              <button aria-label="Close details" onClick={() => setDetail(false)} tabIndex={sheetOpen ? 0 : -1}
                style={{ width: 44, height: 44, borderRadius: 22, border: "none", background: "#2A2A28", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2} strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <span style={eyebrow}>Company snapshot</span>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 8 }}>
                {t.facts.map((f) => (
                  <div key={f.k} style={{ padding: "12px 14px", borderRadius: 16, background: "#222220", display: "flex", flexDirection: "column", gap: 4 }}>
                    <span style={{ fontSize: 12, color: MUTED_DARK }}>{f.k}</span>
                    <span style={{ fontSize: 16, fontWeight: 500 }}>{f.v}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <span style={eyebrow}>Estimated ARR</span>
              <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
                <span style={{ fontSize: 64, lineHeight: 0.85, fontWeight: 200, letterSpacing: "-0.05em", color: accent }}>{t.value}</span>
                <div style={{ display: "flex", flexDirection: "column", gap: 2, alignItems: "flex-end" }}>
                  <span style={{ fontSize: 12, color: MUTED_DARK }}>Likely range</span>
                  <span style={{ fontSize: 14, fontWeight: 500 }}>{t.range}</span>
                </div>
              </div>
              <div style={{ display: "flex", gap: 3, height: 10 }}>
                {t.arr.map((a, i) => <div key={a.label} style={{ height: 10, borderRadius: 5, width: a.w, background: segColors[i] }} />)}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {t.arr.map((a, i) => (
                  <div key={a.label} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 8, height: 8, borderRadius: 4, flex: "none", background: segColors[i] }} />
                    <span style={{ flex: 1, fontSize: 14, color: "#E4E4E0" }}>{a.label}</span>
                    <span style={{ fontSize: 14, fontWeight: 500 }}>{a.v}</span>
                  </div>
                ))}
              </div>
              <p style={{ margin: 0, fontSize: 12, lineHeight: 1.4, color: MUTED_DARK }}>{t.basis}</p>
            </div>

            <div style={{ marginTop: "auto", display: "flex", gap: 10 }}>
              <button onClick={() => flick(-1)} tabIndex={sheetOpen ? 0 : -1}
                style={{ height: 52, padding: "0 24px", borderRadius: 26, border: "1.5px solid #3A3A38", background: "transparent", color: "#fff", fontSize: 15, fontWeight: 500, cursor: "pointer" }}>Pass</button>
              <button onClick={() => flick(1)} tabIndex={sheetOpen ? 0 : -1}
                style={{ flex: 1, height: 52, borderRadius: 26, border: "none", background: accent, color: INK, fontSize: 15, fontWeight: 600, cursor: "pointer" }}>Add to pipeline</button>
            </div>
          </div>

          {/* Home indicator */}
          <div style={{ position: "absolute", bottom: 8, left: "50%", transform: "translateX(-50%)", width: 134, height: 5, borderRadius: 3, background: INK, zIndex: 950 }} />
        </div>
      </div>
    </div>
  );
}

const stamp: React.CSSProperties = {
  position: "absolute", top: 26, left: "50%", padding: "8px 14px", borderRadius: 12, fontSize: 14, fontWeight: 600,
  letterSpacing: "0.04em", whiteSpace: "nowrap", pointerEvents: "none",
};
const roundBtn: React.CSSProperties = {
  width: 64, height: 64, borderRadius: 32, border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
};
const eyebrow: React.CSSProperties = {
  fontSize: 12, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.06em", color: MUTED_DARK,
};
