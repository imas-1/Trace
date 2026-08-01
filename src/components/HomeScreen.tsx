import type { AppId, CaseData } from '@/types';

interface AppDef {
  id: AppId;
  icon: string;
  label: string;
  gradient: string;
  badge?: number;
}

const APPS: AppDef[] = [
  { id: 'messages', icon: '✉', label: 'Mesaje', gradient: 'from-accent to-[#1a8f6e]', badge: 5 },
  { id: 'gallery', icon: '▧', label: 'Galerie', gradient: 'from-[#6f8dfb] to-[#2c3e9c]' },
  { id: 'notes', icon: '✎', label: 'Notițe', gradient: 'from-[#f5c451] to-[#c98a1c]' },
  { id: 'board', icon: '⚑', label: 'Board', gradient: 'from-warn to-[#8a3a1a]' },
  { id: 'maps', icon: '◎', label: 'Hărți', gradient: 'from-[#5bd0f0] to-[#1c7fa3]' },
  { id: 'calls', icon: '☎', label: 'Apeluri', gradient: 'from-[#8f7bf0] to-[#4a3a9c]' }
];

interface Props {
  caseData: CaseData;
  onOpenApp: (id: AppId) => void;
}

export function HomeScreen({ caseData, onOpenApp }: Props) {
  return (
    <div
      className="absolute inset-0 z-20 pt-[70px]"
      style={{
        background:
          'radial-gradient(circle at 70% 10%, rgba(62,232,181,.06), transparent 45%), linear-gradient(170deg,#12141b,#07080b 75%)'
      }}
    >
      <div className="mx-6 rounded-2xl border border-line bg-white/[0.03] p-3.5">
        <div className="text-[10px] uppercase tracking-[0.14em] text-sub">Caz activ</div>
        <div className="mt-1 text-[13px] leading-snug text-[#dfe4ea]">{caseData.intro.subtitle}</div>
      </div>

      <div className="mt-[22px] grid grid-cols-3 gap-x-[18px] gap-y-[22px] px-6">
        {APPS.map((app) => (
          <button key={app.id} className="flex flex-col items-center gap-1.5" onClick={() => onOpenApp(app.id)}>
            <div
              className={`relative flex h-[58px] w-[58px] items-center justify-center rounded-2xl bg-gradient-to-br text-2xl shadow-lg ${app.gradient}`}
            >
              {app.icon}
              {app.badge && (
                <span className="absolute -right-1 -top-1 flex h-4 min-w-[16px] items-center justify-center rounded-lg bg-warn px-1 text-[10px] font-bold text-[#1c0a02]">
                  {app.badge}
                </span>
              )}
            </div>
            <div className="text-[11px] text-[#dfe4ea]">{app.label}</div>
          </button>
        ))}
      </div>

      <div className="absolute bottom-2.5 left-1/2 h-1 w-[120px] -translate-x-1/2 rounded-full bg-white/30" />
    </div>
  );
}
