import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface Props {
  title: string;
  open: boolean;
  onBack: () => void;
  children: ReactNode;
  bodyClassName?: string;
}

export function AppScreen({ title, open, onBack, children, bodyClassName }: Props) {
  return (
    <motion.div
      className="absolute inset-0 z-[60] flex flex-col bg-[#0c0e13] pt-[46px]"
      animate={{ y: open ? '0%' : '100%' }}
      transition={{ duration: 0.38, ease: [0.2, 0.8, 0.2, 1] }}
      style={{ pointerEvents: open ? 'auto' : 'none' }}
    >
      <div className="flex items-center gap-2.5 border-b border-line px-[18px] pb-3.5 pt-2.5">
        <button className="flex items-center gap-1 text-sm text-accent" onClick={onBack}>
          ‹ Acasă
        </button>
        <div className="mr-[34px] flex-1 text-center text-[15px] font-semibold">{title}</div>
      </div>
      <div className={`flex-1 overflow-y-auto px-4 pb-[30px] pt-3.5 ${bodyClassName ?? ''}`}>{children}</div>
    </motion.div>
  );
}
