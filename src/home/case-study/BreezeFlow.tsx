import { useEffect, useId, useState } from 'react'
import { useReducedMotion } from '../hooks'
import { useLive } from './primitives'
import s from './BreezeFlow.module.css'

const PROMPT = 'Tell me about the deals that have been created in the Campaign Pipeline in my CRM'
const INTRO = 'I’m checking your CRM records to find the most recently created deal.'
const CREATED = [
  37, 13, 24, 24, 45, 40, 40, 33, 33, 57, 57, 68, 68, 58, 57, 57, 57, 46, 46, 57, 57, 51, 56, 54, 56, 56, 67, 60, 60, 44, 44, 57, 57, 68, 63, 78, 78, 67,
  67, 61, 60, 51, 78, 78, 78, 84, 83, 68, 72, 72, 87, 87, 121, 121, 112, 115, 125,
]
const WON = CREATED.map((v, i) => Math.max(1, Math.round(v * 0.22 + 4 * Math.sin(i * 1.7) + (i % 5 === 0 ? 3 : 0))))
const SUGGESTIONS = ['Catch me up on what I missed today', 'Help me prepare for my next meeting', 'What should I focus on this week?']
const KB = { r1: 'QWERTYUIOP'.split(''), r2: 'ASDFGHJKL'.split(''), r3: 'ZXCVBNM'.split('') }

const L = (() => {
  const toBreeze = 2000
  const typeAt = 2900
  const typeMs = 28
  const typeEnd = typeAt + PROMPT.length * typeMs
  const sendAt = typeEnd + 450
  const chatAt = sendAt + 120
  const bubbleAt = chatAt + 250
  const agentAt = bubbleAt + 550
  const introAt = agentAt + 650
  const wordMs = 55
  const introEnd = introAt + INTRO.split(' ').length * wordMs
  const checkAt = introEnd + 200
  const checkedAt = checkAt + 1000
  const cardAt = checkedAt + 250
  const chartAt = cardAt + 650
  const footAt = chartAt + 1100
  const scrollAt = chartAt + 1500
  return { toBreeze, typeAt, typeMs, sendAt, chatAt, bubbleAt, agentAt, introAt, wordMs, checkAt, checkedAt, cardAt, chartAt, footAt, scrollAt, end: scrollAt + 1200 }
})()

const STILL = L.end
const TICK = 33
const HOLD = 3500

type Tab = 'created' | 'won'
type FlowState = { t: number; tab: Tab; chartAt: number | null }

const clamp = (x: number) => Math.max(0, Math.min(1, x))
const ease = (x: number) => 1 - Math.pow(1 - x, 3)
const inOut = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2)

function words(text: string, start: number, now: number, ms: number) {
  if (now < start) return []
  const all = text.split(' ')
  const n = Math.min(all.length, Math.floor((now - start) / ms) + 1)
  const out: { w: string; o: number; b: number }[] = []
  for (let i = 0; i < n; i++) {
    const p = clamp((now - start - i * ms) / 280)
    out.push({ w: all[i] + (i < all.length - 1 ? ' ' : ''), o: p, b: (1 - p) * 3 })
  }
  return out
}

function chart(tab: Tab) {
  const data = tab === 'won' ? WON : CREATED
  const max = tab === 'won' ? 40 : 200
  const x0 = 28
  const x1 = 330
  const base = 194
  const top = 9
  const pts = data.map((val, i) => [x0 + (i * (x1 - x0)) / (data.length - 1), base - (val / max) * (base - top)])
  const linePath = pts.map((q, i) => (i ? 'L' : 'M') + q[0].toFixed(1) + ' ' + q[1].toFixed(1)).join(' ')
  const areaPath = `${linePath} L${x1} ${base} L${x0} ${base} Z`
  let len = 0
  for (let i = 1; i < pts.length; i++) len += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1])
  return { max, linePath, areaPath, len: Math.ceil(len) + 2, last: pts[pts.length - 1] }
}

const CHARTS = { created: chart('created'), won: chart('won') }

const SPARK =
  'M23.5597 11.6424H23.5261C20.6797 11.6256 18.3757 9.312 18.3757 6.4608C18.3757 6.2616 18.2149 6.1008 18.0157 6.1008C17.8165 6.1008 17.6557 6.2616 17.6557 6.4608C17.6557 9.312 15.3541 11.6256 12.5053 11.6424H12.4357V0.36C12.4357 0.1608 12.2749 0 12.0757 0H12.0733C11.8765 0 11.7181 0.1584 11.7181 0.3552C11.7181 6.588 6.66613 11.64 0.433325 11.64C0.236525 11.64 0.078125 11.7984 0.078125 11.9952V12.0024C0.078125 12.1872 0.219725 12.3384 0.399725 12.3552C0.411725 12.3552 0.426125 12.3552 0.438125 12.3552H0.459725C6.68053 12.3672 11.7205 17.4144 11.7205 23.64C11.7205 23.8368 11.8789 23.9976 12.0757 23.9976H12.0853C12.2821 23.9976 12.4405 23.8392 12.4405 23.6424V12.3576H12.5077C15.3541 12.3744 17.6581 14.688 17.6581 17.5392C17.6581 17.7384 17.8189 17.8992 18.0181 17.8992C18.2173 17.8992 18.3781 17.7384 18.3781 17.5392C18.3781 14.688 20.6797 12.3744 23.5285 12.3576H23.5621C23.7613 12.3576 23.9221 12.1968 23.9221 11.9976C23.9221 11.7984 23.7613 11.6376 23.5621 11.6376L23.5597 11.6424Z'

