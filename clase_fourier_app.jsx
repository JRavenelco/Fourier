import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, ReferenceLine, Legend, AreaChart, Area
} from 'recharts';
import {
  BookOpen, Target, Lightbulb, ListChecks, FlaskConical, Eye,
  Menu, X, Waves, ChevronRight, Sparkles
} from 'lucide-react';

/* ============================================================
   PALETA Y TIPOGRAFÍA — inyección de fonts + KaTeX
   ============================================================ */
const palette = {
  paper:     '#F8F2E4',
  paperSoft: '#FBF7EC',
  ink:       '#1C1A15',
  inkSoft:   '#52493C',
  rule:      '#D9CDB3',
  accent:    '#B5471B',
  accent2:   '#2D5A52',
  highlight: '#E8B84A',
};

const cards = {
  motivation:    { bg:'#E9EFF4', border:'#3D5B7A', label:'Motivación',           Icon: Lightbulb },
  definition:    { bg:'#E5EDDE', border:'#4A6B36', label:'Definición',           Icon: BookOpen  },
  property:      { bg:'#F4E8CC', border:'#8A6A2D', label:'Propiedad',            Icon: ListChecks},
  example:       { bg:'#EEE5EE', border:'#6E4A78', label:'Ejemplo',              Icon: Target    },
  interpretation:{ bg:'#F0D9CF', border:'#8E3F25', label:'Interpretación física',Icon: Eye       },
  lab:           { bg:'#EFEADC', border:'#3A372F', label:'Laboratorio',          Icon: FlaskConical },
};

/* ============================================================
   COMPONENTE TeX — usa KaTeX si está cargado
   ============================================================ */
function TeX({ math, block = false }) {
  const ref = useRef(null);
  const [ready, setReady] = useState(typeof window !== 'undefined' && !!window.katex);

  useEffect(() => {
    if (window.katex) { setReady(true); return; }
    const check = setInterval(() => {
      if (window.katex) { setReady(true); clearInterval(check); }
    }, 100);
    return () => clearInterval(check);
  }, []);

  useEffect(() => {
    if (ready && ref.current && window.katex) {
      try {
        window.katex.render(math, ref.current, {
          displayMode: block,
          throwOnError: false,
          output: 'html',
        });
      } catch (e) {
        if (ref.current) ref.current.textContent = math;
      }
    }
  }, [math, block, ready]);

  if (block) {
    return (
      <div style={{ margin: '14px 0', textAlign: 'center', fontSize: '1.05em' }}>
        <span ref={ref}>{math}</span>
      </div>
    );
  }
  return <span ref={ref} style={{ whiteSpace: 'nowrap' }}>{math}</span>;
}

/* ============================================================
   TARJETAS MODULARES
   ============================================================ */
function ModuleCard({ kind, children, title }) {
  const c = cards[kind];
  const Icon = c.Icon;
  return (
    <div
      style={{
        margin: '22px 0',
        background: c.bg,
        borderLeft: `4px solid ${c.border}`,
        borderRadius: '4px',
        boxShadow: '0 1px 2px rgba(0,0,0,0.04), 0 2px 8px rgba(0,0,0,0.03)',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          padding: '8px 18px',
          background: 'rgba(255,255,255,0.35)',
          borderBottom: `1px solid ${c.border}33`,
          color: c.border,
          fontFamily: "'Inter Tight', system-ui, sans-serif",
          fontWeight: 600,
          fontSize: '11px',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
        }}
      >
        <Icon size={14} />
        <span>{c.label}{title ? ` — ${title}` : ''}</span>
      </div>
      <div style={{ padding: '14px 22px 18px', color: palette.ink, lineHeight: 1.65 }}>
        {children}
      </div>
    </div>
  );
}

/* ============================================================
   BLOQUE DE CÓDIGO MATLAB
   ============================================================ */
function MatlabBlock({ code }) {
  return (
    <pre
      style={{
        background: '#1C1A15',
        color: '#E8DFC8',
        padding: '16px 18px',
        borderRadius: '4px',
        fontFamily: "'JetBrains Mono', ui-monospace, monospace",
        fontSize: '13px',
        lineHeight: 1.55,
        overflowX: 'auto',
        margin: '14px 0',
        borderLeft: `3px solid ${palette.accent}`,
      }}
    >
      <div style={{
        color: palette.highlight, fontFamily: "'Inter Tight', sans-serif",
        fontSize: '10px', letterSpacing: '0.15em',
        marginBottom: '10px', textTransform: 'uppercase', opacity: 0.7
      }}>
        MATLAB
      </div>
      <code>{code}</code>
    </pre>
  );
}

/* ============================================================
   UTILIDADES NUMÉRICAS
   ============================================================ */
function dft(x) {
  const N = x.length;
  const out = new Array(N);
  for (let k = 0; k < N; k++) {
    let re = 0, im = 0;
    for (let n = 0; n < N; n++) {
      const a = -2 * Math.PI * k * n / N;
      re += x[n] * Math.cos(a);
      im += x[n] * Math.sin(a);
    }
    out[k] = { re: re / N, im: im / N, mag: Math.sqrt(re*re + im*im) / N };
  }
  return out;
}

/* ============================================================
   LAB 1 — Síntesis de una onda cuadrada
   ============================================================ */
