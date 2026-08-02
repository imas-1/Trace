import type { AppId, CaseData } from '@/types';

interface AppDef {
  id: AppId;
  icon: string;
  label: string;
  gradient: string;
}

const APPS: AppDef[] = [
  { id: 'messages', icon: '✉', label: 'Mesaje', gradient: 'from-accent to-[#1a8f6e]' },
  { id: 'gallery', icon: '▧', label: 'Galerie', gradient: 'from-[#6f8dfb] to-[#2c3e9c]' },
  { id: 'notes', icon: '✎', label: 'Notițe', gradient: 'from-[#f5c451] to-[#c98a1c]' },
  { id: 'board', icon: '⚑', label: 'Board', gradient: 'from-warn to-[#8a3a1a]' },
  { id: 'maps', icon: '◎', label: 'Hărți', gradient: 'from-[#5bd0f0] to-[#1c7fa3]' },
  { id: 'calls', icon: '☎', label: 'Apeluri', gradient: 'from-[#8f7bf0] to-[#4a3a9c]' },
  { id: 'settings', icon: '⚙', label: 'Setări', gradient: 'from-[#7a8593] to-[#3c434c]' }
];

interface Props {
  caseData: CaseData;
  onOpenApp: (id: AppId) => void;
  linksCount: number;
  unreadMessages: number;
  unreadGallery: number;
  unreadCalls: number;
  onHelp: () => void;
}

export function HomeScreen({ caseData, onOpenApp, linksCount, unreadMessages, unreadGallery, unreadCalls, onHelp }: Props) {
  const totalPins = caseData.board.length;
  const progressPct = totalPins > 0 ? Math.min(100, Math.round((linksCount / totalPins) * 100)) : 0;

  return (
    <div
      className="absolute inset-0 z-20 pt-[70px]"
      style={{
        background:
          'radial-gradient(circle at 70% 10%, rgba(62,232,181,.06), transparent 45%), linear-gradient(170deg,#12141b,#07080b 75%)'
      }}
    >
      <button
        className="absolute right-5 top-[52px] z-30 flex h-7 w-7 items-center justify-center rounded-full border border-line bg-white/[0.05] text-[13px] text-sub"
        onClick={onHelp}
        aria-label="Cum se joacă"
      >
        ?
      </button>

      <div className="mx-6 rounded-2xl border border-line bg-white/[0.03] p-3.5">
        <div className="flex items-center justify-between">
          <div className="text-[10px] uppercase tracking-[0.14em] text-sub">Caz activ</div>
          {linksCount > 0 && (
            <div className="rounded-full bg-accentDim/40 px-2 py-0.5 text-[10px] font-semibold text-accent">
              {linksCount} conexiuni pe board
            </div>
          )}
        </div>
        <div className="mt-1 text-[13px] leading-snug text-[#dfe4ea]">{caseData.intro.subtitle}</div>
        <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-accent to-[#1a8f6e] transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      <div className="mt-[22px] grid grid-cols-3 gap-x-[18px] gap-y-[22px] px-6">
        {APPS.map((app) => {
          const unreadByApp: Partial<Record<AppId, number>> = {
            messages: unreadMessages,
            gallery: unreadGallery,
            calls: unreadCalls
          };
          const count = unreadByApp[app.id] ?? 0;
          const badge = count > 0 ? count : undefined;
          return (
            <button key={app.id} className="flex flex-col items-center gap-1.5" onClick={() => onOpenApp(app.id)}>
              <div
                className={`relative flex h-[58px] w-[58px] items-center justify-center rounded-2xl bg-gradient-to-br text-2xl shadow-lg ${app.gradient}`}
              >
                {app.icon}
                {badge !== undefined && (
                  <span className="absolute -right-1 -top-1 flex h-4 min-w-[16px] items-center justify-center rounded-lg bg-warn px-1 text-[10px] font-bold text-[#1c0a02]">
                    {badge}
                  </span>
                )}
              </div>
              <div className="text-[11px] text-[#dfe4ea]">{app.label}</div>
            </button>
          );
        })}
      </div>

      <div className="absolute bottom-2.5 left-1/2 h-1 w-[120px] -translate-x-1/2 rounded-full bg-white/30" />
    </div>
  );
}
