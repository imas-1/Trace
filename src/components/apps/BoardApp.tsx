import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { BoardItem, BoardLink, BoardPosition, CaseEnding } from '@/types';
import type { SoundKit } from '@/hooks/useSound';

interface Props {
  items: BoardItem[];
  endings: CaseEnding[];
  links: BoardLink[];
  positions: Record<string, BoardPosition>;
  onLinksChange: (links: BoardLink[]) => void;
  onPositionsChange: (positions: Record<string, BoardPosition>) => void;
  sound: SoundKit;
}

export function BoardApp({ items, endings, links, positions, onLinksChange, onPositionsChange, sound }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [ending, setEnding] = useState<CaseEnding | null>(null);
  const dragState = useRef<{ id: string; startX: number; startY: number; origin: BoardPosition; moved: boolean } | null>(null);

  function posOf(id: string, fallback: { x: number; y: number }): BoardPosition {
    return positions[id] ?? { x: fallback.x, y: fallback.y };
  }

  function handlePointerDown(e: React.PointerEvent, item: BoardItem) {
    (e.target as Element).setPointerCapture(e.pointerId);
    dragState.current = { id: item.id, startX: e.clientX, startY: e.clientY, origin: posOf(item.id, item), moved: false };
  }
  function handlePointerMove(e: React.PointerEvent) {
    const d = dragState.current;
    if (!d) return;
    const dx = e.clientX - d.startX;
    const dy = e.clientY - d.startY;
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) d.moved = true;
    onPositionsChange({ ...positions, [d.id]: { x: d.origin.x + dx, y: d.origin.y + dy } });
  }
  function handlePointerUp(item: BoardItem) {
    const d = dragState.current;
    dragState.current = null;
    if (d && !d.moved) selectPin(item.id);
  }

  function selectPin(id: string) {
    if (selected === null) {
      setSelected(id);
      sound.tap();
    } else if (selected === id) {
      setSelected(null);
    } else {
      onLinksChange([...links, { a: selected, b: id }]);
      setSelected(null);
      sound.clue();
    }
  }

  function evaluate() {
    const result = endings.find((e) => e.check(links)) ?? endings[endings.length - 1];
    if (result) {
      setEnding(result);
      sound.ending();
    }
  }

  function lineFor(link: BoardLink, idx: number) {
    const a = items.find((i) => i.id === link.a);
    const b = items.find((i) => i.id === link.b);
    if (!a || !b) return null;
    const pa = posOf(a.id, a);
    const pb = posOf(b.id, b);
    // pin card is 118px wide; approximate center offset for a clean line anchor
    const ax = pa.x + 59, ay = pa.y + 24;
    const bx = pb.x + 59, by = pb.y + 24;
    return <line key={idx} x1={ax} y1={ay} x2={bx} y2={by} stroke="#e8763e" strokeWidth={1.6} opacity={0.8} />;
  }

  return (
    <div className="-mx-4 -mb-[30px] -mt-3.5 flex h-[calc(100%+56px)] flex-col">
      <div className="px-4 pb-2.5 pt-3.5 text-[11.5px] leading-snug text-sub">
        Trage pionezele. Atinge două, pe rând, ca să le <b className="text-text">conectezi</b>. Ține apăsat + trage pentru mutare.
      </div>
      <div className="relative flex-1 overflow-auto">
        <div className="relative h-[520px] w-[640px]">
          <svg className="pointer-events-none absolute inset-0 h-full w-full">
            {links.map((l, i) => lineFor(l, i))}
          </svg>
          {items.map((item) => {
            const p = posOf(item.id, item);
            return (
              <div
                key={item.id}
                className={`absolute w-[118px] cursor-grab touch-none select-none rounded-[10px] border bg-[#171a22] p-2 shadow-lg ${
                  selected === item.id ? 'border-accent shadow-[0_0_0_2px_rgba(62,232,181,0.35)]' : 'border-line'
                }`}
                style={{ left: p.x, top: p.y }}
                onPointerDown={(e) => handlePointerDown(e, item)}
                onPointerMove={handlePointerMove}
                onPointerUp={() => handlePointerUp(item)}
              >
                <div className="text-[10px] uppercase tracking-wide text-sub">{item.type}</div>
                <div className="mt-0.5 text-[11.5px] leading-snug">{item.text}</div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="px-4 pb-2">
        <button
          className="w-full rounded-xl border border-accentDim bg-accent/10 py-2.5 text-[13px] font-semibold text-accent"
          onClick={evaluate}
        >
          Trage concluzia
        </button>
      </div>

      <AnimatePresence>
        {ending && (
          <motion.div
            className="absolute inset-0 z-[90] flex items-center justify-center bg-black/90 p-7 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="text-center">
              <div className="text-[10px] uppercase tracking-[0.18em] text-warn">{ending.eyebrow}</div>
              <h2 className="my-2 font-serif text-[22px]">{ending.title}</h2>
              <p className="text-[13px] leading-relaxed text-sub">{ending.body}</p>
              <button
                className="mt-5 rounded-xl border border-line px-4.5 py-2.5 text-[12.5px]"
                onClick={() => setEnding(null)}
              >
                Înapoi la board
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
