import { useId, useRef, useState } from 'react';
import { CopyButton } from './CopyButton.tsx';
import { buildLink, cornerFor, parseHex, SCENES, sceneById, SIGNAL_YELLOW, type Corner, type Look } from './links.ts';

// The app's own accent presets (src/logic/colour.ts in the WheelCam repo).
const ACCENTS: Array<{ name: string; hex: string | null }> = [
  { name: 'Signal yellow (stock)', hex: null },
  { name: 'Water-bottle blue', hex: '#5aa9e6' },
  { name: 'Cucumber green', hex: '#7cc35a' },
  { name: 'Chew-toy pink', hex: '#ff6fa8' },
  { name: 'Pellet violet', hex: '#9a7cf5' },
  { name: 'Night-shift red', hex: '#e8483e' },
  { name: 'Bedding white', hex: '#f3eee4' },
];

const CORNER_NAMES: Record<Corner, string> = { tl: 'Top left', tr: 'Top right', bl: 'Bottom left', br: 'Bottom right' };

interface Props {
  look: Look;
  onChange: (look: Look) => void;
}

export function LinkBuilder({ look, onChange }: Props) {
  const id = useId();
  const urlRef = useRef<HTMLInputElement>(null);
  const [customText, setCustomText] = useState('');
  const [customError, setCustomError] = useState(false);
  const scene = sceneById(look.scene);
  const link = buildLink(look);
  const corner = cornerFor(look);
  const set = (patch: Partial<Look>) => onChange({ ...look, ...patch });
  const presetPicked = look.accent === null || ACCENTS.some((a) => a.hex === look.accent);

  const applyCustom = (raw: string) => {
    setCustomText(raw);
    if (raw.trim() === '') {
      setCustomError(false);
      return;
    }
    const hex = parseHex(raw);
    setCustomError(hex === null);
    if (hex) set({ accent: hex === SIGNAL_YELLOW ? null : hex });
  };

  return (
    <div className="builder">
      <form className="builder-controls" onSubmit={(e) => e.preventDefault()} aria-label="Scene link settings">
        <fieldset className="field">
          <legend className="field-name">Scene</legend>
          <div className="choice-grid">
            {SCENES.map((s) => (
              <label key={s.id} className="choice">
                <input
                  type="radio"
                  name={`${id}-scene`}
                  value={s.id}
                  checked={look.scene === s.id}
                  onChange={() => set({ scene: s.id })}
                />
                <span>{s.name}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="field">
          <legend className="field-name">Plates</legend>
          <div className="seg">
            {(['dark', 'light'] as const).map((th) => (
              <label key={th} className="seg-item">
                <input type="radio" name={`${id}-theme`} checked={look.theme === th} onChange={() => set({ theme: th })} />
                <span>{th === 'dark' ? 'Dark' : 'Light'}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="field">
          <legend className="field-name">Accent colour</legend>
          <div className="swatches">
            {ACCENTS.map((a) => (
              <input
                key={a.name}
                type="radio"
                className="swatch"
                name={`${id}-accent`}
                aria-label={a.name}
                title={a.name}
                style={{ backgroundColor: a.hex ?? SIGNAL_YELLOW }}
                checked={look.accent === a.hex}
                onChange={() => {
                  setCustomText('');
                  setCustomError(false);
                  set({ accent: a.hex });
                }}
              />
            ))}
          </div>
          <div className="custom-hex">
            <label htmlFor={`${id}-hex`}>Your own hex colour</label>
            <input
              id={`${id}-hex`}
              className="text-input"
              inputMode="text"
              autoComplete="off"
              spellCheck={false}
              placeholder="5aa9e6"
              value={customText}
              aria-invalid={customError}
              aria-describedby={`${id}-hex-hint`}
              onChange={(e) => applyCustom(e.target.value)}
            />
            <span id={`${id}-hex-hint`} className={customError ? 'hint hint-error' : 'hint'}>
              {customError
                ? 'Use three or six hex digits, like fc0 or 5aa9e6.'
                : presetPicked
                  ? 'Six hex digits, with or without #.'
                  : `Using ${look.accent}.`}
            </span>
          </div>
        </fieldset>

        <fieldset className="field" disabled={scene.corners.length === 0}>
          <legend className="field-name">Bug corner</legend>
          {scene.corners.length === 0 ? (
            <p className="hint">{scene.name} has no corner bug.</p>
          ) : (
            <div className="seg">
              {scene.corners.map((c) => (
                <label key={c} className="seg-item">
                  <input type="radio" name={`${id}-corner`} checked={corner === c} onChange={() => set({ corner: c })} />
                  <span>{CORNER_NAMES[c]}</span>
                </label>
              ))}
            </div>
          )}
        </fieldset>

        <div className="field">
          <label className="field-name" htmlFor={`${id}-type`}>
            Small print size
          </label>
          <div className="range-row">
            <input
              id={`${id}-type`}
              type="range"
              min={90}
              max={130}
              step={5}
              value={look.type}
              onChange={(e) => set({ type: Number(e.target.value) })}
            />
            <output htmlFor={`${id}-type`} className="range-value">
              {look.type} %
            </output>
          </div>
          <span className="hint">Labels, units and alert details. Big figures keep their size.</span>
        </div>

        <div className="field">
          <label className="check">
            <input type="checkbox" checked={look.demo} onChange={(e) => set({ demo: e.target.checked })} />
            <span>
              <b>Rehearsal mode</b>
              <span className="hint">A scripted 160-second night with every alert. Tagged DEMO on screen.</span>
            </span>
          </label>
          <label className="check">
            <input type="checkbox" checked={look.sound} onChange={(e) => set({ sound: e.target.checked })} />
            <span>
              <b>Alert sounds</b>
              <span className="hint">Short blips on alerts. Tick “Control audio via OBS” on the source.</span>
            </span>
          </label>
        </div>
      </form>

      <div className="builder-out">
        <label className="field-name" htmlFor={`${id}-url`}>
          Browser source link
        </label>
        <div className="url-row">
          <input id={`${id}-url`} ref={urlRef} className="url" readOnly value={link} onFocus={(e) => e.currentTarget.select()} />
          <CopyButton text={link} label="Copy link" target={urlRef} />
        </div>
        <dl className="spec">
          <div>
            <dt>Width</dt>
            <dd>{scene.width} px</dd>
          </div>
          <div>
            <dt>Height</dt>
            <dd>{scene.height} px</dd>
          </div>
        </dl>
        <p className="scene-note">{scene.shows}</p>
        {look.scene === 'program-vertical' ? (
          <p className="scene-note">Set the OBS canvas to 1080 x 1920 first: Settings, Video, Base Canvas Resolution.</p>
        ) : null}
        <a className="text-link" href={link} target="_blank" rel="noopener">
          Open this scene in a new tab
        </a>
      </div>
    </div>
  );
}
