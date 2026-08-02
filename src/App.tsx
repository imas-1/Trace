import { useRef, useState } from 'react';
import { semnalPierdut } from '@/data/case';
import { useGameSave } from '@/hooks/useGameSave';
import { useSound } from '@/hooks/useSound';
import { useFitScreen } from '@/hooks/useFitScreen';
import { MenuScreen } from '@/components/MenuScreen';
import { TutorialModal } from '@/components/TutorialModal';
import { PhoneShell } from '@/components/PhoneShell';

export default function App() {
  const { save, persist, loaded } = useGameSave();
  const sound = useSound(save.soundEnabled ?? true);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const scale = useFitScreen(titleRef);

  const [menuVisible, setMenuVisible] = useState(true);
  const [tutorialVisible, setTutorialVisible] = useState(false);

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
    persist({ unlocked: false, links: [], positions: {}, tutorialSeen: true, soundEnabled: save.soundEnabled, updatedAt: Date.now() });
  }

  // Auto-show tutorial on first-ever visit, once the save has loaded
  const autoShown = useRef(false);
  if (loaded && !save.tutorialSeen && !autoShown.current) {
    autoShown.current = true;
    if (!tutorialVisible) setTutorialVisible(true);
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center overflow-hidden bg-[#05060a] p-4">
      <MenuScreen caseData={semnalPierdut} visible={menuVisible} onStart={startCase} onTutorial={openTutorial} />
      <TutorialModal visible={tutorialVisible} onClose={closeTutorial} />

      <div className="flex h-full flex-col items-center justify-center gap-2.5">
        <h1 ref={titleRef} className="flex-none font-serif text-[15px] uppercase tracking-[0.14em] text-sub">
          {semnalPierdut.title} · Caz demo
        </h1>
        <div style={{ width: 340 * scale, height: 700 * scale }}>
          <div style={{ transform: `scale(${scale})`, transformOrigin: 'top left', width: 340, height: 700 }}>
            <PhoneShell caseData={semnalPierdut} save={save} onSaveChange={persist} onReset={resetProgress} sound={sound} />
          </div>
        </div>
      </div>
    </div>
  );
}
