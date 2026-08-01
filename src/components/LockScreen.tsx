import { useState } from 'react';
import { motion } from 'framer-motion';
import type { SoundKit } from '@/hooks/useSound';

interface Props {
  passcode: string;
  unlocked: boolean;
  onUnlock: () => void;
  sound: SoundKit;
  clockLabel: string;
}

const KEYS: (string | null)[] = ['1', '2', '3', '4', '5', '6', '7', '8', '9', null, '0', 'del'];

export function LockScreen({ passcode, unlocked, onUnlock, sound, clockLabel }: Props) {
  const [entered, setEntered] = useState('');
  const [shake, setShake] = useState(false);

  function pressKey(k: string | null) {
    if (k === null) return;
    if (k === 'del') {
      setEntered((e) => e.slice(0, -1));
      return;
    }
    if (entered.length >= 4) return;
    const next = entered + k;
    sound.tap();
    setEntered(next);
    if (next.length === 4) {
      if (next === passcode) {
        setTimeout(onUnlock, 150);
      } else {
        setShake(true);
        if (navigator.vibrate) navigator.vibrate([15, 10, 15, 10, 15]);
        setTimeout(() => {
          setShake(false);
          setEntered('');
        }, 380);
      }
    }
  }

  return (
    <motion.div
      className="absolute inset-0 z-30 flex flex-col items-center gap-3 px-0 pb-3.5 pt-[52px]"
      style={{
        background:
          'radial-gradient(circle at 30% 20%, rgba(62,232,181,.10), transparent 40%), linear-gradient(160deg,#171b25,#06070a 70%)'
      }}
      animate={unlocked ? { y: '-100%', opacity: 0 } : { y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
    >
      <div className="flex flex-col items-center">
        <div className="font-serif text-[50px] leading-none">{clockLabel}</div>
        <div className="mt-1 text-xs text-sub tracking-wide">Marți, 3 Februarie</div>
      </div>

      <div className="flex w-[264px] items-start gap-2.5 rounded-2xl border border-line bg-white/[0.06] p-2.5 backdrop-blur-xl">
        <div className="flex h-6 w-6 flex-none items-center justify-center rounded-[7px] bg-accentDim text-xs">✉</div>
        <div className="min-w-0 flex-1">
          <div className="flex justify-between text-[11px] text-sub"><span>Mesaje</span><span>acum</span></div>
          <div className="mt-0.5 text-[12.5px] leading-snug"><b>Andreea:</b> te rog nu mai suna, o rezolv singură</div>
        </div>
      </div>
      <div className="flex w-[264px] items-start gap-2.5 rounded-2xl border border-line bg-white/[0.06] p-2.5 backdrop-blur-xl">
        <div className="flex h-6 w-6 flex-none items-center justify-center rounded-[7px] bg-accentDim text-xs">✉</div>
        <div className="min-w-0 flex-1">
          <div className="flex justify-between text-[11px] text-sub"><span>Mesaje</span><span>2 min</span></div>
          <div className="mt-0.5 text-[12.5px] leading-snug"><b>Necunoscut:</b> știu ce ai făcut. mai avem de vorbit.</div>
        </div>
      </div>

      <motion.div className="flex gap-3.5" animate={shake ? { x: [0, -8, 8, -8, 8, 0] } : { x: 0 }} transition={{ duration: 0.35 }}>
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`h-2.5 w-2.5 rounded-full border-[1.4px] ${i < entered.length ? 'border-text bg-text' : 'border-white/40'}`}
          />
        ))}
      </motion.div>

      <div className="grid grid-cols-3 gap-2.5">
        {KEYS.map((k, i) => (
          <button
            key={i}
            className={`flex h-14 w-14 items-center justify-center rounded-full text-lg ${
              k === null ? 'bg-transparent' : 'border border-white/[0.08] bg-white/[0.06] active:bg-white/[0.16]'
            }`}
            onClick={() => pressKey(k)}
          >
            {k === 'del' ? '⌫' : k}
          </button>
        ))}
      </div>
      <p className="max-w-[240px] px-8 text-center text-[10.5px] leading-relaxed text-sub">
        Poliția a găsit pe biroul ei un bilet: „02 / 17” — ziua ei de naștere. Ar putea fi codul telefonului.
      </p>
    </motion.div>
  );
}
