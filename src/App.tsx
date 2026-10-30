import { useRef, useState } from 'react';
import { CopyButton } from './CopyButton.tsx';
import { LinkBuilder } from './LinkBuilder.tsx';
import { OverlayPreview } from './OverlayPreview.tsx';
import { APP_URL, cornerFor, DEFAULT_LOOK, REPO_URL, SCENES, type Look } from './links.ts';

const CLONE = `git clone ${REPO_URL}.git
cd wheelcam
npm install
npm run dev`;

function Mark() {
  return (
    <svg viewBox="-50 -50 100 100" width="30" height="30" aria-hidden="true" fill="none" stroke="currentColor">
      <circle r="40" strokeWidth="9" />
      <path d="M0 0 36 0M0 0 18 31.2M0 0-18 31.2M0 0-36 0M0 0-18-31.2M0 0 18-31.2" strokeWidth="6" />
      <circle r="9" fill="currentColor" stroke="none" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg viewBox="0 0 16 16" width="18" height="18" aria-hidden="true" fill="currentColor">
      <path d="M8 0C3.58 0 0 3.58 0 8a8 8 0 0 0 5.47 7.59c.4.07.55-.17.55-.38v-1.33c-2.23.48-2.7-1.07-2.7-1.07-.36-.92-.89-1.17-.89-1.17-.73-.5.06-.49.06-.49.8.06 1.23.83 1.23.83.72 1.22 1.88.87 2.33.66.07-.52.28-.87.5-1.07-1.78-.2-3.65-.89-3.65-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.6 7.6 0 0 1 4 0c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.28.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48v2.2c0 .21.15.46.55.38A8 8 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
    </svg>
  );
}

