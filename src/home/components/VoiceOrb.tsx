import { useEffect, useRef, type CSSProperties } from 'react';

/**
 * VoiceOrb — a pressed, chromatic disc that reacts to a (mocked) voice.
 * Low tones swell the disc and roll the rim in slow lobes, mid tones add
 * medium ripples, high tones add fast fine shimmer and stronger fringing.
 *
 * The orb's diameter is ~63% of the canvas width, so size it with the parent.
 */
export type VoiceOrbProps = {
  /** false = mic muted / session ended: the orb settles */
  active?: boolean;
  /** relief strength, 0.2–2 */
  depth?: number;
  /** colour fringing on the bevel, 0–2 */
  chroma?: number;
  /** overall animation speed multiplier */
  speed?: number;
  /** 0–1, how strongly the orb reacts to the voice */
  softness?: number;
  /** pause the animation entirely */
  paused?: boolean;
  /** imperative "speak" burst, e.g. on tap — bump this number to trigger */
  burstKey?: number;
  className?: string;
  style?: CSSProperties;
};

const VS = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';

const FS = `
precision highp float;
uniform vec2 uRes; uniform float uT; uniform float uTalk; uniform float uDepth; uniform float uChroma0; uniform float uLow; uniform float uMid; uniform float uHigh;
float uChroma;
float RR(float a){
  return 0.63+0.005*sin(a*3.0+uT*0.9)+0.022*uLow+uLow*(0.016*sin(a*2.0-uT*1.6)+0.008*sin(a*3.0+uT*1.1))+uMid*(0.010*sin(a*5.0+uT*3.1)+0.006*sin(a*7.0-uT*2.6))+uHigh*(0.005*sin(a*11.0-uT*7.0)+0.003*sin(a*17.0+uT*9.5));
}
float hgt(vec2 p,float dr){
  float r=length(p); float a=atan(p.y,p.x); float rr=RR(a)+dr;
  float w=0.032;
  float h=smoothstep(rr+w,rr-w,r);
  h+=0.08*clamp(1.0-r*r/(rr*rr),0.0,1.0);
  return h*uDepth*(0.82+0.32*uLow+0.18*uMid);
}
vec3 nrm(vec2 p,float dr){
  float e=0.003;
  float hx=hgt(p+vec2(e,0.),dr)-hgt(p-vec2(e,0.),dr);
  float hy=hgt(p+vec2(0.,e),dr)-hgt(p-vec2(0.,e),dr);
  return normalize(vec3(-hx/(2.0*e)*0.06,-hy/(2.0*e)*0.06,1.0));
}
float lightC(vec2 p,float o,float la,float sp){
  vec3 n=nrm(p,o*0.007*uChroma);
  vec3 L=normalize(vec3(cos(la+o*sp),sin(la+o*sp),0.55));
  return dot(n,L)-L.z;
}
void main(){
  uChroma=uChroma0*(1.0+0.7*uHigh);
  vec2 p=(gl_FragCoord.xy*2.0-uRes)/uRes.x;
  float la=2.36+0.22*sin(uT*0.3)+0.10*uMid*sin(uT*1.7)+0.05*uHigh*sin(uT*6.0);
  float sp=0.38*uChroma;
  vec3 sh=vec3(lightC(p,-1.0,la,sp),lightC(p,0.0,la,sp),lightC(p,1.0,la,sp));
  float r=length(p); float a=atan(p.y,p.x); float R=RR(a);
  float inside=smoothstep(R+0.02,R-0.02,r);
  vec3 sage=vec3(0.50,0.56,0.47);
  float ga=-0.785+0.25*sin(uT*0.4)+0.3*uTalk*sin(uT*1.1);
  float g=dot(p,vec2(cos(ga),sin(ga)))/0.63;
  vec3 inner=mix(vec3(0.30,0.60,0.56),vec3(0.86,0.62,0.38),smoothstep(-0.95,0.95,g));
  inner=mix(inner,sage,0.42*(1.0-abs(clamp(g,-1.,1.))));
  inner=mix(inner,vec3(0.42,0.40,0.58),0.18*smoothstep(0.2,0.9,dot(p,vec2(0.2,0.98))/0.63));
  vec3 bg=mix(vec3(0.45,0.56,0.50),vec3(0.60,0.59,0.47),smoothstep(-1.4,1.4,p.y));
  float dist=max(r-R,0.0);
  float lit=dot(normalize(p+1e-5),vec2(cos(la),sin(la)));
  bg+=vec3(0.98,0.80,0.36)*exp(-dist*(8.0-3.0*uLow))*max(lit,0.0)*(0.42+0.45*uLow+0.2*uMid);
  bg+=vec3(0.22,0.66,0.62)*exp(-dist*6.0)*max(-lit,0.0)*(0.32+0.3*uHigh);
  bg-=vec3(0.10,0.10,0.06)*exp(-dist*14.0)*max(-lit,0.0)*0.8;
  vec3 col=mix(bg,inner,inside);
  float m=dot(sh,vec3(1.0/3.0));
  col+=sh*0.85;
  col+=(sh-vec3(m))*0.9*uChroma;
  col+=vec3(1.0,0.92,0.55)*max(m,0.0)*0.35;
  gl_FragColor=vec4(clamp(col,0.0,1.0),1.0);
}
`;