function SquareWaveLab() {
  const [N, setN] = useState(8);
  const data = useMemo(() => {
    const T0 = 1, w0 = 2 * Math.PI / T0;
    const M = 600, pts = [];
    for (let i = 0; i <= M; i++) {
      const t = (i / M) * 2 * T0;
      let s = 0;
      for (let n = 0; n < N; n++) {
        const k = 2*n + 1;
        s += Math.sin(k * w0 * t) / k;
      }
      s *= 4 / Math.PI;
      const phase = t - Math.floor(t / T0) * T0;
      const ideal = phase < T0 / 2 ? 1 : -1;
      pts.push({ t: +t.toFixed(4), aprox: s, ideal });
    }
    return pts;
  }, [N]);

  const maxErr = useMemo(() => {
    let m = 0;
    for (const p of data) m = Math.max(m, Math.abs(p.aprox - p.ideal));
    return m;
  }, [data]);

  return (
    <div style={{ marginTop: 14 }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap',
        marginBottom: 10, fontFamily: "'Inter Tight', sans-serif", fontSize: 14,
      }}>
        <div style={{ flex: '1 1 240px', minWidth: 200 }}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom: 4 }}>
            <span style={{ color: palette.inkSoft }}>Número de armónicos</span>
            <span style={{ color: palette.accent, fontWeight: 600 }}>N = {N}</span>
          </div>
          <input
            type="range" min="1" max="50" value={N}
            onChange={(e) => setN(+e.target.value)}
            style={{ width: '100%', accentColor: palette.accent }}
          />
        </div>
        <div style={{
          padding: '6px 12px', background: palette.paper, border: `1px solid ${palette.rule}`,
          borderRadius: 3, fontSize: 12, color: palette.inkSoft,
        }}>
          Sobrepaso máximo: <strong style={{ color: palette.ink }}>{(maxErr * 100).toFixed(1)}%</strong>
        </div>
      </div>

      <div style={{ height: 280, background: palette.paperSoft, borderRadius: 4, padding: '8px 4px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 20, bottom: 20, left: -10 }}>
            <CartesianGrid stroke={palette.rule} strokeDasharray="2 4" />
            <XAxis
              dataKey="t" type="number" domain={[0, 2]}
              ticks={[0, 0.5, 1, 1.5, 2]}
              tick={{ fill: palette.inkSoft, fontSize: 11, fontFamily: 'JetBrains Mono' }}
              label={{ value: 't', position: 'insideBottom', offset: -5, fill: palette.inkSoft, fontSize: 12 }}
            />
            <YAxis
              domain={[-1.5, 1.5]} ticks={[-1, 0, 1]}
              tick={{ fill: palette.inkSoft, fontSize: 11, fontFamily: 'JetBrains Mono' }}
            />
            <Tooltip
              contentStyle={{
                background: palette.paper, border: `1px solid ${palette.rule}`,
                fontFamily: 'JetBrains Mono', fontSize: 12,
              }}
              formatter={(v) => v.toFixed(3)}
            />
            <Line type="stepAfter" dataKey="ideal" stroke={palette.inkSoft} strokeWidth={1.2}
                  strokeDasharray="4 3" dot={false} name="Ideal" />
            <Line type="monotone" dataKey="aprox" stroke={palette.accent} strokeWidth={2.2}
                  dot={false} name="Aproximación" isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <p style={{
        marginTop: 8, fontSize: 12, color: palette.inkSoft, fontStyle: 'italic',
        fontFamily: "'Spectral', serif",
      }}>
        Sin importar cuántos armónicos sumes, persiste un sobrepaso de ≈9% en las discontinuidades:
        es el <strong>fenómeno de Gibbs</strong>.
      </p>
    </div>
  );
}

/* ============================================================
   LAB 2 — Análisis armónico (espectro de presión)
   ============================================================ */
function PressureLab() {
  const [noise, setNoise] = useState(0.05);
  const [seed, setSeed] = useState(1);

  // PRNG determinista a partir del seed (para que cambios de slider no salten ruido)
  function rng(s) {
    let x = s * 9301 + 49297;
    return () => {
      x = (x * 9301 + 49297) % 233280;
      return x / 233280;
    };
  }

  const { time, spec, parsevalT, parsevalF } = useMemo(() => {
    const N = 128;
    const f0 = 1/32;
    const r = rng(seed);
    const x = new Array(N);
    for (let n = 0; n < N; n++) {
      // Ruido pseudo-gauss vía Box-Muller a partir del PRNG
      const u1 = r() || 1e-9, u2 = r();
      const g = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
      x[n] = 1.00 * Math.cos(2*Math.PI*f0*n)
           + 0.50 * Math.cos(2*Math.PI*2*f0*n + 0.3)
           + 0.25 * Math.cos(2*Math.PI*4*f0*n + 1.0)
           + noise * g;
    }
    const c = dft(x);
    const time = x.map((v, n) => ({ n, v }));
    const spec = c.slice(0, N/2).map((cc, k) => ({ k, mag: cc.mag }));
    const pt = x.reduce((s, v) => s + v*v, 0) / N;
    const pf = c.reduce((s, cc) => s + cc.mag*cc.mag, 0);
    return { time, spec, parsevalT: pt, parsevalF: pf };
  }, [noise, seed]);

  return (
    <div style={{ marginTop: 14 }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap',
        marginBottom: 10, fontFamily: "'Inter Tight', sans-serif", fontSize: 14,
      }}>
        <div style={{ flex: '1 1 240px', minWidth: 200 }}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom: 4 }}>
            <span style={{ color: palette.inkSoft }}>Nivel de ruido</span>
            <span style={{ color: palette.accent, fontWeight: 600 }}>σ = {noise.toFixed(2)}</span>
          </div>
          <input
            type="range" min="0" max="0.5" step="0.01" value={noise}
            onChange={(e) => setNoise(+e.target.value)}
            style={{ width: '100%', accentColor: palette.accent }}
          />
        </div>
        <button
          onClick={() => setSeed(s => s + 1)}
          style={{
            padding: '6px 12px', background: palette.ink, color: palette.paper,
            border: 'none', borderRadius: 3, cursor: 'pointer',
            fontFamily: "'Inter Tight', sans-serif", fontSize: 12, letterSpacing: '0.05em',
          }}
        >
          Nueva realización de ruido
        </button>
      </div>

      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: 12, marginTop: 10,
      }}>
        <div style={{ height: 200, background: palette.paperSoft, borderRadius: 4, padding: '8px 4px' }}>
          <div style={{
            fontFamily: "'Inter Tight', sans-serif", fontSize: 11,
            color: palette.inkSoft, padding: '0 12px', letterSpacing: '0.1em',
          }}>SEÑAL EN EL TIEMPO  x[n]</div>
          <ResponsiveContainer width="100%" height="90%">
            <LineChart data={time} margin={{ top: 6, right: 12, bottom: 16, left: -16 }}>
              <CartesianGrid stroke={palette.rule} strokeDasharray="2 4" />
              <XAxis dataKey="n" tick={{ fill: palette.inkSoft, fontSize: 10, fontFamily: 'JetBrains Mono' }} />
              <YAxis tick={{ fill: palette.inkSoft, fontSize: 10, fontFamily: 'JetBrains Mono' }} />
              <Line type="monotone" dataKey="v" stroke={palette.accent2} strokeWidth={1.4}
                    dot={false} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div style={{ height: 200, background: palette.paperSoft, borderRadius: 4, padding: '8px 4px' }}>
          <div style={{
            fontFamily: "'Inter Tight', sans-serif", fontSize: 11,
            color: palette.inkSoft, padding: '0 12px', letterSpacing: '0.1em',
          }}>ESPECTRO  |c_k|</div>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart data={spec} margin={{ top: 6, right: 12, bottom: 16, left: -16 }}>
              <CartesianGrid stroke={palette.rule} strokeDasharray="2 4" vertical={false} />
              <XAxis dataKey="k" tick={{ fill: palette.inkSoft, fontSize: 10, fontFamily: 'JetBrains Mono' }} />
              <YAxis tick={{ fill: palette.inkSoft, fontSize: 10, fontFamily: 'JetBrains Mono' }} />
              <Bar dataKey="mag" fill={palette.accent} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{
        marginTop: 10, padding: '8px 14px', background: palette.paper,
        border: `1px solid ${palette.rule}`, borderRadius: 3,
        fontFamily: 'JetBrains Mono', fontSize: 12, color: palette.ink,
      }}>
        Parseval&nbsp;&nbsp;|&nbsp;&nbsp;
        ⟨|x|²⟩<sub>tiempo</sub> = <strong>{parsevalT.toFixed(4)}</strong> &nbsp;&nbsp;≈&nbsp;&nbsp;
        Σ|c_k|² = <strong>{parsevalF.toFixed(4)}</strong>
        &nbsp;&nbsp;<span style={{ color: palette.inkSoft }}>(la energía se conserva)</span>
      </div>
    </div>
  );
}

