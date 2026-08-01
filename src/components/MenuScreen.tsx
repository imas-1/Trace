import { motion, AnimatePresence } from 'framer-motion';
import type { CaseData } from '@/types';

interface Props {
  caseData: CaseData;
  visible: boolean;
  onStart: () => void;
  onTutorial: () => void;
}

export function MenuScreen({ caseData, visible, onStart, onTutorial }: Props) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center gap-2 p-8 text-center"
          style={{
            background:
              'radial-gradient(circle at 30% 20%, rgba(62,232,181,.08), transparent 45%), linear-gradient(165deg,#12141b,#05060a 75%)'
          }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.03 }}
          transition={{ duration: 0.4 }}
        >
          <div className="text-[10.5px] uppercase tracking-[0.2em] text-warn">{caseData.intro.eyebrow}</div>
          <h1 className="font-serif text-[34px] leading-tight mt-2 mb-1.5">{caseData.intro.title}</h1>
          <p className="max-w-[280px] text-[13px] leading-relaxed text-sub mb-6">{caseData.intro.subtitle}</p>
          <button
            className="w-60 rounded-2xl bg-accent py-3.5 text-sm font-semibold text-[#04140e] mb-2.5"
            onClick={onStart}
          >
            Începe investigația
          </button>
          <button
            className="w-60 rounded-2xl border border-line bg-white/5 py-3.5 text-sm font-semibold text-text"
            onClick={onTutorial}
          >
            Cum se joacă
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