export function App() {
  const [look, setLook] = useState<Look>(DEFAULT_LOOK);
  const [paused, setPaused] = useState(false);
  const cloneRef = useRef<HTMLTextAreaElement>(null);

  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <header className="head">
        <a className="brand" href="#top" aria-label="WheelCam, back to top">
          <span className="brand-mark">
            <Mark />
          </span>
          <span className="brand-word">WheelCam</span>
        </a>
        <nav className="nav" aria-label="Sections">
          <a href="#setup">Setup</a>
          <a href="#link">Build a link</a>
          <a href="#scenes">Scenes</a>
          <a className="nav-gh" href={REPO_URL} target="_blank" rel="noopener">
            <GitHubIcon />
            <span>GitHub</span>
          </a>
        </nav>
      </header>

      <main id="main">
        <section className="hero" id="top" aria-labelledby="hero-title">
          <div className="hero-copy">
            <h1 id="hero-title" className="h1">
              Put the <mark>wheel</mark> on air.
            </h1>
            <p className="lede">
              WheelCam is a free set of transparent OBS overlays that show Squeektoshi's hamster wheel live: rpm,
              distance, runs and alerts.
            </p>
            <div className="actions">
              <a className="btn btn-ink btn-lg" href={APP_URL}>
                Open WheelCam
              </a>
              <a className="btn btn-line btn-lg" href={REPO_URL} target="_blank" rel="noopener">
                <GitHubIcon />
                View the source
              </a>
            </div>
          </div>
          <figure className="hero-shot">
            <div className="frame">
              <OverlayPreview theme={look.theme} accent={look.accent} corner={cornerFor(look) ?? 'tr'} paused={paused} />
            </div>
            <figcaption className="caption">
              <span>Sample frame with example numbers. The live app reads the real wheel.</span>
              <button type="button" className="text-btn" aria-pressed={paused} onClick={() => setPaused((p) => !p)}>
                {paused ? 'Play wheel' : 'Pause wheel'}
              </button>
            </figcaption>
          </figure>
        </section>

        <section className="band" id="setup" aria-labelledby="setup-title">
          <h2 id="setup-title" className="h2">
            <span className="tab">Add it to OBS in four steps</span>
          </h2>
          <ol className="steps">
            <li>
              <h3 className="h3">Open the studio</h3>
              <p>
                Go to <a href={APP_URL}>wheelcam.online</a>. With no parameters you land in the studio: every scene
                previewed over a drawn stand-in for the camera, with test alerts you can fire.
              </p>
            </li>
            <li>
              <h3 className="h3">Pick a look and copy a link</h3>
              <p>
                Choose dark or light plates, an accent colour and the small print size, then copy the scene link. You can
                also <a href="#link">build a link on this page</a>.
              </p>
            </li>
            <li>
              <h3 className="h3">Add a Browser source</h3>
              <p>
                In OBS, add a Browser source, paste the link and enter the width and height listed for that scene. Leave
                Custom CSS as it is.
              </p>
            </li>
            <li>
              <h3 className="h3">Keep it watching</h3>
              <p>
                Untick “Shutdown source when not visible” so the alerts keep watching the wheel. Using sound? Tick
                “Control audio via OBS”.
              </p>
            </li>
          </ol>
        </section>

        <section className="band" id="link" aria-labelledby="link-title">
          <h2 id="link-title" className="h2">
            <span className="tab">Build a scene link</span>
          </h2>
          <p className="section-lede">
            Every choice here becomes a URL parameter for wheelcam.online. The sample frame at the top follows your plates,
            accent and bug corner.
          </p>
          <LinkBuilder look={look} onChange={setLook} />
        </section>

        <section className="band" id="scenes" aria-labelledby="scenes-title">
          <h2 id="scenes-title" className="h2">
            <span className="tab">Nine scenes, one layout</span>
          </h2>
          <p className="section-lede">
            The 1920 x 1080 scenes share one layout, so you can stack several at full canvas size and nothing collides.
            Gauge and run card are square: place them anywhere.
          </p>
          <ul className="scenes">
            {SCENES.map((s) => (
              <li key={s.id} className="scene">
                <div className="scene-head">
                  <h3 className="h3">{s.name}</h3>
                  <span className="scene-size">
                    {s.width} x {s.height}
                  </span>
                </div>
                <p>{s.shows}</p>
                <code className="scene-param">
                  {s.id === 'program-vertical' ? 'scene=program&layout=vertical' : `scene=${s.id}`}
                </code>
              </li>
            ))}
          </ul>
        </section>

        <section className="band" id="good-to-know" aria-labelledby="know-title">
          <h2 id="know-title" className="h2">
            <span className="tab">Before you go live</span>
          </h2>
          <ul className="facts">
            <li>
              <h3 className="h3">A lost feed looks lost</h3>
              <p>
                When the data is stale or missing, the graphics swap to a yellow and black “Signal lost” plate. Unknown
                numbers print as -- and never as zero.
              </p>
            </li>
            <li>
              <h3 className="h3">Times are UTC</h3>
              <p>
                “Today” follows the wheel's own day, noon to noon UTC. Live numbers trail the wheel by a couple of seconds;
                settled numbers by 10 to 20 minutes.
              </p>
            </li>
            <li>
              <h3 className="h3">Read only</h3>
              <p>
                WheelCam reads the public API at api.squeekchain.com. There is no key, no account and no wallet: it only
                draws what the API reports.
              </p>
            </li>
            <li>
              <h3 className="h3">Rehearse first</h3>
              <p>
                Add demo=1 to any link for a scripted night with every alert type and a signal drop. A DEMO tag stays on
                screen so it cannot slip onto a real broadcast.
              </p>
            </li>
          </ul>
        </section>

        <section className="band" id="source" aria-labelledby="source-title">
          <h2 id="source-title" className="h2">
            <span className="tab">Run your own copy</span>
          </h2>
          <div className="source">
            <div className="source-copy">
              <p>
                WheelCam is open source under the MIT license. It is a static Vite site, so any static host can serve the
                build, from a sub-folder too.
              </p>
              <a className="repo" href={REPO_URL} target="_blank" rel="noopener">
                <GitHubIcon />
                <span>iamlequanghuong1/wheelcam on GitHub</span>
              </a>
              <p className="hint">Needs Node 22.18 or newer. Run npm run build to write the site to dist/.</p>
            </div>
            <div className="code-block">
              <label className="sr-only" htmlFor="clone-cmd">
                Commands to run WheelCam locally
              </label>
              <textarea id="clone-cmd" ref={cloneRef} className="code" readOnly rows={4} value={CLONE} spellCheck={false} />
              <CopyButton text={CLONE} label="Copy commands" target={cloneRef} className="btn btn-ink btn-code" />
            </div>
          </div>
        </section>
      </main>

      <footer className="foot">
        <p>
          A fan project. Squeektoshi, the WHEELY9000 and Squeekchain belong to the folks at{' '}
          <a href="https://squeekchain.com" target="_blank" rel="noopener">
            squeekchain.com
          </a>
          .
        </p>
        <p>
          <a href={APP_URL}>wheelcam.online</a>
          <span aria-hidden="true"> · </span>
          <a href={REPO_URL} target="_blank" rel="noopener">
            Source on GitHub
          </a>
          <span aria-hidden="true"> · </span>
          MIT license
        </p>
      </footer>
    </>
  );
}
