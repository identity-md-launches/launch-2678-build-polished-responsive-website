// Builds WheelCam browser-source links from a look. Pure functions, so the
// tests in tests/links.test.mjs can load this file directly in Node.
// Parameter names, values and defaults follow the WheelCam README.

export const APP_URL = 'https://wheelcam.online/';
export const REPO_URL = 'https://github.com/iamlequanghuong1/wheelcam';
export const SIGNAL_YELLOW = '#f4c20d';
export const INK = '#111214';
export const PAPER = '#f3eee4';

export type SceneId =
  | 'bug'
  | 'lowerthird'
  | 'ticker'
  | 'gauge'
  | 'run'
  | 'alerts'
  | 'program'
  | 'program-vertical'
  | 'full';

export type Corner = 'tl' | 'tr' | 'bl' | 'br';
export type Theme = 'dark' | 'light';

export interface Scene {
  id: SceneId;
  name: string;
  width: number;
  height: number;
  shows: string;
  /** Corners the bug may take in this scene; empty when the scene has no bug. */
  corners: Corner[];
}

export const SCENES: Scene[] = [
  {
    id: 'program',
    name: 'Program',
    width: 1920,
    height: 1080,
    shows: 'The everyday four in one source: corner bug, lower third, ticker and alerts.',
    corners: ['tl', 'tr'],
  },
  {
    id: 'program-vertical',
    name: 'Program, vertical',
    width: 1080,
    height: 1920,
    shows: 'The program for phone-shaped streams. Keeps the top 150 px and bottom 240 px clear for the app’s own header and chat.',
    corners: ['tl', 'tr'],
  },
  {
    id: 'full',
    name: 'Full',
    width: 1920,
    height: 1080,
    shows: 'Everything in one layout that never overlaps itself, with the gauge and run card docked smaller.',
    corners: ['tl', 'tr'],
  },
  {
    id: 'bug',
    name: 'Corner bug',
    width: 1920,
    height: 1080,
    shows: 'The wheel mark turning at the real wheel speed, live rpm, and whether Squeektoshi is running, resting or asleep.',
    corners: ['tl', 'tr', 'bl', 'br'],
  },
  {
    id: 'lowerthird',
    name: 'Lower third',
    width: 1920,
    height: 1080,
    shows: 'Distance today, 7-day top speed, block height with a bar to the next block, and when the last round settled.',
    corners: [],
  },
  {
    id: 'ticker',
    name: 'Ticker',
    width: 1920,
    height: 1080,
    shows: 'A crawl of lifetime distance, records and the latest settlement, written to be read out loud.',
    corners: [],
  },
  {
    id: 'gauge',
    name: 'Gauge',
    width: 720,
    height: 720,
    shows: 'A 0 to 140 rpm dial with a sprung needle, the 7-day record marked in orange, and a rolling odometer.',
    corners: [],
  },
  {
    id: 'run',
    name: 'Run card',
    width: 720,
    height: 720,
    shows: 'This run as it happens: a speed trace, distance, run clock, top and average speed. Keeps the last run up between runs.',
    corners: [],
  },
  {
    id: 'alerts',
    name: 'Alerts',
    width: 1920,
    height: 1080,
    shows: 'One plate at a time: woke up, went to sleep, run recap, speed record, milestones, streaks and new blocks.',
    corners: [],
  },
];

export interface Look {
  scene: SceneId;
  theme: Theme;
  /** `#rrggbb`, or null for the stock signal yellow. */
  accent: string | null;
  corner: Corner;
  /** Small print size in percent, 90 to 130 in steps of 5. */
  type: number;
  demo: boolean;
  sound: boolean;
}

export const DEFAULT_LOOK: Look = {
  scene: 'program',
  theme: 'dark',
  accent: null,
  corner: 'tr',
  type: 100,
  demo: false,
  sound: false,
};

export function sceneById(id: SceneId): Scene {
  return SCENES.find((s) => s.id === id) ?? SCENES[0]!;
}

/** `5aa9e6`, `#5AA9E6` or `fc0` to `#5aa9e6`; null when it is not a colour. */
export function parseHex(raw: string): string | null {
  const m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(raw.trim());
  const digits = m?.[1]?.toLowerCase();
  if (!digits) return null;
  return `#${digits.length === 3 ? Array.from(digits, (c) => c + c).join('') : digits}`;
}

export function clampType(n: number): number {
  if (!Number.isFinite(n)) return 100;
  return Math.min(130, Math.max(90, Math.round(n / 5) * 5));
}

/** The corner the link will actually carry for this scene, or null for none. */
export function cornerFor(look: Look): Corner | null {
  const allowed = sceneById(look.scene).corners;
  if (allowed.length === 0) return null;
  return allowed.includes(look.corner) ? look.corner : 'tr';
}

/** The browser-source link for a look. Defaults are left out, as in the studio. */
export function buildLink(look: Look, base: string = APP_URL): string {
  const params = new URLSearchParams();
  if (look.scene === 'program-vertical') {
    params.set('scene', 'program');
    params.set('layout', 'vertical');
  } else {
    params.set('scene', look.scene);
  }
  if (look.theme === 'light') params.set('theme', 'light');
  const accent = look.accent ? parseHex(look.accent) : null;
  if (accent && accent !== SIGNAL_YELLOW) params.set('accent', accent.slice(1));
  const type = clampType(look.type);
  if (type !== 100) params.set('type', String(type));
  const corner = cornerFor(look);
  if (corner && corner !== 'tr') params.set('corner', corner);
  if (look.sound) params.set('sound', '1');
  if (look.demo) params.set('demo', '1');
  return `${base}?${params.toString()}`;
}

function channel(c: number): number {
  const s = c / 255;
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
}

/** WCAG relative luminance of a `#rrggbb` colour. */
export function luminance(hex: string): number {
  const n = parseInt(hex.slice(1), 16);
  return 0.2126 * channel((n >> 16) & 255) + 0.7152 * channel((n >> 8) & 255) + 0.0722 * channel(n & 255);
}

export function contrast(a: string, b: string): number {
  const la = luminance(a);
  const lb = luminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

/** Ink or paper, whichever reads better on the colour (as the app does). */
export function readableOn(background: string): string {
  return contrast(background, INK) >= contrast(background, PAPER) ? INK : PAPER;
}
