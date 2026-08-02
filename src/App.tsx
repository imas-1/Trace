import { useRef, useState } from 'react';
import { semnalPierdut } from '@/data/case';
import { useGameSave } from '@/hooks/useGameSave';
import { useSound } from '@/hooks/useSound';
import { useFitScreen } from '@/hooks/useFitScreen';
import { MenuScreen } from '@/components/MenuScreen';
import { TutorialModal } from '@/components/TutorialModal';
import { PhoneShell } from '@/components/PhoneShell';

export default function App() {
  const { save, persist, loaded, cloudAvailable } = useGameSave();
  const sound = useSound(save.soundEnabled ?? true);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const scale = useFitScreen(titleRef);

  const [menuVisible, setMenuVisible] = useState(true);
  const [tutorialVisible, setTutorialVisible] = useState(false);
  const [cloudNoticeDismissed, setCloudNoticeDismissed] = useState(false);

  function startCase() {
    setMenuVisible(false);
  }
  function openTutorial() {
    setTutorialVisible(true);
  }
  function closeTutorial() {
    setTutorialVisible(false);
    if (!save.tutorialSeen) persist({ ...save, tutorialSeen: true, updatedAt: Date.now() });
  }
  function resetProgress() {
    persist({
      unlocked: false,
      links: [],
      positions: {},
      tutorialSeen: true,
      soundEnabled: save.soundEnabled,
      readThreadIds: [],
      readGalleryIds: [],
      callsSeen: false,
      updatedAt: Date.now()
    });
  }

  const autoShown = useRef(false);
  if (loaded && !save.tutorialSeen && !autoShown.current) {
    autoShown.current = true;
    if (!tutorialVisible) setTutorialVisible(true);
  }

  const showCloudNotice = loaded && !cloudAvailable && !cloudNoticeDismissed && !menuVisible;

  return (
    <div className="fixed inset-0 flex items-center justify-center overflow-hidden bg-[#05060a] p-4">
      <MenuScreen caseData={semnalPierdut} visible={menuVisible} onStart={startCase} onTutorial={openTutorial} />
      <TutorialModal visible={tutorialVisible} onClose={closeTutorial} />

      <div className="flex h-full flex-col items-center justify-center gap-2.5">
        <h1 ref={titleRef} className="flex-none font-serif text-[15px] uppercase tracking-[0.14em] text-sub">
          {semnalPierdut.title} · Caz demo
        </h1>
        {showCloudNotice && (
          <div className="flex w-[300px] items-center justify-between gap-2 rounded-xl border border-line bg-white/[0.04] px-3 py-2 text-[11px] leading-snug text-sub">
            <span>Mod local — progresul se salvează doar pe acest dispozitiv.</span>
            <button className="flex-none text-sub/70" onClick={() => setCloudNoticeDismissed(true)} aria-label="Închide">
              ✕
            </button>
          </div>
        )}
        <div style={{ width: 340 * scale, height: 700 * scale }}>
          <div style={{ transform: `scale(${scale})`, transformOrigin: 'top left', width: 340, height: 700 }}>
            <PhoneShell
              caseData={semnalPierdut}
              save={save}
              onSaveChange={persist}
              onReset={resetProgress}
              onHelp={openTutorial}
              sound={sound}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