export default function VoiceOrb({
  active = true,
  depth = 1,
  chroma = 1,
  speed = 1,
  softness = 0.55,
  paused = false,
  burstKey = 0,
  className,
  style,
}: VoiceOrbProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const props = useRef({ active, depth, chroma, speed, softness, paused });
  props.current = { active, depth, chroma, speed, softness, paused };
  const burst = useRef(0);

  useEffect(() => {
    if (burstKey) burst.current = 1.2;
  }, [burstKey]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    // a fresh canvas per mount, so a remount never inherits a lost context
    const cv = document.createElement('canvas');
    cv.style.display = 'block';
    cv.style.width = '100%';
    cv.style.height = '100%';
    host.appendChild(cv);
    const gl = cv.getContext('webgl', { antialias: true, premultipliedAlpha: false });
    if (!gl) {
      cv.remove();
      return;
    }

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const pr = gl.createProgram()!;
    gl.attachShader(pr, compile(gl.VERTEX_SHADER, VS));
    gl.attachShader(pr, compile(gl.FRAGMENT_SHADER, FS));
    gl.linkProgram(pr);
    if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) {
      cv.remove();
      return;
    }
    gl.useProgram(pr);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(pr, 'p');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const u = (n: string) => gl.getUniformLocation(pr, n);
    const U = {
      res: u('uRes'), t: u('uT'), talk: u('uTalk'), depth: u('uDepth'), chroma: u('uChroma0'),
      low: u('uLow'), mid: u('uMid'), high: u('uHigh'),
    };

    let drawn = false;
    // keep the backing store matched to the element size
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const r = cv.getBoundingClientRect();
      cv.width = Math.max(1, Math.round(r.width * dpr));
      cv.height = Math.max(1, Math.round(r.height * dpr));
      drawn = false;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(cv);

    let t = 0;
    let last = performance.now();
    const v = { left: 0, amp: 0, pitch: 0.5, lo: 0, mi: 0, hi: 0 };
    let raf = 0;

    const loop = (now: number) => {
      const P = props.current;
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const run = !P.paused;
      if (run) t += dt * P.speed;

      // mock voice: random syllables, each with a loudness and a pitch (0 = low, 1 = high)
      const phrase = Math.sin(t * 0.55) > -0.35 ? 1 : 0;
      v.left -= run ? dt * P.speed : 0;
      if (v.left <= 0) {
        const gap = Math.random() < 0.22;
        v.left = gap ? 0.08 + Math.random() * 0.22 : 0.07 + Math.random() * 0.24;
        v.amp = gap ? 0.05 : 0.45 + Math.random() * 0.55;
        const drift = Math.sin(t * 0.37) * 0.3;
        v.pitch = Math.min(1, Math.max(0, 0.5 + drift + (Math.random() - 0.5) * 0.9));
      }
      const b = burst.current;
      const amp = !P.active || !phrase ? 0 : v.amp;
      const tLo = Math.min(1, amp * (1.15 - v.pitch) + b * 0.8);
      const tMi = Math.min(1, amp * (1 - Math.abs(v.pitch - 0.5) * 1.4) + b * 0.5);
      const tHi = Math.min(1, amp * (v.pitch * 1.2 - 0.1) * (0.7 + 0.3 * Math.random()) + b * 0.3);
      const ease = (cur: number, tgt: number, up: number, down: number) =>
        cur + (tgt - cur) * Math.min(1, dt * (tgt > cur ? up : down));
      v.lo = ease(v.lo, Math.max(0, tLo), 4, 2);
      v.mi = ease(v.mi, Math.max(0, tMi), 7, 3.5);
      v.hi = ease(v.hi, Math.max(0, tHi), 14, 7);
      burst.current *= Math.pow(0.25, dt);

      if (!run && drawn) {
        raf = requestAnimationFrame(loop);
        return;
      }
      drawn = true;
      gl.viewport(0, 0, cv.width, cv.height);
      gl.uniform2f(U.res, cv.width, cv.height);
      gl.uniform1f(U.t, t);
      gl.uniform1f(U.depth, P.depth);
      gl.uniform1f(U.chroma, P.chroma);
      gl.uniform1f(U.talk, Math.max(v.lo, v.mi, v.hi));
      gl.uniform1f(U.low, v.lo * P.softness);
      gl.uniform1f(U.mid, v.mi * P.softness);
      gl.uniform1f(U.high, v.hi * P.softness);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      cv.remove();
    };
  }, []);

  return (
    <div
      ref={hostRef}
      aria-hidden="true"
      className={className}
      style={{ width: '100%', height: '100%', ...style }}
    />
  );
}
