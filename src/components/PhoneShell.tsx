import { useEffect, useState } from 'react';
import type { AppId, CaseData, GameSaveState } from '@/types';
import type { SoundKit } from '@/hooks/useSound';
import { LockScreen } from '@/components/LockScreen';
import { HomeScreen } from '@/components/HomeScreen';
import { AppScreen } from '@/components/AppScreen';
import { MessagesApp } from '@/components/apps/MessagesApp';
import { GalleryApp } from '@/components/apps/GalleryApp';
import { NotesApp } from '@/components/apps/NotesApp';
import { BoardApp } from '@/components/apps/BoardApp';
import { MapsApp } from '@/components/apps/MapsApp';
import { CallsApp } from '@/components/apps/CallsApp';

interface Props {
  caseData: CaseData;
  save: GameSaveState;
  onSaveChange: (next: GameSaveState) => void;
  sound: SoundKit;
}

function useClock(): string {
  const [label, setLabel] = useState(() => new Date().toTimeString().slice(0, 5));
  useEffect(() => {
    const id = setInterval(() => setLabel(new Date().toTimeString().slice(0, 5)), 30_000);
    return () => clearInterval(id);
  }, []);
  return label;
}

export function PhoneShell({ caseData, save, onSaveChange, sound }: Props) {
  const [openApp, setOpenApp] = useState<AppId | null>(null);
  const clock = useClock();

  function handleUnlock() {
    sound.unlock();
    onSaveChange({ ...save, unlocked: true, updatedAt: Date.now() });
  }
  function handleOpenApp(id: AppId) {
    sound.open();
    setOpenApp(id);
  }
  function handleCloseApp() {
    sound.close();
    setOpenApp(null);
  }

  const appTitles: Record<AppId, string> = {
    messages: 'Mesaje',
    gallery: 'Galerie',
    notes: 'Notițe',
    board: 'Board detectiv',
    maps: 'Hărți — istoric locații',
    calls: 'Apeluri recente'
  };

  return (
    <div
      className="phone-root relative h-[700px] w-[340px] overflow-hidden rounded-phone border border-white/10 shadow-2xl"
      style={{ background: 'linear-gradient(155deg,#14171f,#090a0e)' }}
    >
      <div className="absolute left-1/2 top-0 z-50 h-[22px] w-[120px] -translate-x-1/2 rounded-b-2xl bg-ink" />
      <div className="absolute inset-x-0 top-0 z-40 flex h-[46px] items-center justify-between px-6 text-xs text-white">
        <span>{clock}</span>
        <span className="flex items-center gap-1 opacity-85">•••  ᛜ  ▮▮▮</span>
      </div>

      <LockScreen
        passcode={caseData.passcode}
        unlocked={save.unlocked}
        onUnlock={handleUnlock}
        sound={sound}
        clockLabel={clock}
      />

      {save.unlocked && <HomeScreen caseData={caseData} onOpenApp={handleOpenApp} />}

      <AppScreen title={appTitles.messages} open={openApp === 'messages'} onBack={handleCloseApp}>
        <MessagesApp threads={caseData.threads} sound={sound} />
      </AppScreen>
      <AppScreen title={appTitles.gallery} open={openApp === 'gallery'} onBack={handleCloseApp}>
        <GalleryApp gallery={caseData.gallery} />
      </AppScreen>
      <AppScreen title={appTitles.notes} open={openApp === 'notes'} onBack={handleCloseApp}>
        <NotesApp notes={caseData.notes} />
      </AppScreen>
      <AppScreen title={appTitles.board} open={openApp === 'board'} onBack={handleCloseApp} bodyClassName="!px-0 !pt-0 !pb-0">
        <BoardApp
          items={caseData.board}
          endings={caseData.endings}
          links={save.links}
          positions={save.positions}
          onLinksChange={(links) => onSaveChange({ ...save, links, updatedAt: Date.now() })}
          onPositionsChange={(positions) => onSaveChange({ ...save, positions, updatedAt: Date.now() })}
          sound={sound}
        />
      </AppScreen>
      <AppScreen title={appTitles.maps} open={openApp === 'maps'} onBack={handleCloseApp} bodyClassName="!px-0 !pt-0 !pb-0">
        <MapsApp locations={caseData.locations} />
      </AppScreen>
      <AppScreen title={appTitles.calls} open={openApp === 'calls'} onBack={handleCloseApp}>
        <CallsApp calls={caseData.calls} />
      </AppScreen>
    </div>
  );
}