/* ============================================================
   LAB 3 — Respuesta libre amortiguada
   ============================================================ */
function DampedLab() {
  const [zeta, setZeta] = useState(0.03);

  const { time, spec, peakFreq } = useMemo(() => {
    const fs = 256;
    const N  = 256;
    const f0 = 25;
    const x = new Array(N);
    const wd = 2 * Math.PI * f0 * Math.sqrt(Math.max(1 - zeta*zeta, 0));
    const alpha = zeta * 2 * Math.PI * f0;
    for (let n = 0; n < N; n++) {
      const t = n / fs;
      x[n] = Math.exp(-alpha * t) * Math.cos(wd * t);
    }
    const c = dft(x);
    const time = x.map((v, n) => ({ t: +(n/fs).toFixed(4), v }));
    const spec = [];
    for (let k = 0; k < N/2; k++) {
      const f = k * fs / N;
      if (f <= 80) spec.push({ f: +f.toFixed(2), mag: c[k].mag });
    }
    let pkF = 0, pkM = 0;
    for (const s of spec) if (s.mag > pkM) { pkM = s.mag; pkF = s.f; }
    return { time, spec, peakFreq: pkF };
  }, [zeta]);

  return (
    <div style={{ marginTop: 14 }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap',
        marginBottom: 10, fontFamily: "'Inter Tight', sans-serif", fontSize: 14,
      }}>
        <div style={{ flex: '1 1 240px', minWidth: 200 }}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom: 4 }}>
            <span style={{ color: palette.inkSoft }}>Razón de amortiguamiento</span>
            <span style={{ color: palette.accent, fontWeight: 600 }}>ζ = {zeta.toFixed(3)}</span>
          </div>
          <input
            type="range" min="0.001" max="0.3" step="0.001" value={zeta}
            onChange={(e) => setZeta(+e.target.value)}
            style={{ width: '100%', accentColor: palette.accent }}
          />
        </div>
        <div style={{
          padding: '6px 12px', background: palette.paper, border: `1px solid ${palette.rule}`,
          borderRadius: 3, fontSize: 12, color: palette.inkSoft,
        }}>
          Pico en f ≈ <strong style={{ color: palette.ink }}>{peakFreq.toFixed(1)} Hz</strong>
        </div>
      </div>

      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: 12, marginTop: 10,
      }}>
        <div style={{ height: 220, background: palette.paperSoft, borderRadius: 4, padding: '8px 4px' }}>
          <div style={{
            fontFamily: "'Inter Tight', sans-serif", fontSize: 11,
            color: palette.inkSoft, padding: '0 12px', letterSpacing: '0.1em',
          }}>TIEMPO  x(t)</div>
          <ResponsiveContainer width="100%" height="90%">
            <LineChart data={time} margin={{ top: 6, right: 12, bottom: 16, left: -16 }}>
              <CartesianGrid stroke={palette.rule} strokeDasharray="2 4" />
              <XAxis dataKey="t" type="number" domain={[0, 1]}
                     tick={{ fill: palette.inkSoft, fontSize: 10, fontFamily: 'JetBrains Mono' }} />
              <YAxis tick={{ fill: palette.inkSoft, fontSize: 10, fontFamily: 'JetBrains Mono' }} />
              <Line type="monotone" dataKey="v" stroke={palette.accent2} strokeWidth={1.4}
                    dot={false} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div style={{ height: 220, background: palette.paperSoft, borderRadius: 4, padding: '8px 4px' }}>
          <div style={{
            fontFamily: "'Inter Tight', sans-serif", fontSize: 11,
            color: palette.inkSoft, padding: '0 12px', letterSpacing: '0.1em',
          }}>ESPECTRO  |X(f)|</div>
          <ResponsiveContainer width="100%" height="90%">
            <AreaChart data={spec} margin={{ top: 6, right: 12, bottom: 16, left: -16 }}>
              <defs>
                <linearGradient id="spec-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={palette.accent} stopOpacity={0.7}/>
                  <stop offset="100%" stopColor={palette.accent} stopOpacity={0.05}/>
                </linearGradient>
              </defs>
              <CartesianGrid stroke={palette.rule} strokeDasharray="2 4" />
              <XAxis dataKey="f" type="number" domain={[0, 80]}
                     tick={{ fill: palette.inkSoft, fontSize: 10, fontFamily: 'JetBrains Mono' }}
                     label={{ value: 'f (Hz)', position: 'insideBottom', offset: -2, fill: palette.inkSoft, fontSize: 11 }} />
              <YAxis tick={{ fill: palette.inkSoft, fontSize: 10, fontFamily: 'JetBrains Mono' }} />
              <Area type="monotone" dataKey="mag" stroke={palette.accent} strokeWidth={1.6}
                    fill="url(#spec-grad)" isAnimationActive={false} />
              <ReferenceLine x={25} stroke={palette.inkSoft} strokeDasharray="3 3"
                             label={{ value:'f₀', fill: palette.inkSoft, fontSize: 11 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <p style={{
        marginTop: 8, fontSize: 12, color: palette.inkSoft, fontStyle: 'italic',
        fontFamily: "'Spectral', serif",
      }}>
        Cuanto más amortiguada la señal (mayor ζ), más ancho el pico espectral: la duración
        finita en el tiempo se traduce en ensanchamiento en frecuencia.
      </p>
    </div>
  );
}

/* ============================================================
   TABLA DE PARES DE TRANSFORMADA
   ============================================================ */
