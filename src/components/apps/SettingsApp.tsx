interface Props {
  soundEnabled: boolean;
  onToggleSound: () => void;
  onReset: () => void;
}

export function SettingsApp({ soundEnabled, onToggleSound, onReset }: Props) {
  return (
    <div>
      <div className="flex items-center justify-between border-b border-line py-3">
        <div>
          <div className="text-[13.5px] font-semibold">Sunet și vibrații</div>
          <div className="mt-0.5 text-[12px] text-sub">Efecte la deblocare, indicii, finaluri</div>
        </div>
        <button
          className={`h-7 w-12 flex-none rounded-full transition-colors ${soundEnabled ? 'bg-accent' : 'bg-white/15'}`}
          onClick={onToggleSound}
        >
          <div
            className="h-5 w-5 rounded-full bg-white shadow transition-transform"
            style={{ transform: soundEnabled ? 'translateX(24px)' : 'translateX(4px)' }}
          />
        </button>
      </div>

      <div className="border-b border-line py-3">
        <div className="text-[13.5px] font-semibold">Progres caz</div>
        <div className="mt-0.5 mb-2.5 text-[12px] text-sub">
          Deblocare + conexiunile de pe board sunt salvate automat, local și în cloud.
        </div>
        <button
          className="w-full rounded-xl border border-warn/40 bg-warn/10 py-2.5 text-[13px] font-semibold text-warn"
          onClick={() => {
            if (confirm('Sigur vrei să resetezi tot progresul acestui caz?')) onReset();
          }}
        >
          Resetează progresul
        </button>
      </div>

      <div className="pt-3 text-[11px] leading-relaxed text-sub">
        Trace — Semnal Pierdut · caz demo
        <br />
        React · TypeScript · Vite · Tailwind · Firebase
      </div>
    </div>
  );
}
