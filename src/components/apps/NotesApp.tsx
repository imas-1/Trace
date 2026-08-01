import type { CaseNote } from '@/types';

interface Props {
  notes: CaseNote[];
}

export function NotesApp({ notes }: Props) {
  return (
    <div>
      {notes.map((n, i) => (
        <div key={i} className="border-b border-line px-1 py-3">
          <div className="text-[13.5px] font-semibold">{n.t}</div>
          <div className="mt-0.5 text-[12.5px] leading-snug text-sub">{n.b}</div>
        </div>
      ))}
    </div>
  );
}