function FTPairsTable() {
  const rows = [
    [String.raw`\delta(t)`, '1'],
    ['1', String.raw`2\pi\, \delta(\omega)`],
    [String.raw`e^{-at}u(t),\; a>0`, String.raw`\dfrac{1}{a + j\omega}`],
    [String.raw`\mathrm{rect}(t/\tau)`, String.raw`\tau\, \mathrm{sinc}(\omega\tau/2)`],
    [String.raw`\cos(\omega_0 t)`, String.raw`\pi[\delta(\omega-\omega_0)+\delta(\omega+\omega_0)]`],
    [String.raw`e^{-\alpha t^2}`, String.raw`\sqrt{\pi/\alpha}\, e^{-\omega^2/4\alpha}`],
  ];
  return (
    <div style={{
      margin: '18px 0', border: `1px solid ${palette.rule}`,
      borderRadius: 4, overflow: 'hidden', background: palette.paperSoft,
    }}>
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr',
        background: palette.ink, color: palette.paper, padding: '8px 16px',
        fontFamily: "'Inter Tight', sans-serif", fontSize: 11, letterSpacing: '0.15em',
        textTransform: 'uppercase',
      }}>
        <div>x(t)</div><div>X(ω)</div>
      </div>
      {rows.map(([a, b], i) => (
        <div key={i} style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr',
          padding: '10px 16px',
          borderTop: i > 0 ? `1px solid ${palette.rule}` : 'none',
          background: i % 2 ? palette.paperSoft : '#fff6e3',
        }}>
          <div><TeX math={a} /></div>
          <div><TeX math={b} /></div>
        </div>
      ))}
    </div>
  );
}

/* ============================================================
   ESQUEMA DE SÍNTESIS (mapa conceptual)
   ============================================================ */
function ConceptMap() {
  const cell = (head, body, color) => (
    <div style={{
      padding: '14px 18px',
      background: color,
      border: `1px solid ${palette.rule}`,
      borderRadius: 4,
    }}>
      <div style={{
        fontFamily: "'Inter Tight', sans-serif",
        fontSize: 10, letterSpacing: '0.15em', color: palette.inkSoft,
        textTransform: 'uppercase', marginBottom: 6,
      }}>{head}</div>
      <div style={{ fontFamily: "'Fraunces', serif", fontSize: 17, fontWeight: 500, color: palette.ink }}>
        {body}
      </div>
    </div>
  );
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: 'auto 1fr 1fr',
      gap: 8, margin: '20px 0', alignItems: 'stretch',
    }}>
      <div></div>
      <div style={{ textAlign: 'center', fontFamily: "'Inter Tight', sans-serif",
                    fontSize: 11, color: palette.accent, letterSpacing: '0.15em',
                    textTransform: 'uppercase' }}>Periódica</div>
      <div style={{ textAlign: 'center', fontFamily: "'Inter Tight', sans-serif",
                    fontSize: 11, color: palette.accent, letterSpacing: '0.15em',
                    textTransform: 'uppercase' }}>Aperiódica</div>

      <div style={{ display: 'flex', alignItems: 'center', fontFamily: "'Inter Tight', sans-serif",
                    fontSize: 11, color: palette.accent2, letterSpacing: '0.15em',
                    textTransform: 'uppercase', padding: '0 12px' }}>Continuo</div>
      {cell('Espectro discreto', 'Serie de Fourier', '#F4E8CC')}
      {cell('Espectro continuo', 'Transformada de Fourier', '#E9EFF4')}

      <div style={{ display: 'flex', alignItems: 'center', fontFamily: "'Inter Tight', sans-serif",
                    fontSize: 11, color: palette.accent2, letterSpacing: '0.15em',
                    textTransform: 'uppercase', padding: '0 12px' }}>Discreto</div>
      {cell('Discreto y periódico', 'SFD / SFTD', '#E5EDDE')}
      {cell('Continuo y periódico', 'TFTD / DFT', '#EEE5EE')}
    </div>
  );
}

/* ============================================================
   SECCIONES — TOC
   ============================================================ */
const sections = [
  { id: 'intro',     label: 'Introducción' },
  { id: 'continua',  label: '1. Serie de Fourier continua' },
  { id: 'discreta',  label: '2. SFD y propiedades' },
  { id: 'integral',  label: '3. Transformada de Fourier' },
  { id: 'sintesis',  label: 'Síntesis' },
];

/* ============================================================
   APP PRINCIPAL
   ============================================================ */
