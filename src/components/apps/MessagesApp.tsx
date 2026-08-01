import { useEffect, useState } from 'react';
import type { CaseThread } from '@/types';
import type { SoundKit } from '@/hooks/useSound';

interface Props {
  threads: CaseThread[];
  sound: SoundKit;
}

export function MessagesApp({ threads, sound }: Props) {
  const [active, setActive] = useState<CaseThread | null>(null);

  useEffect(() => {
    if (active && active.messages.some((m) => m.clue)) sound.clue();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  if (active) {
    return (
      <div>
        <button className="mb-2.5 flex items-center gap-1 text-sm text-accent" onClick={() => setActive(null)}>
          ‹ Conversații
        </button>
        {active.messages.map((m, i) => (
          <div key={i} className={`my-2 flex ${m.from === 'me' ? 'justify-end' : 'justify-start'}`}>
            <div>
              <div
                className={`max-w-[240px] rounded-2xl px-3.5 py-2.5 text-[13.5px] leading-snug ${
                  m.from === 'me' ? 'rounded-br-[5px] bg-accentDim' : 'rounded-bl-[5px] bg-[#1e2330]'
                } ${m.clue ? 'border border-warn shadow-[0_0_0_1px_rgba(232,118,62,0.2)]' : ''}`}
              >
                {m.text}
              </div>
              {m.clue && <div className="mt-0.5 text-[10px] uppercase tracking-wide text-warn">⚑ posibilă indiciu</div>}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      {threads.map((th) => {
        const last = th.messages[th.messages.length - 1];
        return (
          <div
            key={th.id}
            className="flex cursor-pointer items-center gap-2.5 border-b border-line px-1 py-2.5"
            onClick={() => { sound.tap(); setActive(th); }}
          >
            <div className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-gradient-to-br from-[#3a4152] to-[#1c202a] text-sm text-sub">
              {th.initials}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold">{th.name}</div>
              <div className="truncate text-[12.5px] text-sub">{last?.text}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
