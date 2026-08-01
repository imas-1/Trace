import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  visible: boolean;
  onClose: () => void;
}

const STEPS: string[] = [
  'Deblochează telefonul introducând codul de acces. Indiciul e chiar pe lock screen — citește-l cu atenție.',
  'Explorează toate aplicațiile: Mesaje, Galerie, Notițe, Hărți, Apeluri. Fiecare ascunde detalii despre ce s-a întâmplat.',
  'Mesajele sau apelurile marcate cu ⚑ sunt indicii importante — merită reținute.',
  'În Board, atinge două indicii pe rând ca să le conectezi printr-o linie. Le poți muta oriunde pe ecran. Ține apăsat ca să ștergi una.',
  'Când crezi că ai destule conexiuni, apasă „Trage concluzia”. Conexiuni diferite duc la finaluri diferite — dacă greșești, poți încerca din nou.'
];

export function TutorialModal({ visible, onClose }: Props) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[210] flex items-center justify-center bg-black/80 p-6 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="max-h-[82vh] w-full max-w-[320px] overflow-y-auto rounded-[20px] border border-line bg-panel p-5"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
          >
            <h3 className="font-serif text-[19px] mb-1">Cum se joacă</h3>
            {STEPS.map((step, i) => (
              <div className="mt-4 flex items-start gap-2.5" key={i}>
                <div className="flex h-[22px] w-[22px] flex-none items-center justify-center rounded-full bg-accentDim text-[11px] font-bold text-accent">
                  {i + 1}
                </div>
                <p className="text-[12.5px] leading-relaxed text-[#dfe4ea]">{step}</p>
              </div>
            ))}
            <button
              className="mt-5 w-full rounded-xl bg-accent py-2.5 text-[13.5px] font-semibold text-[#04140e]"
              onClick={onClose}
            >
              Am înțeles
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
