import { useState } from 'react';
import type { CaseLocation } from '@/types';

interface Props {
  locations: CaseLocation[];
}

export function MapsApp({ locations }: Props) {
  const [active, setActive] = useState<CaseLocation | null>(null);

  return (
    <div
      className="relative -mx-4 -mb-[30px] -mt-3.5 h-[calc(100%+56px)] overflow-hidden"
      style={{
        background:
          'linear-gradient(160deg,#0f1720,#0a0d13), linear-gradient(rgba(255,255,255,.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.04) 1px, transparent 1px)',
        backgroundSize: 'auto, 34px 34px, 34px 34px'
      }}
    >
      <div className="absolute left-3.5 top-3 rounded-lg border border-line bg-black/70 px-2 py-1.5 text-[10px] leading-relaxed text-sub">
        ⬧ ultima locație&nbsp;&nbsp;⬦ locație anterioară
      </div>

      {locations.map((loc) => (
        <button
          key={loc.id}
          className="absolute -translate-x-1/2 -translate-y-full text-center"
          style={{ left: `${loc.x}%`, top: `${loc.y}%` }}
          onClick={() => setActive(loc)}
        >
          <div
            className={`mx-auto h-4 w-4 rotate-[-45deg] rounded-[50%_50%_50%_0] ${
              loc.last ? 'bg-accent shadow-[0_0_0_3px_rgba(62,232,181,0.3)]' : 'bg-warn shadow-[0_0_0_3px_rgba(232,118,62,0.25)]'
            }`}
          />
          <div className="mt-0.5 whitespace-nowrap rounded-md border border-line bg-black/85 px-1.5 py-0.5 text-[9.5px]">
            {loc.name}
          </div>
        </button>
      ))}

      {active && (
        <div className="absolute inset-x-3.5 bottom-3.5 rounded-2xl border border-line bg-panel/95 p-3.5 backdrop-blur-md">
          <button className="absolute right-2.5 top-2 text-sm text-sub" onClick={() => setActive(null)}>
            ✕
          </button>
          <div className="text-[13.5px] font-semibold">{active.name}</div>
          <div className="mt-1 text-xs leading-snug text-sub">
            <b className="text-text">{active.time}</b>
            <br />
            {active.note}
          </div>
        </div>
      )}
    </div>
  );
}