const TASKS_ICON = (
  <svg width="18" height="18" viewBox="0 0 20 20" fill="#141414">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M6.25154 13.7497C6.59507 13.7499 6.8764 14.0312 6.87654 14.3747V16.8747C6.87654 17.2184 6.59515 17.4995 6.25154 17.4997H3.75154C3.40779 17.4997 3.12654 17.2185 3.12654 16.8747V14.3747C3.12668 14.0311 3.40787 13.7497 3.75154 13.7497H6.25154ZM4.37654 16.2497H5.62654V14.9997H4.37654V16.2497Z"
    />
    <path d="M17.5015 14.9997C17.8451 14.9999 18.1264 15.2812 18.1265 15.6247C18.1265 15.9684 17.8451 16.2495 17.5015 16.2497H9.37654C9.03279 16.2497 8.75154 15.9685 8.75154 15.6247C8.75168 15.2811 9.03287 14.9997 9.37654 14.9997H17.5015Z" />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M6.25154 8.12471C6.59507 8.12487 6.8764 8.40617 6.87654 8.74971V11.2497C6.87654 11.5934 6.59515 11.8745 6.25154 11.8747H3.75154C3.40779 11.8747 3.12654 11.5935 3.12654 11.2497V8.74971C3.12668 8.40607 3.40787 8.12471 3.75154 8.12471H6.25154ZM4.37654 10.6247H5.62654V9.37471H4.37654V10.6247Z"
    />
    <path d="M17.5015 9.37471C17.8451 9.37487 18.1264 9.65617 18.1265 9.99971C18.1265 10.3434 17.8451 10.6245 17.5015 10.6247H9.37654C9.03279 10.6247 8.75154 10.3435 8.75154 9.99971C8.75168 9.65607 9.03287 9.37471 9.37654 9.37471H17.5015Z" />
    <path d="M6.4261 2.6877C6.66985 2.44395 7.0637 2.44395 7.30745 2.6877C7.55108 2.93142 7.55107 3.3247 7.30745 3.56843L4.80745 6.06843C4.684 6.19188 4.53015 6.24771 4.36982 6.2491C4.20965 6.24746 4.05615 6.1856 3.93281 6.06843L2.68281 4.81843C2.43906 4.57468 2.43906 4.18145 2.68281 3.9377C2.92656 3.69398 3.31981 3.69396 3.56355 3.9377L4.36982 4.74397L6.4261 2.6877Z" />
    <path d="M17.5015 3.74971C17.8451 3.74987 18.1264 4.03117 18.1265 4.37471C18.1265 4.71836 17.8451 4.99954 17.5015 4.99971H9.37654C9.03279 4.99971 8.75154 4.71846 8.75154 4.37471C8.75168 4.03107 9.03287 3.74971 9.37654 3.74971H17.5015Z" />
  </svg>
)

const MORE_ICON = (
  <svg width="22" height="22" viewBox="0 0 20 20" fill="currentColor">
    <circle cx="10" cy="16.25" r="1.25" />
    <circle cx="10" cy="10" r="1.25" />
    <circle cx="10" cy="3.75" r="1.25" />
  </svg>
)

const MIC_ICON = (size: number) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
    <rect x="9" y="3" width="6" height="11" rx="3" />
    <path d="M5 11a7 7 0 0 0 14 0M12 18v3M9 21h6" />
  </svg>
)

const PLUS_ICON = (size: number) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
    <path d="M12 4v16M4 12h16" />
  </svg>
)

const WAVE_ICON = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <path d="M4 10v4M8 7v10M12 4v16M16 7v10M20 10v4" />
  </svg>
)

const FOOT_ICONS = [
  <>
    <path d="M8 9H5v12h14V9h-3" />
    <path d="M12 15V3M8 7l4-4 4 4" />
  </>,
  <>
    <rect x="8" y="8" width="13" height="13" rx="2" strokeDasharray="3 2.5" />
    <path d="M16 4H5a2 2 0 0 0-2 2v10" />
  </>,
  <>
    <path d="M7 10v11H3V10z" />
    <path d="M7 10l4-8a3 3 0 0 1 3 3v4h5.5a2 2 0 0 1 2 2.3l-1.4 7.5a2 2 0 0 1-2 1.7H7" />
  </>,
  <>
    <path d="M17 14V3h4v11z" />
    <path d="M17 14l-4 8a3 3 0 0 1-3-3v-4H4.5a2 2 0 0 1-2-2.3l1.4-7.5a2 2 0 0 1 2-1.7H17" />
  </>,
  <>
    <path d="M3 3l18 18" />
    <path d="M8 8a4 4 0 0 0-1 3v3a5 5 0 0 0 9 3M17 13v-2a5 5 0 0 0-7.5-4.3" />
    <path d="M3 12h4M17 12h4M5 19l2.5-2M19 5l-2 2M5 5l2 2" />
  </>,
]

