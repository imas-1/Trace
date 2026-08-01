import type { CaseCall } from '@/types';

interface Props {
  calls: CaseCall[];
}

export function CallsApp({ calls }: Props) {
  return (
    <div>
      {calls.map((c, i) => {
        const icon = c.dir === 'efectuat' ? '↗' : c.missed ? '↙' : '↘';
        return (
          <div key={i} className="flex items-center gap-2.5 border-b border-line py-2.5">
            <div className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-gradient-to-br from-[#3a4152] to-[#1c202a] text-sm text-sub">
              {c.name[0]}
            </div>
            <div className="min-w-0 flex-1">
              <div className={`flex items-center gap-1.5 text-sm font-semibold ${c.missed ? 'text-warn' : ''}`}>
                {c.name} {c.clue && <span className="text-[10px] text-warn">⚑</span>}
              </div>
              <div className="mt-0.5 text-xs text-sub">
                <span className="text-[15px]">{icon}</span> {c.missed ? 'ratat' : `durată ${c.dur}`}
              </div>
            </div>
            <div className="text-[11px] text-sub">{c.time}</div>
          </div>
        );
      })}
    </div>
  );
}
