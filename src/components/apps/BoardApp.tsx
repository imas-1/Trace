import { useEffect, useRef, useState } from 'react';
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

const MAX_LINKS_PER_PIN = 3;
const MAX_HISTORY = 10;

export function BoardApp({ items, endings, links, positions, onLinksChange, onPositionsChange, sound }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [ending, setEnding] = useState<CaseEnding | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const historyRef = useRef<BoardLink[][]>([]);
  const [historyLen, setHistoryLen] = useState(0);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [dragPositions, setDragPositions] = useState<Record<string, BoardPosition>>({});
  const dragState = useRef<{ id: string; startX: number; startY: number; origin: BoardPosition; moved: boolean } | null>(null);

  function posOf(id: string, fallback: { x: number; y: number }): BoardPosition {
    return dragPositions[id] ?? positions[id] ?? { x: fallback.x, y: fallback.y };
  }

  function showToast(msg: string) {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 1600);
  }

  function pushHistory() {
    historyRef.current = [...historyRef.current.slice(-(MAX_HISTORY - 1)), links];
    setHistoryLen(historyRef.current.length);
  }
  function undo() {
    const prev = historyRef.current.pop();
    setHistoryLen(historyRef.current.length);
    if (prev === undefined) return;
    onLinksChange(prev);
    sound.close();
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
    setDragPositions((prev) => ({ ...prev, [d.id]: { x: d.origin.x + dx, y: d.origin.y + dy } }));
  }
  function handlePointerUp(item: BoardItem) {
    const d = dragState.current;
    dragState.current = null;
    if (d && d.moved) {
      const finalPos = dragPositions[d.id];
      if (finalPos) {
        onPositionsChange({ ...positions, [d.id]: finalPos });
        setDragPositions((prev) => {
          const next = { ...prev };
          delete next[d.id];
          return next;
        });
      }
    } else if (d) {
      selectPin(item.id);
    }
  }

  useEffect(() => {
    if (!dragState.current && Object.keys(positions).length === 0 && Object.keys(dragPositions).length > 0) {
      setDragPositions({});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [positions]);

  function linkCountFor(id: string): number {
    return links.filter((l) => l.a === id || l.b === id).length;
  }

  function removeLink(link: BoardLink) {
    pushHistory();
    onLinksChange(links.filter((l) => l !== link));
    sound.close();
  }

  function selectPin(id: string) {
    if (selected === null) {
      setSelected(id);
      sound.tap();
    } else if (selected === id) {
      setSelected(null);
    } else {
      if (linkCountFor(selected) >= MAX_LINKS_PER_PIN || linkCountFor(id) >= MAX_LINKS_PER_PIN) {
        showToast(`Maxim ${MAX_LINKS_PER_PIN} conexiuni per element`);
        sound.close();
        setSelected(null);
        return;
      }
      const newLink = { a: selected, b: id };
      pushHistory();
      onLinksChange([...links, newLink]);
      setSelected(null);
      sound.clue();
      if (navigator.vibrate) {
        navigator.vibrate(isKeyLink(newLink) ? [12, 30, 12, 30, 24] : [15, 20, 15]);
      }
    }
  }

  function evaluate() {
    const result = endings.find((e) => e.check(links)) ?? endings[endings.length - 1];
    if (result) {
      setEnding(result);
      sound.ending();
    }
  }

  function isKeyLink(link: BoardLink): boolean {
    return endings.some((e) =>
      e.requiredLinks?.some(
        ([a, b]) => (a === link.a && b === link.b) || (a === link.b && b === link.a)
      )
    );
  }

  function lineFor(link: BoardLink, idx: number) {
    const a = items.find((i) => i.id === link.a);
    const b = items.find((i) => i.id === link.b);
    if (!a || !b) return null;
    const pa = posOf(a.id, a);
    const pb = posOf(b.id, b);
    const ax = pa.x + 59, ay = pa.y + 24;
    const bx = pb.x + 59, by = pb.y + 24;
    const key = isKeyLink(link);
    return (
      <g key={idx} className="pointer-events-auto cursor-pointer" onClick={() => removeLink(link)}>
        <line x1={ax} y1={ay} x2={bx} y2={by} stroke="transparent" strokeWidth={16} />
        <line
          x1={ax}
          y1={ay}
          x2={bx}
          y2={by}
          stroke={key ? '#3ee8b5' : '#e8763e'}
          strokeWidth={key ? 2 : 1.6}
          opacity={key ? 0.95 : 0.7}
        />
      </g>
    );
  }

  const isRealEnding = ending ? ending.id !== 'ending_wrong' : false;

  return (
    <div className="-mx-4 -mb-[30px] -mt-3.5 flex h-[calc(100%+56px)] flex-col">
      <div className="flex items-start justify-between gap-2 px-4 pb-2.5 pt-3.5 text-[11.5px] leading-snug text-sub">
        <div>
          Trage pionezele. Atinge două, pe rând, ca să le <b className="text-text">conectezi</b> (max {MAX_LINKS_PER_PIN}/element). Atinge un fir ca să-l <b className="text-text">ștergi</b>.
        </div>
        <button
          className="flex-none rounded-lg border border-line px-2 py-1 text-[10.5px] text-sub disabled:opacity-30"
          onClick={undo}
          disabled={historyLen === 0}
        >
          ↺ Anulează
        </button>
      </div>
      <div className="relative flex-1 overflow-auto">
        <div className="relative h-[520px] w-[640px]">
          <svg className="absolute inset-0 h-full w-full" style={{ pointerEvents: 'none' }}>
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
        {toast && (
          <motion.div
            className="pointer-events-none absolute left-1/2 top-3 z-[95] -translate-x-1/2 rounded-full bg-black/85 px-3.5 py-1.5 text-[11.5px] text-text"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {ending && (
          <motion.div
            className="absolute inset-0 z-[90] flex items-center justify-center bg-black/90 p-7 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="text-center"
              initial={{ scale: 0.92 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            >
              <div className={`text-[10px] uppercase tracking-[0.18em] ${isRealEnding ? 'text-accent' : 'text-warn'}`}>
                {isRealEnding ? '✓ ' : ''}{ending.eyebrow}
              </div>
              <h2 className="my-2 font-serif text-[22px]">{ending.title}</h2>
              <p className="text-[13px] leading-relaxed text-sub">{ending.body}</p>
              <button
                className="mt-5 rounded-xl border border-line px-4.5 py-2.5 text-[12.5px]"
                onClick={() => setEnding(null)}
              >
                Înapoi la board
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