export default function FourierClass() {
  const [activeSec, setActiveSec] = useState('intro');
  const [navOpen, setNavOpen] = useState(false);

  // Cargar Google Fonts + KaTeX
  useEffect(() => {
    const fontLink = document.createElement('link');
    fontLink.rel = 'stylesheet';
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,500;9..144,700&family=Spectral:ital,wght@0,400;0,500;1,400&family=Inter+Tight:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap';
    document.head.appendChild(fontLink);

    const katexCss = document.createElement('link');
    katexCss.rel = 'stylesheet';
    katexCss.href = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css';
    document.head.appendChild(katexCss);

    const katexJs = document.createElement('script');
    katexJs.src = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js';
    katexJs.async = true;
    document.head.appendChild(katexJs);

    return () => {
      try {
        document.head.removeChild(fontLink);
        document.head.removeChild(katexCss);
        document.head.removeChild(katexJs);
      } catch (e) {}
    };
  }, []);

  // Scroll-spy
  useEffect(() => {
    const onScroll = () => {
      let cur = sections[0].id;
      for (const s of sections) {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top < 200) cur = s.id;
      }
      setActiveSec(cur);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setNavOpen(false);
  };

  return (
    <div style={{
      background: palette.paper,
      color: palette.ink,
      minHeight: '100vh',
      fontFamily: "'Spectral', Georgia, serif",
      fontSize: '16px',
    }}>
      {/* === HEADER === */}
      <header style={{
        borderBottom: `1px solid ${palette.rule}`,
        background: palette.paperSoft,
        position: 'sticky', top: 0, zIndex: 30,
      }}>
        <div style={{
          maxWidth: 1180, margin: '0 auto',
          padding: '14px 24px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Waves size={22} color={palette.accent} />
            <div>
              <div style={{
                fontFamily: "'Fraunces', serif", fontWeight: 500,
                fontSize: 17, lineHeight: 1.1, color: palette.ink,
              }}>
                Análisis de Señales
              </div>
              <div style={{
                fontFamily: "'Inter Tight', sans-serif", fontSize: 10,
                color: palette.inkSoft, letterSpacing: '0.15em',
                textTransform: 'uppercase', marginTop: 2,
              }}>
                Series e Integral de Fourier
              </div>
            </div>
          </div>
          <button
            onClick={() => setNavOpen(o => !o)}
            style={{
              background: 'transparent', border: 'none', cursor: 'pointer',
              color: palette.ink, padding: 4, display: 'none',
            }}
            className="nav-toggle"
          >
            {navOpen ? <X size={22}/> : <Menu size={22}/>}
          </button>
        </div>
      </header>

      <div style={{ maxWidth: 1180, margin: '0 auto', display: 'flex', position: 'relative' }}>
        {/* === SIDEBAR TOC === */}
        <nav
          className="toc"
          style={{
            width: 240, flexShrink: 0,
            padding: '34px 18px 20px 24px',
            position: 'sticky', top: 70, alignSelf: 'flex-start',
            height: 'calc(100vh - 70px)', overflowY: 'auto',
            borderRight: `1px solid ${palette.rule}`,
          }}
        >
          <div style={{
            fontFamily: "'Inter Tight', sans-serif", fontSize: 10,
            color: palette.inkSoft, letterSpacing: '0.18em',
            textTransform: 'uppercase', marginBottom: 14,
          }}>Contenido</div>
          {sections.map(s => (
            <div
              key={s.id}
              onClick={() => scrollTo(s.id)}
              style={{
                padding: '8px 10px',
                marginBottom: 2,
                cursor: 'pointer',
                borderLeft: `2px solid ${activeSec === s.id ? palette.accent : 'transparent'}`,
                color: activeSec === s.id ? palette.accent : palette.inkSoft,
                fontFamily: "'Inter Tight', sans-serif",
                fontSize: 13, fontWeight: activeSec === s.id ? 600 : 400,
                transition: 'all 0.15s',
              }}
            >
              {s.label}
            </div>
          ))}

          <div style={{
            marginTop: 32, padding: '12px 0', borderTop: `1px dashed ${palette.rule}`,
            fontFamily: "'Spectral', serif", fontSize: 12, fontStyle: 'italic',
            color: palette.inkSoft,
          }}>
            Clase interactiva — desliza los controles en los tres laboratorios para
            explorar la teoría en vivo.
          </div>
        </nav>

        {/* === MAIN === */}
        <main style={{
          flex: 1, minWidth: 0,
          padding: '34px 38px 80px',
          maxWidth: 820,
        }}>
          {/* INTRO */}
          <section id="intro">
            <h1 style={{
              fontFamily: "'Fraunces', serif", fontWeight: 500,
              fontSize: 42, lineHeight: 1.05, margin: '0 0 14px',
              color: palette.ink, letterSpacing: '-0.01em',
            }}>
              Series e Integral de Fourier
            </h1>
            <p style={{
              fontFamily: "'Spectral', serif", fontSize: 18,
              color: palette.inkSoft, fontStyle: 'italic',
              borderLeft: `3px solid ${palette.highlight}`, paddingLeft: 16,
              margin: '0 0 26px',
            }}>
              Representar señales periódicas y aperiódicas como suma o integral de senoidales —
              el cambio de perspectiva que cimentó el análisis frecuencial moderno.
            </p>

            <ModuleCard kind="motivation">
              <p>
                Muchas señales que aparecen en ingeniería son <em>periódicas</em>: la corriente
                alterna de una red eléctrica, la vibración de un rotor, la presión en el cilindro
                de un motor, el sonido de una nota musical sostenida. Otras son <em>aperiódicas</em>:
                un pulso de radar, una respuesta libre amortiguada, una palabra hablada. Aunque
                cada una puede tener una forma temporal complicada, todas comparten una propiedad
                notable:
              </p>
              <p style={{
                textAlign: 'center', margin: '14px 0',
                fontFamily: "'Fraunces', serif", fontStyle: 'italic',
                fontSize: 17, color: palette.accent,
              }}>
                Toda señal “razonable” puede descomponerse como suma (o integral) de senoidales.
              </p>
              <p>
                Este resultado, formalizado por Joseph Fourier en 1822, es la base del análisis
                frecuencial moderno. En lugar de mirar la señal como una función del tiempo, la
                miramos como una colección de <strong>amplitudes y fases</strong> en distintas
                frecuencias. Esta perspectiva simplifica problemas que en el dominio del tiempo
                serían intratables: filtrado, modulación, detección de fallas, compresión de
                audio, identificación modal de estructuras.
              </p>
            </ModuleCard>
          </section>

          {/* PARTE 1 */}
          <section id="continua" style={{ marginTop: 60 }}>
            <SectionHeader number="1" title="Serie de Fourier en tiempo continuo" />

            <p>
              Sea <TeX math="x(t)" /> una señal periódica de periodo <TeX math="T_0" />,
              con frecuencia fundamental <TeX math="\omega_0 = 2\pi/T_0" />.
            </p>

            <ModuleCard kind="definition">
              <p><strong>Forma trigonométrica.</strong></p>
              <TeX block math={String.raw`x(t) = a_0 + \sum_{k=1}^{\infty} \big[ a_k \cos(k\omega_0 t) + b_k \sin(k\omega_0 t) \big]`} />

              <p style={{ marginTop: 10 }}><strong>Forma exponencial (compleja).</strong></p>
              <TeX block math={String.raw`\boxed{\; x(t) = \sum_{k=-\infty}^{\infty} c_k\, e^{j k \omega_0 t}, \qquad c_k = \frac{1}{T_0}\int_{T_0} x(t)\, e^{-j k \omega_0 t}\, dt \;}`} />

              <p style={{ marginTop: 10 }}>
                Los coeficientes <TeX math="\{c_k\}" /> son en general complejos:
                <TeX math="|c_k|" /> representa la <em>amplitud</em> del armónico <TeX math="k" />,
                y <TeX math="\arg(c_k)" /> representa su <em>fase</em>.
              </p>
            </ModuleCard>

            <ModuleCard kind="interpretation">
              El conjunto <TeX math="\{c_k\}_{k\in\mathbb{Z}}" /> es el <strong>espectro discreto</strong> de
              la señal: solo aparecen componentes en frecuencias múltiplos enteros de <TeX math="\omega_0" />.
              Graficar <TeX math="|c_k|" /> frente a <TeX math="k\omega_0" /> revela cuáles armónicos
              dominan y cuáles son despreciables. Una señal puramente senoidal tiene un solo par de
              líneas espectrales; una onda cuadrada tiene infinitas líneas que decaen como <TeX math="1/k" />.
            </ModuleCard>

            <ModuleCard kind="example" title="Onda cuadrada">
              <p>Sea <TeX math="x(t) = +A" /> para <TeX math="0 < t < T_0/2" /> y <TeX math="-A" /> en la mitad restante. Por simetría impar los <TeX math="a_k = 0" />; calculando los <TeX math="b_k" />:</p>
              <TeX block math={String.raw`b_k = \frac{4A}{k\pi} \;\;(\text{$k$ impar}), \qquad b_k = 0 \;\;(\text{$k$ par})`} />
              <TeX block math={String.raw`x(t) = \frac{4A}{\pi}\sum_{n=0}^{\infty} \frac{1}{2n+1}\sin\big((2n+1)\omega_0 t\big)`} />
            </ModuleCard>

            <ModuleCard kind="example" title="Vibración de un rotor desbalanceado">
              Un rotor con un pequeño desbalanceo genera vibración aproximadamente
              <TeX block math={String.raw`v(t) = V_1\cos(\omega_0 t + \phi_1) + V_2\cos(2\omega_0 t + \phi_2) + V_3\cos(3\omega_0 t + \phi_3) + \dots`} />
              El fundamental (<TeX math="1\times" />) revela desbalanceo; el segundo armónico
              (<TeX math="2\times" />) revela desalineación; armónicos superiores indican daño en
              rodamientos o engranajes. <em>El espectro de Fourier es, en este caso, una
              herramienta de diagnóstico.</em>
            </ModuleCard>

            <ModuleCard kind="lab" title="1 · Síntesis de una onda cuadrada">
              <p>
                Reconstruyamos una onda cuadrada sumando sus primeros <TeX math="N" /> armónicos.
                Observa cómo mejora la aproximación al aumentar <TeX math="N" /> y el persistente
                sobrepaso cerca de las discontinuidades (fenómeno de Gibbs).
              </p>
              <SquareWaveLab />
              <details style={{ marginTop: 14 }}>
                <summary style={{
                  cursor: 'pointer', fontFamily: "'Inter Tight', sans-serif",
                  fontSize: 12, letterSpacing: '0.1em', color: palette.inkSoft,
                  textTransform: 'uppercase',
                }}>
                  Ver código MATLAB equivalente
                </summary>
                <MatlabBlock code={`% Reconstruccion de una onda cuadrada por serie de Fourier
T0 = 1.0;                          % periodo
w0 = 2*pi/T0;
t  = linspace(0, 2*T0, 2000);

figure; hold on;
for N = [1 3 10 50]
    x = zeros(size(t));
    for n = 0:N-1
        k = 2*n + 1;               % solo armonicos impares
        x = x + (4/pi) * sin(k*w0*t)/k;
    end
    plot(t, x, 'DisplayName', sprintf('N = %d', N));
end
xlabel('t'); ylabel('x(t)');
legend('Location','best'); grid on;
title('Reconstruccion de onda cuadrada por serie de Fourier');`} />
              </details>
            </ModuleCard>
          </section>

          {/* PARTE 2 */}
          <section id="discreta" style={{ marginTop: 60 }}>
            <SectionHeader number="2" title="Serie de Fourier en tiempo discreto y propiedades" />

            <ModuleCard kind="motivation">
              En la práctica las señales se adquieren mediante sensores y se convierten a secuencias
              numéricas <TeX math="x[n]" />. Necesitamos entonces una versión <em>discreta</em> de la
              serie. Veremos que se vuelve más sencilla en un aspecto fundamental: la serie tiene un
              número <strong>finito</strong> de coeficientes, no infinito.
            </ModuleCard>

            <ModuleCard kind="definition" title="Serie de Fourier Discreta (SFD)">
              Sea <TeX math="x[n]" /> una señal periódica de periodo <TeX math="N" />
              (<TeX math="x[n+N]=x[n]" />). Sus pares de análisis y síntesis son:
              <TeX block math={String.raw`\boxed{\; x[n] = \sum_{k=0}^{N-1} c_k\, e^{j k (2\pi/N) n}, \qquad c_k = \frac{1}{N}\sum_{n=0}^{N-1} x[n]\, e^{-j k (2\pi/N) n} \;}`} />
              A diferencia del caso continuo, hay <strong>exactamente <TeX math="N" /> coeficientes
              distintos</strong> (<TeX math="c_k" /> es periódico en <TeX math="k" /> con periodo <TeX math="N" />).
            </ModuleCard>

            <ModuleCard kind="interpretation">
              <strong>Continuo vs. discreto:</strong>
              <div style={{
                display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
                gap: 0, marginTop: 12,
                border: `1px solid ${palette.rule}`,
                borderRadius: 3, overflow: 'hidden',
                fontSize: 13,
              }}>
                {[
                  ['', 'Tiempo continuo', 'Tiempo discreto'],
                  ['Señal', 'x(t), periodo T₀', 'x[n], periodo N'],
                  ['Frecuencias', 'kω₀,  k ∈ ℤ', 'k(2π/N),  k = 0…N−1'],
                  ['# coeficientes', 'infinito', 'finito (N)'],
                  ['Espectro', 'líneas en ℝ', 'líneas en un círculo'],
                ].map((row, i) => row.map((cell, j) => (
                  <div key={`${i}-${j}`} style={{
                    padding: '8px 12px',
                    background: i === 0 ? palette.ink : (i % 2 ? palette.paperSoft : 'transparent'),
                    color: i === 0 ? palette.paper : palette.ink,
                    fontFamily: i === 0 ? "'Inter Tight', sans-serif" : (j === 0 ? "'Inter Tight', sans-serif" : "'Spectral', serif"),
                    fontSize: i === 0 ? 10 : 13,
                    letterSpacing: i === 0 ? '0.12em' : 'normal',
                    textTransform: i === 0 ? 'uppercase' : 'none',
                    fontWeight: j === 0 && i > 0 ? 500 : 'normal',
                    borderBottom: i < 4 ? `1px solid ${palette.rule}` : 'none',
                  }}>{cell}</div>
                )))}
              </div>
            </ModuleCard>

            <h3 style={sectionH3}>Propiedades fundamentales</h3>

            <ModuleCard kind="property" title="Linealidad">
              <TeX block math={String.raw`\alpha x(t) + \beta y(t) \;\longleftrightarrow\; \alpha c_k + \beta d_k`} />
            </ModuleCard>

            <ModuleCard kind="property" title="Desplazamiento en el tiempo">
              <TeX block math={String.raw`x(t - t_0) \;\longleftrightarrow\; c_k\, e^{-j k \omega_0 t_0}`} />
              <em>La magnitud <TeX math="|c_k|" /> no cambia; solo se modifica la fase.</em>
            </ModuleCard>

            <ModuleCard kind="property" title="Modulación">
              <TeX block math={String.raw`e^{j M \omega_0 t}\, x(t) \;\longleftrightarrow\; c_{k-M}`} />
              <em>Multiplicar por una exponencial compleja desplaza el espectro.</em>
            </ModuleCard>

            <ModuleCard kind="property" title="Teorema de Parseval">
              La energía promedio en un periodo es igual a la suma de cuadrados de los coeficientes:
              <TeX block math={String.raw`\frac{1}{T_0}\int_{T_0} |x(t)|^2\, dt \;=\; \sum_{k=-\infty}^{\infty} |c_k|^2`} />
              <em>La potencia se reparte entre los armónicos: cada <TeX math="|c_k|^2" /> es la contribución del armónico <TeX math="k" />.</em>
            </ModuleCard>

            <ModuleCard kind="example" title="Vibraciones estructurales en una aeronave">
              Los rotores, hélices y motores generan vibraciones que se transmiten a la estructura.
              Al instrumentar con acelerómetros y registrar <TeX math="x[n]" /> durante el régimen
              estacionario, el cálculo de la SFD revela:
              <ul style={{ paddingLeft: 18, marginTop: 8 }}>
                <li>Una línea dominante en la <strong>frecuencia fundamental</strong> (e.g., RPM del rotor).</li>
                <li><strong>Armónicos superiores</strong> (<TeX math="2\times" />, <TeX math="3\times" />, <TeX math="N_{\text{palas}}\times" />) que reflejan número de palas, desbalanceo, desalineación.</li>
                <li>Líneas anómalas en frecuencias no relacionadas con los armónicos: indicadores tempranos de <em>falla incipiente</em>.</li>
              </ul>
              La firma espectral funciona como una <em>huella digital</em> del estado mecánico.
            </ModuleCard>

            <ModuleCard kind="lab" title="2 · Análisis armónico de presión en cilindros">
              <p>
                Una señal sintética de presión combina tres armónicos más ruido gaussiano. Ajusta el
                nivel de ruido y observa cómo los picos espectrales emergen del piso de ruido.
                Verifica numéricamente Parseval.
              </p>
              <PressureLab />
              <details style={{ marginTop: 14 }}>
                <summary style={{
                  cursor: 'pointer', fontFamily: "'Inter Tight', sans-serif",
                  fontSize: 12, letterSpacing: '0.1em', color: palette.inkSoft,
                  textTransform: 'uppercase',
                }}>
                  Ver código MATLAB equivalente
                </summary>
                <MatlabBlock code={`% Analisis armonico de una senal periodica de presion
N  = 256;
n  = 0:N-1;
f0 = 1/32;

x = 1.00*cos(2*pi*f0*n) ...
  + 0.50*cos(2*pi*2*f0*n + 0.3) ...
  + 0.25*cos(2*pi*4*f0*n + 1.0) ...
  + 0.05*randn(1, N);

c = fft(x)/N;
k = 0:N-1;

figure;
stem(k(1:N/2), abs(c(1:N/2)), 'filled');
xlabel('k'); ylabel('|c_k|');
title('Espectro de la senal de presion'); grid on;

energia_tiempo = mean(abs(x).^2);
energia_freq   = sum(abs(c).^2);
fprintf('Parseval:  tiempo = %.4f   |   frecuencia = %.4f\\n', ...
        energia_tiempo, energia_freq);`} />
              </details>
            </ModuleCard>
          </section>

          {/* PARTE 3 */}
          <section id="integral" style={{ marginTop: 60 }}>
            <SectionHeader number="3" title="Integral de Fourier (transformada continua)" />

            <ModuleCard kind="motivation" title="Puente desde el video: de lineas a continuo">
              <p>
                El video propuesto resume justo la transicion que necesitamos aqui: partir de una
                serie de Fourier compleja en un intervalo <TeX math="[-L,L]" /> y preguntar que
                ocurre cuando el periodo <TeX math="2L" /> crece sin limite.
              </p>
              <TeX block math={String.raw`f(x)=\sum_k c_k e^{i k \pi x/L}, \qquad \omega_k=\frac{k\pi}{L}, \qquad \Delta\omega=\frac{\pi}{L}`} />
              <p>
                Si <TeX math="L" /> aumenta, las frecuencias permitidas se acercan. En el limite
                <TeX math="L\to\infty" />, las lineas espectrales discretas forman un espectro
                continuo y la suma se transforma en una integral.
              </p>
              <div style={{
                marginTop: 12,
                padding: '10px 12px',
                border: `1px dashed ${palette.rule}`,
                borderRadius: 4,
                fontFamily: "'Inter Tight', sans-serif",
                fontSize: 13,
                color: palette.inkSoft,
              }}>
                Video de apoyo: <a href="https://youtu.be/jVYs-GTqm5U" target="_blank" rel="noreferrer" style={{ color: palette.accent }}>
                  derivacion de serie de Fourier a transformada de Fourier
                </a>
              </div>
            </ModuleCard>

            <ModuleCard kind="motivation">
              <p>
                La serie de Fourier solo describe señales <em>periódicas</em>. Pero la mayoría de las
                señales reales son <strong>aperiódicas</strong>: un pulso de radar, la respuesta libre
                amortiguada de una estructura, un disparo, una palabra hablada.
              </p>
              <p style={{ marginTop: 8 }}>
                <strong>Idea clave:</strong> una señal aperiódica puede pensarse como una periódica
                de periodo infinitamente grande. Al hacer <TeX math="T_0 \to \infty" />, la
                frecuencia fundamental <TeX math="\omega_0" /> tiende a cero, las líneas espectrales
                se juntan hasta formar un <strong>espectro continuo</strong>, y la sumatoria se
                convierte en una integral.
              </p>
            </ModuleCard>

            <ModuleCard kind="definition">
              La <strong>transformada de Fourier</strong> de una señal <TeX math="x(t)" /> y su inversa son:
              <TeX block math={String.raw`\boxed{\; X(\omega) = \int_{-\infty}^{\infty} x(t)\, e^{-j\omega t}\, dt, \qquad x(t) = \frac{1}{2\pi}\int_{-\infty}^{\infty} X(\omega)\, e^{j\omega t}\, d\omega \;}`} />
              <TeX math="X(\omega)" /> es en general complejo: <TeX math="|X(\omega)|" /> es el espectro de magnitud y <TeX math="\arg X(\omega)" /> el espectro de fase.
            </ModuleCard>

            <h3 style={sectionH3}>Pares de transformada comunes</h3>
            <FTPairsTable />

            <h3 style={sectionH3}>Propiedades fundamentales</h3>

            <ModuleCard kind="property" title="Linealidad">
              <TeX block math={String.raw`\alpha x_1(t) + \beta x_2(t) \;\longleftrightarrow\; \alpha X_1(\omega) + \beta X_2(\omega)`} />
            </ModuleCard>

            <ModuleCard kind="property" title="Escalamiento temporal">
              <TeX block math={String.raw`x(at) \;\longleftrightarrow\; \tfrac{1}{|a|}\, X\!\left(\tfrac{\omega}{a}\right)`} />
              <em>Comprimir en el tiempo es expandir en frecuencia, y viceversa.</em>
            </ModuleCard>

            <ModuleCard kind="property" title="Desplazamiento">
              <TeX block math={String.raw`x(t-t_0) \;\longleftrightarrow\; X(\omega)\, e^{-j\omega t_0}, \qquad e^{j\omega_0 t} x(t) \;\longleftrightarrow\; X(\omega - \omega_0)`} />
            </ModuleCard>

            <ModuleCard kind="property" title="Convolución ↔ Multiplicación">
              <TeX block math={String.raw`(x * h)(t) \;\longleftrightarrow\; X(\omega)\, H(\omega), \qquad x(t)\, y(t) \;\longleftrightarrow\; \tfrac{1}{2\pi}\, X(\omega) * Y(\omega)`} />
              La convolución, costosa en el tiempo, se reduce a un producto en frecuencia.
            </ModuleCard>

            <ModuleCard kind="interpretation">
              La propiedad de convolución es la razón por la cual la transformada de Fourier es tan
              central en ingeniería: si un sistema lineal e invariante en el tiempo tiene respuesta
              al impulso <TeX math="h(t)" />, entonces su respuesta a cualquier entrada se calcula
              simplemente como <TeX math="Y(\omega) = X(\omega)\, H(\omega)" />.&nbsp;
              <TeX math="H(\omega)" /> es la <strong>función de transferencia</strong>: describe
              cómo el sistema atenúa o amplifica cada frecuencia.
            </ModuleCard>

            <ModuleCard kind="lab" title="3 · Espectro de una respuesta libre amortiguada">
              <p>
                Una estructura ligeramente amortiguada oscila a su frecuencia natural mientras
                pierde energía. Al variar la razón de amortiguamiento <TeX math="\zeta" />, observa
                cómo cambia el ancho del pico espectral.
              </p>
              <DampedLab />
              <details style={{ marginTop: 14 }}>
                <summary style={{
                  cursor: 'pointer', fontFamily: "'Inter Tight', sans-serif",
                  fontSize: 12, letterSpacing: '0.1em', color: palette.inkSoft,
                  textTransform: 'uppercase',
                }}>
                  Ver código MATLAB equivalente
                </summary>
                <MatlabBlock code={`% Espectro de la respuesta libre amortiguada de una estructura
fs   = 1000;
t    = 0:1/fs:2-1/fs;
f0   = 25.0;
zeta = 0.03;

x = exp(-zeta*2*pi*f0*t) .* cos(2*pi*f0*sqrt(1-zeta^2)*t);

N    = length(t);
X    = fft(x)/N;
f    = (0:N-1)*(fs/N);
mask = f <= fs/2;

figure;
subplot(2,1,1);
plot(t, x); xlabel('t (s)'); ylabel('x(t)');
title('Respuesta libre amortiguada'); grid on;

subplot(2,1,2);
plot(f(mask), abs(X(mask)));
xlim([0 100]);
xlabel('f (Hz)'); ylabel('|X(f)|');
title('Espectro de magnitud'); grid on;`} />
              </details>
            </ModuleCard>
          </section>

          {/* SÍNTESIS */}
          <section id="sintesis" style={{ marginTop: 60 }}>
            <SectionHeader number="—" title="Síntesis y mapa conceptual" />

            <ConceptMap />

            <div style={{
              padding: '20px 24px', background: palette.paperSoft,
              border: `1px solid ${palette.rule}`, borderRadius: 4,
              marginTop: 14,
            }}>
              <div style={{
                fontFamily: "'Inter Tight', sans-serif", fontSize: 11,
                color: palette.accent, letterSpacing: '0.15em',
                textTransform: 'uppercase', marginBottom: 10,
              }}>Conexiones a recordar</div>
              <ul style={{ paddingLeft: 20, margin: 0, lineHeight: 1.8 }}>
                <li>Periodicidad en un dominio <strong>↔</strong> discretización en el otro.</li>
                <li>Linealidad y desplazamiento se mantienen en <em>todas</em> las versiones.</li>
                <li>Convolución en tiempo <strong>↔</strong> producto en frecuencia: el motor de los sistemas LTI.</li>
                <li>Parseval: la energía se conserva al cambiar de dominio.</li>
              </ul>
            </div>

            <div style={{
              marginTop: 50, paddingTop: 24, borderTop: `1px solid ${palette.rule}`,
              fontFamily: "'Spectral', serif", fontStyle: 'italic',
              fontSize: 13, color: palette.inkSoft, textAlign: 'center',
            }}>
              Fin de la clase — <Sparkles size={12} style={{ display: 'inline', verticalAlign: 'middle' }} /> &nbsp; gracias por explorar.
            </div>
          </section>
        </main>
      </div>

      {/* RESPONSIVE STYLES */}
      <style>{`
        @media (max-width: 760px) {
          .toc {
            display: ${navOpen ? 'block' : 'none'};
            position: fixed !important;
            top: 64px !important;
            left: 0; right: 0;
            width: 100% !important;
            height: auto !important;
            max-height: calc(100vh - 64px) !important;
            background: ${palette.paperSoft};
            z-index: 25;
            border-right: none !important;
            border-bottom: 1px solid ${palette.rule};
          }
          .nav-toggle { display: block !important; }
          main { padding: 24px 18px 60px !important; }
        }
        details summary::-webkit-details-marker { display: none; }
        details summary::before {
          content: '▸';
          display: inline-block;
          margin-right: 8px;
          transition: transform 0.2s;
        }
        details[open] summary::before { transform: rotate(90deg); }
      `}</style>
    </div>
  );
}

/* ============================================================
   SUB-COMPONENTES Y ESTILOS COMPARTIDOS
   ============================================================ */
const sectionH3 = {
  fontFamily: "'Fraunces', serif",
  fontWeight: 500,
  fontSize: 22,
  color: palette.ink,
  margin: '32px 0 8px',
  letterSpacing: '-0.005em',
};

function SectionHeader({ number, title }) {
  return (
    <div style={{ marginBottom: 18, paddingBottom: 12, borderBottom: `1px solid ${palette.rule}` }}>
      <div style={{
        fontFamily: "'Inter Tight', sans-serif", fontSize: 11,
        color: palette.accent, letterSpacing: '0.2em',
        textTransform: 'uppercase', marginBottom: 4,
      }}>
        Parte {number}
      </div>
      <h2 style={{
        fontFamily: "'Fraunces', serif", fontWeight: 500,
        fontSize: 30, lineHeight: 1.1, margin: 0,
        color: palette.ink, letterSpacing: '-0.01em',
      }}>
        {title}
      </h2>
    </div>
  );
}
