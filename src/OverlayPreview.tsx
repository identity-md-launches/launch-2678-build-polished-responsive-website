// A drawn sample frame of the WheelCam program: corner bug, lower third and
// ticker over a stand-in for the camera. Shapes, colours and lettering follow
// the app's overlay.css; the numbers are fixed sample values, and the caption
// beside it says so.

import { readableOn, SIGNAL_YELLOW, type Corner, type Theme } from './links.ts';

interface Props {
  theme: Theme;
  accent: string | null;
  corner: Corner | null;
  paused: boolean;
}

const THEMES = {
  dark: { plate: '#111214', onPlate: '#f3eee4', muted: '#aba395', rule: '#3a3b40', track: '#2d2e33' },
  light: { plate: '#f3eee4', onPlate: '#111214', muted: '#5b554b', rule: '#cdc3af', track: '#d7cdba' },
} as const;

function Wheel({ x, y, size, ink, spinning }: { x: number; y: number; size: number; ink: string; spinning: boolean }) {
  const spokes = Array.from({ length: 6 }, (_, i) => {
    const a = (i * Math.PI) / 3;
    return <line key={i} x1={0} y1={0} x2={36 * Math.cos(a)} y2={36 * Math.sin(a)} strokeLinecap="square" />;
  });
  return (
    <g transform={`translate(${x} ${y}) scale(${size / 100})`} stroke={ink} fill="none">
      <g className={spinning ? 'pv-rotor is-spinning' : 'pv-rotor'}>
        <circle r={40} strokeWidth={9} />
        <g strokeWidth={6}>{spokes}</g>
        <circle r={9} fill={ink} stroke="none" />
      </g>
    </g>
  );
}

export function OverlayPreview({ theme, accent, corner, paused }: Props) {
  const t = THEMES[theme];
  const a = accent ?? SIGNAL_YELLOW;
  // Dark plates: accent tabs with readable lettering. Light plates: black tabs, accent lettering.
  const tab = theme === 'dark' ? a : '#111214';
  const onTab = theme === 'dark' ? readableOn(a) : a;
  const fill = theme === 'dark' ? a : '#111214';
  const c = corner ?? 'tr';
  const right = c === 'tr' || c === 'br';
  const bottom = c === 'bl' || c === 'br';
  // The bug is 426 x 84 stage pixels, inset 64 x 48 like the app's safe area.
  // A bottom corner sits above the sample lower third so the two stay apart.
  const bx = right ? 1920 - 64 - 426 : 64;
  const by = bottom ? 700 : 48;

  return (
    <svg
      className="pv"
      viewBox="0 0 1920 1080"
      role="img"
      aria-label={`Sample WheelCam frame with ${theme} plates: corner bug at ${right ? 'right' : 'left'}, lower third and ticker over a drawn hamster wheel.`}
    >
      {/* Stand-in for the camera: a warm room and the wheel. */}
      <rect width="1920" height="1080" fill="#e7ddcb" />
      <rect y="760" width="1920" height="320" fill="#d6c7ab" />
      <g transform="translate(960 470)" fill="none" stroke="#b9a78a">
        <circle r="330" strokeWidth="26" />
        <circle r="290" strokeWidth="6" />
        <g strokeWidth="10">
          {Array.from({ length: 12 }, (_, i) => {
            const ang = (i * Math.PI) / 6;
            return <line key={i} x1="0" y1="0" x2={290 * Math.cos(ang)} y2={290 * Math.sin(ang)} />;
          })}
        </g>
        <circle r="34" fill="#b9a78a" />
        <path d="M-120 330 L-180 600 M120 330 L180 600" strokeWidth="26" />
      </g>
      <g transform="translate(960 735)">
        <ellipse rx="120" ry="72" fill="#d9792b" />
        <ellipse cx="96" cy="-30" rx="58" ry="50" fill="#d9792b" />
        <ellipse cx="80" cy="12" rx="70" ry="40" fill="#f1d3ad" />
        <circle cx="122" cy="-44" r="9" fill="#111214" />
        <ellipse cx="78" cy="-74" rx="20" ry="16" fill="#c4651f" />
      </g>

      {/* Corner bug */}
      <g transform={`translate(${bx} ${by})`}>
        <polygon points="0,0 96,0 80,84 0,84" fill={tab} />
        <Wheel x={42} y={42} size={58} ink={onTab} spinning={!paused} />
        <polygon points="80,0 426,0 410,84 64,84" fill={t.plate} />
        <text x="148" y="52" textAnchor="middle" className="pv-cond pv-big" fill={t.onPlate}>
          42
        </text>
        <text x="148" y="74" textAnchor="middle" className="pv-cond pv-label" fill={t.muted}>
          RPM
        </text>
        <line x1="208" y1="18" x2="208" y2="66" stroke={t.rule} strokeWidth="2" />
        <text x="230" y="34" className="pv-cond pv-label" fill={t.muted}>
          SQUEEKTOSHI
        </text>
        <circle cx="238" cy="56" r="7" fill={a} />
        <text x="254" y="66" className="pv-cond pv-mood" fill={t.onPlate}>
          ON THE WHEEL
        </text>
      </g>

      {/* Lower third */}
      <g transform="translate(64 812)">
        <polygon points="0,0 330,0 318,44 0,44" fill={tab} />
        <text x="18" y="32" className="pv-cond pv-tab" fill={onTab}>
          SQUEEKTOSHI TODAY
        </text>
        <rect y="44" width="1040" height="104" fill={t.plate} />
        <g className="pv-cond">
          <text x="28" y="108" className="pv-big" fill={t.onPlate}>
            1.84<tspan className="pv-unit" fill={t.muted}> KM</tspan>
          </text>
          <text x="28" y="134" className="pv-label" fill={t.muted}>
            DISTANCE TODAY
          </text>
          <line x1="276" y1="62" x2="276" y2="130" stroke={t.rule} strokeWidth="2" />
          <text x="304" y="108" className="pv-big" fill={t.onPlate}>
            1.21<tspan className="pv-unit" fill={t.muted}> M/S</tspan>
          </text>
          <text x="304" y="134" className="pv-label" fill={t.muted}>
            7-DAY TOP SPEED
          </text>
          <line x1="560" y1="62" x2="560" y2="130" stroke={t.rule} strokeWidth="2" />
          <text x="588" y="108" className="pv-big" fill={t.onPlate}>
            #18,204
          </text>
          <rect x="800" y="86" width="210" height="14" fill={t.track} />
          <rect x="800" y="86" width="138" height="14" fill={fill} />
          <text x="588" y="134" className="pv-label" fill={t.muted}>
            SETTLED BLOCK, NEXT AT 66 %
          </text>
        </g>
      </g>

      {/* Ticker */}
      <g transform="translate(0 984)">
        <rect width="1920" height="48" fill={t.plate} />
        <polygon points="0,0 214,0 202,48 0,48" fill={tab} />
        <text x="64" y="34" className="pv-cond pv-tab" fill={onTab}>
          WHEELCAM
        </text>
        <text x="244" y="34" className="pv-cond pv-tick" fill={t.onPlate}>
          LIFETIME 412.6 KM <tspan fill={t.muted}>/</tspan> 18,204 BLOCKS SETTLED <tspan fill={t.muted}>/</tspan> TOP
          SPEED 1.21 M/S THIS WEEK
        </text>
      </g>
    </svg>
  );
}