const NAV = [
  {
    label: 'Home',
    paths: [
      'M18.7484 11.9998C19.1606 12 19.4982 12.3375 19.4984 12.7498V20.2498C19.4984 20.6621 19.1608 20.9996 18.7484 20.9998H14.2484C13.8359 20.9998 13.4984 20.6623 13.4984 20.2498V14.9998H10.4984V20.2498C10.4984 20.6621 10.1608 20.9996 9.74843 20.9998H5.24843C4.83593 20.9998 4.49843 20.6623 4.49843 20.2498V12.7498C4.49862 12.3374 4.83604 11.9998 5.24843 11.9998C5.66065 12 5.99824 12.3375 5.99843 12.7498V19.4998H8.99843V14.2498C8.99862 13.8374 9.33604 13.4998 9.74843 13.4998H14.2484C14.6606 13.5 14.9982 13.8375 14.9984 14.2498V19.4998H17.9984V12.7498C17.9986 12.3374 18.336 11.9998 18.7484 11.9998Z',
      'M11.4652 1.71729C11.7577 1.42491 12.2303 1.42502 12.5228 1.71729L20.7728 9.96729C21.0653 10.2598 21.0653 10.7324 20.7728 11.0249C20.6228 11.1749 20.4354 11.2424 20.2404 11.2424L20.2477 11.2498C20.0528 11.2497 19.8652 11.1754 19.7152 11.033L11.9977 3.31544L4.28017 11.033C3.98776 11.325 3.5157 11.325 3.22328 11.033C2.93078 10.7405 2.93078 10.2678 3.22328 9.97535L11.4652 1.71729Z',
    ],
    evenOdd: [false, false],
  },
  {
    label: 'Contacts',
    paths: [
      'M12.8701 13.5447C14.1451 13.5447 15.3077 14.2577 15.9001 15.3977C16.0949 15.7651 15.9525 16.2149 15.5852 16.4099C15.4728 16.4699 15.3527 16.4926 15.2402 16.4927V16.5C14.9702 16.5 14.7073 16.35 14.5723 16.095C14.2348 15.4501 13.5825 15.0528 12.8701 15.0527C12.1576 15.0527 11.5047 15.45 11.1672 16.095C10.9797 16.4624 10.5225 16.6049 10.155 16.4099C9.78757 16.2224 9.64518 15.7652 9.84009 15.3977C10.4326 14.2577 11.5951 13.5447 12.8701 13.5447Z',
      'M12.8701 6.75C14.3176 6.75 15.4951 7.9275 15.4951 9.375C15.4951 10.8225 14.3176 12 12.8701 12C11.4226 12 10.2451 10.8225 10.2451 9.375C10.2451 7.9275 11.4226 6.75 12.8701 6.75ZM12.8701 8.25C12.2476 8.25 11.7451 8.7525 11.7451 9.375C11.7451 9.9975 12.2476 10.5 12.8701 10.5C13.4926 10.5 13.9951 9.9975 13.9951 9.375C13.9951 8.7525 13.4926 8.25 12.8701 8.25Z',
      'M18 3C19.2375 3 20.25 4.0125 20.25 5.25V18.75C20.25 19.9875 19.2375 21 18 21H7.5C6.2625 21 5.25 19.9875 5.25 18.75V16.5H4.5C4.0875 16.5 3.75 16.1625 3.75 15.75C3.75 15.3375 4.0875 15 4.5 15H5.25V12.75H4.5C4.0875 12.75 3.75 12.4125 3.75 12C3.75 11.5875 4.0875 11.25 4.5 11.25H5.25V9H4.5C4.0875 9 3.75 8.6625 3.75 8.25C3.75 7.8375 4.0875 7.5 4.5 7.5H5.25V5.25C5.25 4.0125 6.2625 3 7.5 3H18ZM7.5 4.5C7.0875 4.5 6.75 4.8375 6.75 5.25V7.5H7.5C7.9125 7.5 8.25 7.8375 8.25 8.25C8.25 8.6625 7.9125 9 7.5 9H6.75V11.25H7.5C7.9125 11.25 8.25 11.5875 8.25 12C8.25 12.4125 7.9125 12.75 7.5 12.75H6.75V15H7.5C7.9125 15 8.25 15.3375 8.25 15.75C8.25 16.1625 7.9125 16.5 7.5 16.5H6.75V18.75C6.75 19.1625 7.0875 19.5 7.5 19.5H18C18.4125 19.5 18.75 19.1625 18.75 18.75V5.25C18.75 4.8375 18.4125 4.5 18 4.5H7.5Z',
    ],
    evenOdd: [false, true, true],
  },
  {
    label: 'Deals',
    paths: [
      'M11.6773 5.20695C12.7584 4.58305 14.1043 4.52041 15.2374 5.09223C15.2571 5.10536 15.2774 5.11179 15.2971 5.12492L17.18 6.29327L21.4791 5.18452C21.7021 5.12555 21.9447 5.17764 22.1283 5.31526C22.3121 5.45964 22.4174 5.67648 22.4174 5.90617V15.9406C22.4174 16.354 22.0828 16.6884 21.6695 16.6886L21.656 16.6822C21.2426 16.6821 20.9082 16.3476 20.9081 15.9342V6.87071L17.2396 7.82244C17.0427 7.87494 16.8323 7.8422 16.6551 7.7372L14.5357 6.42465C13.7154 6.03094 12.7179 6.17522 12.0419 6.79188L8.79326 9.92906C9.61359 10.3621 10.644 10.2771 11.3921 9.64707L12.5534 8.66265C12.7962 8.45921 13.1378 8.42632 13.4135 8.58382L17.305 10.8346C17.3232 10.8452 17.3406 10.8568 17.3575 10.8686C17.8417 11.1725 18.1912 11.6406 18.3419 12.1933C18.4994 12.7707 18.4207 13.381 18.1189 13.8994C17.9251 14.2323 17.6548 14.5051 17.3338 14.6999C17.4108 14.8467 17.4724 15.0028 17.5152 15.1664C17.6726 15.7438 17.5939 16.3542 17.2922 16.8725C16.9903 17.3909 16.5044 17.7647 15.927 17.9223C15.7302 17.9748 15.5329 18.0011 15.3426 18.0011L15.3297 17.9947C15.0326 17.9947 14.7355 17.9324 14.4562 17.8146C14.4115 18.0715 14.3224 18.3216 14.1877 18.5529C13.8858 19.0713 13.4 19.4452 12.8226 19.6027C12.6258 19.6552 12.4289 19.6815 12.2387 19.6815V19.6751C11.8515 19.6751 11.4637 19.5702 11.1159 19.3733L3.85773 15.1857H2.906V15.9342C2.90591 16.3476 2.57144 16.6821 2.15808 16.6822C1.74468 16.6822 1.41025 16.3476 1.41016 15.9342V5.89976C1.41016 5.4863 1.74463 5.15119 2.15808 5.15119C2.57149 5.15124 2.906 5.48633 2.906 5.89976V13.6898H4.06089C4.19209 13.6898 4.32364 13.7223 4.43518 13.7879L11.8644 18.08C12.035 18.1784 12.2386 18.2049 12.4355 18.1524C12.6257 18.0998 12.7895 17.975 12.8879 17.8044C12.9864 17.6337 13.0129 17.4302 12.9604 17.2333C12.9078 17.0365 12.7829 16.8793 12.6123 16.7809C12.6015 16.7745 12.5914 16.7671 12.5809 16.7604L11.2998 16.0259C10.9391 15.8224 10.8144 15.3632 11.0242 15.0024C11.2342 14.6414 11.6874 14.5168 12.0484 14.7268L14.9619 16.3938C15.139 16.4988 15.3426 16.5244 15.5329 16.4719C15.7232 16.4195 15.8876 16.2952 15.986 16.1246C16.0844 15.954 16.1103 15.7504 16.0578 15.5535C16.0053 15.3633 15.881 15.1989 15.7104 15.1004L15.1753 14.7934C15.1322 14.7724 15.0891 14.7506 15.0471 14.7268C15.0221 14.7123 14.9986 14.6961 14.976 14.6794L12.8027 13.4335C12.442 13.23 12.3173 12.7708 12.5271 12.41C12.7371 12.049 13.1903 11.9244 13.5513 12.1344L15.8815 13.4674C16.0355 13.5309 16.201 13.5437 16.3667 13.4995C16.5569 13.4469 16.7208 13.322 16.8192 13.1515C16.9176 12.9743 16.9441 12.7773 16.8916 12.5804C16.8391 12.3902 16.7142 12.2264 16.5436 12.128C16.5372 12.1242 16.5312 12.1197 16.525 12.1158L13.118 10.1457L12.363 10.7821C10.8142 12.0946 8.5043 11.9703 7.10642 10.4937C6.82422 10.1918 6.83081 9.72561 7.1327 9.43685L10.3897 6.29455C8.94275 5.94152 7.62913 7.21452 7.56594 7.27768C7.42164 7.41543 7.23142 7.49422 7.03464 7.4943V7.48789C6.9887 7.48789 6.93574 7.48756 6.8898 7.47443L5.00621 7.10079C4.59952 7.02197 4.33737 6.62167 4.41595 6.22149C4.4947 5.81459 4.88837 5.55183 5.29526 5.63058L6.80456 5.93244C7.82651 5.08604 9.78222 4.14503 11.6773 5.20695Z',
    ],
    evenOdd: [false],
  },
  {
    label: 'Tasks',
    paths: [
      'M7.50185 16.4996C7.91408 16.4998 8.25168 16.8374 8.25185 17.2496V20.2496C8.25185 20.662 7.91418 20.9995 7.50185 20.9996H4.50185C4.08935 20.9996 3.75185 20.6621 3.75185 20.2496V17.2496C3.75201 16.8373 4.08945 16.4996 4.50185 16.4996H7.50185ZM5.25185 19.4996H6.75185V17.9996H5.25185V19.4996Z',
      'M21.0018 17.9996C21.4141 17.9998 21.7517 18.3374 21.7518 18.7496C21.7518 19.162 21.4142 19.4995 21.0018 19.4996H11.2518C10.8393 19.4996 10.5018 19.1621 10.5018 18.7496C10.502 18.3373 10.8394 17.9996 11.2518 17.9996H21.0018Z',
      'M7.50185 9.74965C7.91408 9.74985 8.25168 10.0874 8.25185 10.4996V13.4996C8.25185 13.912 7.91418 14.2495 7.50185 14.2496H4.50185C4.08935 14.2496 3.75185 13.9121 3.75185 13.4996V10.4996C3.75201 10.0873 4.08945 9.74965 4.50185 9.74965H7.50185ZM5.25185 12.7496H6.75185V11.2496H5.25185V12.7496Z',
      'M21.0018 11.2496C21.4141 11.2498 21.7517 11.5874 21.7518 11.9996C21.7518 12.412 21.4142 12.7495 21.0018 12.7496H11.2518C10.8393 12.7496 10.5018 12.4121 10.5018 11.9996C10.502 11.5873 10.8394 11.2496 11.2518 11.2496H21.0018Z',
      'M7.71132 3.22523C8.00382 2.93273 8.47644 2.93273 8.76894 3.22523C9.0613 3.5177 9.06128 3.98964 8.76894 4.28212L5.76894 7.28212C5.6208 7.43025 5.43618 7.49726 5.24379 7.49892C5.05158 7.49696 4.86739 7.42272 4.71938 7.28212L3.21938 5.78212C2.92687 5.48962 2.92687 5.01773 3.21938 4.72523C3.51188 4.43277 3.98377 4.43275 4.27626 4.72523L5.24379 5.69276L7.71132 3.22523Z',
      'M21.0018 4.49965C21.4141 4.49985 21.7517 4.83741 21.7518 5.24965C21.7518 5.66203 21.4142 5.99945 21.0018 5.99965H11.2518C10.8393 5.99965 10.5018 5.66215 10.5018 5.24965C10.502 4.83729 10.8394 4.49965 11.2518 4.49965H21.0018Z',
    ],
    evenOdd: [true, false, true, false, false, false],
  },
  {
    label: 'Search',
    paths: [
      'M10.5 3C14.6325 3 18 6.3675 18 10.5C18 12.2925 17.34 13.9275 16.2825 15.2175L20.7825 19.7175V19.7249C21.075 20.0174 21.075 20.49 20.7825 20.7825C20.6325 20.925 20.445 21 20.25 21C20.055 21 19.8675 20.9325 19.7175 20.7825L15.2175 16.2825C13.9275 17.34 12.3 18 10.5 18C6.3675 18 3 14.6325 3 10.5C3 6.3675 6.3675 3 10.5 3ZM10.5 4.5C7.1925 4.5 4.5 7.1925 4.5 10.5C4.5 13.8075 7.1925 16.5 10.5 16.5C13.8075 16.5 16.5 13.8075 16.5 10.5C16.5 7.1925 13.8075 4.5 10.5 4.5Z',
    ],
    evenOdd: [true],
  },
]

