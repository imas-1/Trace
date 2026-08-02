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
import { SettingsApp } from '@/components/apps/SettingsApp';

interface Props {
  caseData: CaseData;
  save: GameSaveState;
  onSaveChange: (next: GameSaveState) => void;
  onReset: () => void;
  onHelp: () => void;
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

export function PhoneShell({ caseData, save, onSaveChange, onReset, onHelp, sound }: Props) {
  const [openApp, setOpenApp] = useState<AppId | null>(null);
  const clock = useClock();

  function handleUnlock() {
    sound.unlock();
    onSaveChange({ ...save, unlocked: true, updatedAt: Date.now() });
  }
  function handleOpenApp(id: AppId) {
    sound.open();
    setOpenApp(id);
    if (id === 'calls' && !save.callsSeen) {
      onSaveChange({ ...save, callsSeen: true, updatedAt: Date.now() });
    }
  }
  function handleCloseApp() {
    sound.close();
    setOpenApp(null);
  }
  function handleOpenThread(id: string) {
    if (save.readThreadIds.includes(id)) return;
    onSaveChange({ ...save, readThreadIds: [...save.readThreadIds, id], updatedAt: Date.now() });
  }
  function handleOpenGalleryItem(id: string) {
    if (save.readGalleryIds.includes(id)) return;
    onSaveChange({ ...save, readGalleryIds: [...save.readGalleryIds, id], updatedAt: Date.now() });
  }

  const unreadMessages = caseData.threads.filter((t) => !save.readThreadIds.includes(t.id)).length;
  const unreadGallery = caseData.gallery.filter((g) => !save.readGalleryIds.includes(g.id)).length;
  const unreadCalls = !save.callsSeen ? caseData.calls.filter((c) => c.clue).length : 0;

  const appTitles: Record<AppId, string> = {
    messages: 'Mesaje',
    gallery: 'Galerie',
    notes: 'Notițe',
    board: 'Board detectiv',
    maps: 'Hărți — istoric locații',
    calls: 'Apeluri recente',
    settings: 'Setări'
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

      {save.unlocked && (
        <div
          className="transition-all duration-300"
          style={{
            transform: openApp ? 'scale(0.96)' : 'scale(1)',
            opacity: openApp ? 0.5 : 1
          }}
        >
          <HomeScreen
            caseData={caseData}
            onOpenApp={handleOpenApp}
            linksCount={save.links.length}
            unreadMessages={unreadMessages}
            unreadGallery={unreadGallery}
            unreadCalls={unreadCalls}
            onHelp={onHelp}
          />
        </div>
      )}

      <AppScreen title={appTitles.messages} open={openApp === 'messages'} onBack={handleCloseApp}>
        <MessagesApp threads={caseData.threads} sound={sound} readThreadIds={save.readThreadIds} onOpenThread={handleOpenThread} />
      </AppScreen>
      <AppScreen title={appTitles.gallery} open={openApp === 'gallery'} onBack={handleCloseApp}>
        <GalleryApp gallery={caseData.gallery} readIds={save.readGalleryIds} onOpenItem={handleOpenGalleryItem} />
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
      <AppScreen title={appTitles.settings} open={openApp === 'settings'} onBack={handleCloseApp}>
        <SettingsApp
          soundEnabled={save.soundEnabled}
          onToggleSound={() => onSaveChange({ ...save, soundEnabled: !save.soundEnabled, updatedAt: Date.now() })}
          onReset={onReset}
        />
      </AppScreen>
    </div>
  );
}
