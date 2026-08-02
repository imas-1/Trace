import { useMemo } from 'react';

let audioCtx: AudioContext | null = null;
function getCtx(): AudioContext {
  if (!audioCtx) {
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioCtx = new Ctor();
  }
  return audioCtx;
}

function beep(freq: number, dur: number, type: OscillatorType, vol: number): void {
  try {
    const ctx = getCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.value = vol;
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
    osc.stop(ctx.currentTime + dur);
  } catch {
    // AudioContext blocked until a user gesture — safe to ignore
  }
}

function haptic(pattern: number | number[] = 15): void {
  if (navigator.vibrate) navigator.vibrate(pattern);
}

export interface SoundKit {
  tap: () => void;
  unlock: () => void;
  open: () => void;
  close: () => void;
  notif: () => void;
  clue: () => void;
  ending: () => void;
}

export function useSound(enabled: boolean): SoundKit {
  return useMemo<SoundKit>(() => {
    if (!enabled) {
      const noop = () => {};
      return { tap: noop, unlock: noop, open: noop, close: noop, notif: noop, clue: noop, ending: noop };
    }
    return {
      tap: () => { beep(650, 0.03, 'sine', 0.03); haptic(8); },
      unlock: () => { beep(520, 0.05, 'sine', 0.05); beep(780, 0.06, 'sine', 0.05); haptic([10, 20, 10]); },
      open: () => { beep(340, 0.05, 'triangle', 0.04); haptic(12); },
      close: () => { beep(260, 0.05, 'triangle', 0.03); haptic(8); },
      notif: () => { beep(900, 0.045, 'sine', 0.045); beep(1150, 0.05, 'sine', 0.04); haptic([8, 30, 8]); },
      clue: () => { beep(1300, 0.09, 'square', 0.03); haptic([15, 20, 15]); },
      ending: () => { beep(200, 0.15, 'sawtooth', 0.04); haptic([20, 40, 20, 40]); }
    };
  }, [enabled]);
}