export function BreezeFlow() {
  const [ref, live] = useLive<HTMLDivElement>()
  const reduce = useReducedMotion()
  const uid = useId().replace(/:/g, '')
  const [st, setSt] = useState<FlowState>(() => ({ t: reduce ? STILL : 0, tab: 'created', chartAt: null }))

  useEffect(() => {
    if (reduce) setSt((prev) => ({ ...prev, t: STILL, chartAt: null }))
  }, [reduce])

  useEffect(() => {
    if (!live) return
    const id = window.setInterval(() => {
      setSt((prev) => {
        const t = prev.t + TICK
        const ce = (prev.chartAt ?? L.chartAt) + 1700
        if (t > Math.max(L.end, ce) + HOLD) return { t: 0, tab: 'created', chartAt: null }
        return { ...prev, t }
      })
    }, TICK)
    return () => window.clearInterval(id)
  }, [live])

  const jump = (to: number) => {
    if (!reduce) setSt((prev) => ({ ...prev, t: to }))
  }
  const pick = (tab: Tab) => {
    setSt((prev) => (prev.tab === tab ? prev : { ...prev, tab, chartAt: reduce ? prev.t - 1500 : prev.t }))
  }
  const replay = () => setSt({ t: reduce ? STILL : 0, tab: 'created', chartAt: null })
  const openBreeze = () => {
    if (st.t < L.toBreeze) jump(L.toBreeze - 300)
  }
  const send = () => {
    if (st.t >= L.typeAt && st.t < L.sendAt) jump(L.sendAt - 200)
  }

  const { t, tab } = st
  const p = (at: number, d = 400) => ease(clamp((t - at) / d))

  const toB = p(L.toBreeze, 480)
  const toC = p(L.chatAt, 450)
  const kbUp = toB * (1 - toC)

  let typedN = 0
  if (t >= L.typeAt) typedN = Math.min(PROMPT.length, Math.floor((t - L.typeAt) / L.typeMs) + 1)
  const typed = t >= L.sendAt ? '' : PROMPT.slice(0, typedN)
  const hasText = typed.length > 0

  const isWon = tab === 'won'
  const c = CHARTS[tab]
  const step = c.max / 4
  const cs = st.chartAt ?? L.chartAt
  const cp = clamp((t - cs) / 1500)
  const ce = inOut(cp)
  const cardP = p(L.cardAt, 550)
  const bubP = p(L.bubbleAt, 400)
  const sugP = p(L.typeAt, 280)
  const caretO = Math.floor(t / 530) % 2 === 0 ? 1 : 0
  const gradPos = t < L.checkedAt ? 120 - ((t / 1800) % 1) * 220 : 0
  const shimPos = 120 - ((t / 1500) % 1) * 220
  const introWords = words(INTRO, L.introAt, t, L.wordMs)
  const yl = [String(c.max), String(step * 3), String(step * 2), String(step), '0']
  const ylTop = [1, 47, 93, 140, 186]
  const months = [
    { m: 'May', left: 58, width: 24 },
    { m: 'June', left: 112, width: 28 },
    { m: 'July', left: 169, width: 28 },
    { m: 'Aug', left: 226, width: 26 },
    { m: 'Sept', left: 282, width: 28 },
  ]
  const segOn = { background: '#0B4D4F', color: '#FFFFFF' }
  const segOff = { background: 'transparent', color: '#1F1F1F' }

  return (
    <div ref={ref} className={s.root} aria-hidden="true">
      <div className={s.layer} style={{ opacity: toB, transform: `translateY(${(1 - toB) * 40}px)` }}>
        {t >= L.chatAt && (
          <div className={s.chat} style={{ transform: `translateY(-${210 * inOut(clamp((t - L.scrollAt) / 950))}px)` }}>
            <div className={s.bubble} style={{ opacity: bubP, transform: `translateY(${(1 - bubP) * 12}px)` }}>
              {PROMPT}
            </div>

            {t >= L.agentAt && (
              <div className={s.agent} style={{ opacity: p(L.agentAt) }}>
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <defs>
                    <linearGradient id={`${uid}bz2`} x1="6.23564" y1="6.19718" x2="26.0135" y2="25.8484" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#D20688" />
                      <stop offset="0.23" stopColor="#FF4800" />
                      <stop offset="1" stopColor="#FBDDD2" />
                    </linearGradient>
                  </defs>
                  <path fill={`url(#${uid}bz2)`} d={SPARK} />
                </svg>
                <span className={s.agentText} style={{ backgroundPosition: `${gradPos}% 0` }}>
                  Checking your Campaign Pipeline
                </span>
                <svg
                  className={s.agentChev}
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#5E5E5E"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 6l6 6-6 6" />
                </svg>
              </div>
            )}

            <p className={s.intro}>
              {introWords.map((w, i) => (
                <span key={i} style={{ opacity: w.o, filter: `blur(${w.b}px)` }}>
                  {w.w}
                </span>
              ))}
            </p>

            <div className={s.status}>
              {t >= L.checkAt && t < L.checkedAt && (
                <span className={s.checking} style={{ backgroundPosition: `${shimPos}% 0` }}>
                  Checking latest deals created…
                </span>
              )}
              {t >= L.checkedAt && (
                <span className={s.checked} style={{ opacity: p(L.checkedAt, 300) }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 6l6 6-6 6" />
                  </svg>
                  Checked latest deals created
                </span>
              )}
            </div>

            {t >= L.cardAt && (
              <div className={s.card} style={{ opacity: cardP, transform: `translateY(${(1 - cardP) * 16}px)` }}>
                <div className={s.cardHead}>
                  <span className={s.cardIcon}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="#1F1F1F">
                      <path d="M6.75 12C7.1625 12 7.5 12.3375 7.5 12.75V17.25C7.5 17.6625 7.1625 18 6.75 18C6.3375 18 6 17.6625 6 17.25V12.75C6 12.3375 6.3375 12 6.75 12Z" />
                      <path d="M12.75 6C13.1625 6 13.5 6.3375 13.5 6.75C13.5 7.1625 13.1625 7.5 12.75 7.5H10.5V17.25C10.5 17.6625 10.1625 18 9.75 18C9.3375 18 9 17.6625 9 17.25V6.75C9 6.3375 9.3375 6 9.75 6H12.75Z" />
                      <path d="M17.25 9C17.6625 9 18 9.3375 18 9.75V17.25C18 17.6625 17.6625 18 17.25 18C16.8375 18 16.5 17.6625 16.5 17.25V10.5H14.25V17.25C14.25 17.6625 13.9125 18 13.5 18C13.0875 18 12.75 17.6625 12.75 17.25V9.75C12.75 9.3375 13.0875 9 13.5 9H17.25Z" />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M18.75 3C19.9875 3 21 4.0125 21 5.25V18.75C21 19.9875 19.9875 21 18.75 21H5.25C4.0125 21 3 19.9875 3 18.75V5.25C3 4.0125 4.0125 3 5.25 3H18.75ZM5.25 4.5C4.8375 4.5 4.5 4.8375 4.5 5.25V18.75C4.5 19.1625 4.8375 19.5 5.25 19.5H18.75C19.1625 19.5 19.5 19.1625 19.5 18.75V5.25C19.5 4.8375 19.1625 4.5 18.75 4.5H5.25Z"
                      />
                    </svg>
                  </span>
                  <div className={s.cardTitles}>
                    <span className={s.cardTitle}>Campaign pipeline report</span>
                    <span className={s.cardSub}>Chart artifact</span>
                  </div>
                  <span className={s.cardVer}>v1</span>
                </div>

                <div className={s.cardBody}>
                  <div className={s.chartHead} style={{ opacity: p(L.cardAt + 150) }}>
                    <span className={s.chartTitle}>Campaign pipeline</span>
                    <span className={s.chip}>Last 90 days</span>
                  </div>

                  <div className={s.seg} style={{ opacity: p(L.cardAt + 250) }}>
                    <button type="button" tabIndex={-1} className={s.segBtn} style={isWon ? segOff : segOn} onClick={() => pick('created')}>
                      Deal created
                    </button>
                    <button type="button" tabIndex={-1} className={s.segBtn} style={isWon ? segOn : segOff} onClick={() => pick('won')}>
                      Deals closed won
                    </button>
                  </div>

                  <div className={s.chartLabel} style={{ opacity: p(L.cardAt + 350) }}>
                    {isWon ? 'Deals closed won count' : 'Deals created count'}
                  </div>

                  <div className={s.chart}>
                    <svg className={s.chartSvg} width="330" height="226" viewBox="0 0 330 226">
                      <g style={{ opacity: p(L.cardAt + 350) }}>
                        {[9, 55, 101.5, 148, 194].map((y) => (
                          <line key={y} x1="30" x2="330" y1={y} y2={y} stroke="#E4E4E4" />
                        ))}
                      </g>
                      <path d={c.areaPath} fill="#EEF5FB" style={{ clipPath: `inset(0 ${(1 - ce) * 100}% 0 0)` }} />
                      <path
                        d={c.linePath}
                        fill="none"
                        stroke="#1D5BD8"
                        strokeWidth="1.8"
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        style={{ strokeDasharray: c.len, strokeDashoffset: c.len * (1 - ce) }}
                      />
                      <circle cx={c.last[0]} cy={c.last[1]} r="3.5" fill="#1D5BD8" style={{ opacity: cp >= 1 ? 1 : 0 }} />
                    </svg>
                    <div className={s.yLabels} style={{ opacity: p(L.cardAt + 350) }}>
                      {yl.map((label, i) => (
                        <span key={i} style={{ top: ylTop[i] }}>
                          {label}
                        </span>
                      ))}
                    </div>
                    <div className={s.months} style={{ opacity: p(L.cardAt + 450) }}>
                      {months.map((m) => (
                        <span key={m.m} style={{ left: m.left, width: m.width }}>
                          {m.m}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className={s.weeks} style={{ opacity: p(L.cardAt + 450) }}>
                    Weeks
                  </div>
                </div>
              </div>
            )}

            <div style={{ opacity: p(L.footAt, 500) }}>
              <p className={s.footNote}>AI-generated content may be inaccurate</p>
              <div className={s.footActions}>
                {FOOT_ICONS.map((icon, i) => (
                  <span key={i} className={s.footBtn}>
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                      {icon}
                    </svg>
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className={s.greet} style={{ opacity: 1 - toC, transform: `translateY(${-toC * 24}px)`, pointerEvents: toC > 0.5 ? 'none' : 'auto' }}>
          <div className={s.greetTitle}>
            Hi Gavan,
            <br />
            how can I help you?
          </div>
          <div style={{ opacity: 1 - sugP, transform: `translateY(${sugP * 8}px)` }}>
            <p className={s.sugLabel}>Suggested</p>
            <div className={s.sugList}>
              {SUGGESTIONS.map((sug) => (
                <span key={sug} className={s.sugBtn}>
                  <svg width="18" height="18" viewBox="0 0 16 16" fill="#FF4800">
                    <path d="M9.64502 3.15504C9.84002 2.96004 10.1551 2.96004 10.3501 3.15504L13.7852 6.5901C13.9147 6.68065 13.9999 6.83066 14 6.99977C14 7.08091 13.9795 7.15741 13.9448 7.22535C13.9212 7.27375 13.8904 7.31985 13.8501 7.36012L10.3501 10.8601C10.2501 10.9601 10.1251 11.0051 9.99512 11.0051L10 10.9998C9.87001 10.9998 9.74501 10.9497 9.64502 10.8547C9.45016 10.6598 9.45017 10.3451 9.64502 10.1502L12.2954 7.49977H5.5C4.12006 7.49977 3.00009 8.61984 3 9.99977V12.4998C3 12.7748 2.775 12.9998 2.5 12.9998C2.225 12.9998 2 12.7748 2 12.4998V9.99977C2.00009 8.06984 3.57006 6.49977 5.5 6.49977H12.2847L9.64502 3.86012C9.45004 3.66514 9.45008 3.35004 9.64502 3.15504Z" />
                  </svg>
                  {sug}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className={s.header}>
          <button type="button" tabIndex={-1} className={s.close} onClick={replay}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
              <path d="M19 5L5 19M5 5l14 14" />
            </svg>
          </button>
          <div className={s.title} style={{ opacity: p(L.chatAt + 200, 400) }}>
            Your pipeline deals
          </div>
          <span className={s.hdrBtn}>
            <svg width="22" height="22" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M13.3313 2.5C13.8313 2.50001 14.3064 2.69994 14.6564 3.04993L16.9623 5.36865C17.6873 6.0999 17.6873 7.28755 16.9623 8.0188L7.65015 17.3315C7.53145 17.4502 7.37507 17.5122 7.20642 17.5122L7.19971 17.5189H3.125C2.78131 17.5189 2.50009 17.2376 2.5 16.8939V12.8186C2.50004 12.6499 2.56881 12.4936 2.68127 12.3749L12.0062 3.04993C12.3625 2.69369 12.8313 2.5 13.3313 2.5ZM3.7439 13.075V16.2689H6.94397L14.278 8.93433L11.0809 5.7373L3.7439 13.075ZM13.3252 3.7561C13.1565 3.7561 13.0002 3.81874 12.8815 3.93738L11.9623 4.85596L15.1593 8.05298L16.0748 7.13745C16.3186 6.8937 16.3186 6.49985 16.0748 6.2561L13.7689 3.93738C13.6502 3.81867 13.4939 3.75615 13.3252 3.7561Z"
              />
            </svg>
          </span>
          <span className={s.hdrBtn}>
            <svg width="22" height="22" viewBox="0 0 20 20" fill="currentColor" style={{ overflow: 'visible' }}>
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M13.75 4.375C14.7812 4.375 15.625 5.21875 15.625 6.25V12.5C15.625 13.5312 14.7812 14.375 13.75 14.375H6.50635L3.56262 17.3187C3.4445 17.4368 3.28297 17.4987 3.12134 17.4994C3.04133 17.499 2.96143 17.4869 2.88757 17.45C2.65632 17.3562 2.5 17.125 2.5 16.875V6.25C2.5 5.21875 3.34375 4.375 4.375 4.375H13.75ZM4.375 5.625C4.03125 5.625 3.75 5.90625 3.75 6.25V15.3687L5.80627 13.3124C5.92502 13.1937 6.08128 13.1311 6.25 13.1311H13.75C14.0938 13.1311 14.375 12.8499 14.375 12.5061V6.2561C14.3749 5.91242 14.0937 5.6311 13.75 5.6311H4.375V5.625Z"
              />
              <path d="M16.25 1.875C17.2812 1.875 18.125 2.71875 18.125 3.75V10C18.125 10.3438 17.8438 10.625 17.5 10.625C17.1562 10.625 16.875 10.3438 16.875 10V3.75C16.875 3.40625 16.5938 3.125 16.25 3.125H6.875C6.53125 3.125 6.25 2.84375 6.25 2.5C6.25 2.15625 6.53125 1.875 6.875 1.875H16.25Z" />
              <circle cx="17.2" cy="2.8" r="3" fill="#FF5C35" stroke="#FFFFFF" strokeWidth="1.4" />
            </svg>
          </span>
          <span className={s.hdrBtn}>{MORE_ICON}</span>
        </div>

        <div className={s.kb} style={{ transform: `translateY(${(1 - kbUp) * 304}px)` }}>
          <div className={s.kbRow}>
            {KB.r1.map((k) => (
              <span key={k} className={s.key}>
                {k}
              </span>
            ))}
          </div>
          <div className={`${s.kbRow} ${s.kbRow2}`}>
            {KB.r2.map((k) => (
              <span key={k} className={s.key}>
                {k}
              </span>
            ))}
          </div>
          <div className={s.kbRow}>
            <span className={s.keyMod}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#1F1F1F">
                <path d="M12 3l9 9h-5v8H8v-8H3z" />
              </svg>
            </span>
            <span className={s.keyGap} />
            {KB.r3.map((k) => (
              <span key={k} className={s.key}>
                {k}
              </span>
            ))}
            <span className={s.keyGap} />
            <span className={s.keyMod}>
              <svg width="20" height="16" viewBox="0 0 24 18" fill="none" stroke="#1F1F1F" strokeWidth="1.6" strokeLinejoin="round">
                <path d="M8 1h14v16H8l-7-8z" />
                <path d="M12 6l6 6M18 6l-6 6" />
              </svg>
            </span>
          </div>
          <div className={s.kbRow}>
            <span className={`${s.keyMod} ${s.keyWide}`}>123</span>
            <span className={`${s.key} ${s.keySpace}`}>space</span>
            <span className={`${s.keyMod} ${s.keyWide}`}>return</span>
          </div>
        </div>

        <div className={s.composer} style={{ bottom: 321 + (39 - 321) * toC }}>
          <div className={s.field}>
            {hasText ? (
              <span className={s.typed}>
                {typed}
                <span className={s.caretInline} style={{ opacity: caretO }} />
              </span>
            ) : (
              <span className={s.placeholder}>
                <span className={s.caret} style={{ opacity: caretO }} />
                Ask Breeze Assistant anything...
              </span>
            )}
          </div>
          <div className={s.composerRow}>
            <span className={s.roundBtn}>{PLUS_ICON(18)}</span>
            <span className={s.grow} />
            <span className={s.roundBtn}>{MIC_ICON(17)}</span>
            <button
              type="button"
              tabIndex={-1}
              className={s.send}
              style={{ transform: `scale(${t > L.sendAt - 220 && t < L.sendAt + 60 ? 0.88 : 1})` }}
              onClick={send}
            >
              {hasText ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 19V5M5 12l7-7 7 7" />
                </svg>
              ) : (
                WAVE_ICON
              )}
            </button>
          </div>
        </div>
      </div>

      <div
        className={s.home}
        style={{ opacity: 1 - toB, transform: `scale(${1 - 0.04 * toB})`, pointerEvents: toB > 0.5 ? 'none' : 'auto' }}
      >
        <div className={s.homeHeader}>
          <span className={s.homeBtnWide}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
              <path d="M3 6h18M3 12h18M3 18h18" />
            </svg>
          </span>
          <span className={s.grow} />
          <span className={s.homeBtn}>{MIC_ICON(22)}</span>
          <span className={s.homeBtn}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4z" />
              <path d="M10 21h4" />
            </svg>
          </span>
          <span className={s.homeBtn}>{PLUS_ICON(22)}</span>
          <span className={s.homeBtn}>{MORE_ICON}</span>
        </div>

        <div className={s.homeTitle}>Good morning, Gavan. Here’s your top suggested actions.</div>

        <div className={s.homeBody}>
          <div className={s.homeCard}>
            <div className={s.homeCardHead}>
              <span className={s.homeCardIcon}>{TASKS_ICON}</span>
              <span className={s.homeCardLabel}>
                <strong>Complete</strong> <span className={s.muted}>7 tasks</span>
              </span>
            </div>
            <div className={s.task}>
              <div className={s.taskTitle}>Email Spencer Contract</div>
              <div className={`${s.taskMeta} ${s.taskMetaRow}`}>
                <span className={s.due}>Due 12 Sep 2026</span>·<span>Umbrella Inc.</span>·<span className={s.needs}>Needs reply</span>
              </div>
            </div>
            <div className={s.task}>
              <div className={s.taskTitle}>Contact Aaron Smith</div>
              <div className={s.taskMeta}>15 Sep 2026 · Aaron Smith +6</div>
            </div>
            <div className={`${s.task} ${s.last}`}>
              <div className={s.taskTitle}>Follow up with Sharon</div>
              <div className={s.taskMeta}>18 Sep 2026 · Sharon Williams · Notion</div>
            </div>
          </div>

          <div className={s.homeCard}>
            <div className={s.homeCardHead}>
              <span className={s.homeCardIcon}>{TASKS_ICON}</span>
              <span className={s.homeCardLabel}>
                <strong>Prep for</strong> <span className={s.muted}>3 upcoming meetings</span>
              </span>
            </div>
            <div className={s.mtg}>
              <span className={s.mtgBar} />
              <div>
                <div className={s.mtgTime}>
                  10:00 AM · <span className={s.due}>Now</span>
                </div>
                <div className={s.mtgTitle}>Intro Call with Notion</div>
              </div>
            </div>
            <div className={s.mtg}>
              <span className={s.mtgBar} />
              <div>
                <div className={s.mtgTime}>10:30 AM · Today</div>
                <div className={s.mtgTitle}>Sales call with Tam Dunne</div>
              </div>
            </div>
            <div className={`${s.mtg} ${s.last}`}>
              <span className={s.mtgBar} />
              <div>
                <div className={s.mtgTime}>2:00 PM · Today</div>
                <div className={s.mtgTitle}>Follow-up meeting: Demo day</div>
                <div className={s.mtgMeta}>Umbrella Inc. · Spencer Hale +3</div>
              </div>
            </div>
          </div>
        </div>

        <button
          type="button"
          tabIndex={-1}
          className={s.pill}
          style={{ transform: `scale(${t > L.toBreeze - 320 && t < L.toBreeze ? 0.95 : 1})` }}
          onClick={openBreeze}
        >
          <svg width="24" height="24" viewBox="0 0 24 24">
            <defs>
              <linearGradient id={`${uid}bz1`} x1="6.23564" y1="6.19718" x2="26.0135" y2="25.8484" gradientUnits="userSpaceOnUse">
                <stop stopColor="#D20688" />
                <stop offset="0.23" stopColor="#FF4800" />
                <stop offset="1" stopColor="#FBDDD2" />
              </linearGradient>
            </defs>
            <path fill={`url(#${uid}bz1)`} d={SPARK} />
          </svg>
          Breeze Assistant
          <span className={s.pillWave}>{WAVE_ICON}</span>
        </button>

        <div className={s.nav}>
          {NAV.map((item, i) => (
            <span key={item.label} className={i === 0 ? `${s.navItem} ${s.navActive}` : s.navItem}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                {item.paths.map((d, k) =>
                  item.evenOdd[k] ? <path key={k} fillRule="evenodd" clipRule="evenodd" d={d} /> : <path key={k} d={d} />,
                )}
              </svg>
              {item.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
