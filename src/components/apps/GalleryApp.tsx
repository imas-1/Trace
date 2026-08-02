import { useRef, useState } from 'react';
import type { GalleryItem } from '@/types';

interface Props {
  gallery: GalleryItem[];
  readIds: string[];
  onOpenItem: (id: string) => void;
}

export function GalleryApp({ gallery, readIds, onOpenItem }: Props) {
  const [active, setActive] = useState<GalleryItem | null>(null);
  const [zoomed, setZoomed] = useState(false);
  const lastTap = useRef(0);

  function toggleZoom() {
    setZoomed((z) => !z);
  }
  function handleTouchEnd() {
    const now = Date.now();
    if (now - lastTap.current < 300) toggleZoom();
    lastTap.current = now;
  }

  if (active) {
    return (
      <div className="pb-1.5 pt-1.5">
        <button
          className="mb-2.5 flex items-center gap-1 text-sm text-accent"
          onClick={() => { setActive(null); setZoomed(false); }}
        >
          ‹ Galerie
        </button>
        <div className="mb-3 overflow-hidden rounded-2xl">
          <img
            src={active.img}
            alt={active.label}
            className="aspect-[4/5] w-full cursor-zoom-in object-cover transition-transform duration-300"
            style={{ transform: zoomed ? 'scale(2.2)' : 'scale(1)' }}
            onDoubleClick={toggleZoom}
            onTouchEnd={handleTouchEnd}
          />
        </div>
        <div className="-mt-1.5 mb-3 text-center text-[10.5px] text-sub">Dublu-atinge poza pentru zoom</div>
        {Object.entries(active.meta).map(([k, v]) => (
          <div key={k} className="flex justify-between border-b border-line py-1.5 text-xs text-sub">
            <span>{k}</span>
            <b className="font-medium text-text">{v}</b>
          </div>
        ))}
        <div className="pt-3.5 text-[12.5px] leading-snug text-sub">{active.note}</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-1.5">
      {gallery.map((g) => {
        const unread = !readIds.includes(g.id);
        return (
          <div
            key={g.id}
            className="relative aspect-square cursor-pointer overflow-hidden rounded-lg"
            onClick={() => { setActive(g); onOpenItem(g.id); }}
          >
            <img src={g.img} alt="" className="h-full w-full object-cover" />
            {unread && <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full border border-black/40 bg-accent" />}
            <div
              className="absolute inset-x-0 bottom-0 px-1.5 pb-1 pt-1 text-[9px] leading-tight text-white"
              style={{ background: 'linear-gradient(to top, rgba(0,0,0,.75), transparent)' }}
            >
              {g.label}
            </div>
          </div>
        );
      })}
    </div>
  );
}
