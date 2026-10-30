import { useEffect, useRef, useState } from 'react';

type State = 'idle' | 'copied' | 'failed';

/** Copies `text`; falls back to selecting `fallbackTarget` when the clipboard is blocked. */
export async function copyText(text: string, fallbackTarget?: HTMLInputElement | HTMLTextAreaElement | null): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Fall through to the selection fallback.
  }
  if (fallbackTarget) {
    fallbackTarget.focus();
    fallbackTarget.select();
    try {
      return document.execCommand('copy');
    } catch {
      return false;
    }
  }
  return false;
}

interface Props {
  text: string;
  label: string;
  /** The field holding `text`, selected when the clipboard is unavailable. */
  target?: React.RefObject<HTMLInputElement | HTMLTextAreaElement | null>;
  className?: string;
}

export function CopyButton({ text, label, target, className }: Props) {
  const [state, setState] = useState<State>('idle');
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);
  // A changed value makes an old "Copied" untrue.
  useEffect(() => setState('idle'), [text]);

  const onClick = async () => {
    const ok = await copyText(text, target?.current);
    setState(ok ? 'copied' : 'failed');
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setState('idle'), 2400);
  };

  return (
    <>
      <button type="button" className={className ?? 'btn btn-ink'} onClick={onClick}>
        {state === 'copied' ? 'Copied' : label}
      </button>
      <span className={state === 'failed' ? 'copy-failed' : 'sr-only'} role="status">
        {state === 'copied' ? 'Copied to the clipboard.' : state === 'failed' ? 'Unable to copy here. Select the text and copy it yourself.' : ''}
      </span>
    </>
  );
}
