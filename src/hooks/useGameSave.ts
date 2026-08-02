import { useCallback, useEffect, useRef, useState } from 'react';
import { ref, get, set } from 'firebase/database';
import { rtdb, ensureAnonymousUser } from '@/lib/firebase';
import type { GameSaveState } from '@/types';

const LOCAL_KEY = 'trace_save_v1';
const CASE_ID = 'semnal-pierdut';

const emptySave: GameSaveState = {
  unlocked: false,
  links: [],
  positions: {},
  tutorialSeen: false,
  soundEnabled: true,
  readThreadIds: [],
  readGalleryIds: [],
  callsSeen: false,
  updatedAt: 0
};

function backfill(s: GameSaveState): GameSaveState {
  return {
    ...s,
    readThreadIds: s.readThreadIds ?? [],
    readGalleryIds: s.readGalleryIds ?? [],
    callsSeen: s.callsSeen ?? false
  };
}

function readLocal(): GameSaveState | null {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    if (!raw) return null;
    return backfill(JSON.parse(raw) as GameSaveState);
  } catch {
    return null;
  }
}

function writeLocal(state: GameSaveState): void {
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(state));
  } catch {
    // storage unavailable
  }
}

function savePath(uid: string): string {
  return `saves/${uid}/cases/${CASE_ID}`;
}

export function useGameSave() {
  const [save, setSave] = useState<GameSaveState>(() => readLocal() ?? emptySave);
  const [loaded, setLoaded] = useState(false);
  const [cloudAvailable, setCloudAvailable] = useState(false);
  const uidRef = useRef<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function init() {
      const user = await ensureAnonymousUser();
      if (cancelled) return;
      uidRef.current = user?.uid ?? null;
      if (!cancelled) setCloudAvailable(Boolean(rtdb && user));

      if (rtdb && user) {
        try {
          const snap = await get(ref(rtdb, savePath(user.uid)));
          if (!cancelled && snap.exists()) {
            const remote = backfill(snap.val() as GameSaveState);
            const local = readLocal();
            const winner = !local || remote.updatedAt > local.updatedAt ? remote : local;
            setSave(winner);
            writeLocal(winner);
          }
        } catch {
          // offline or rules deny read
        }
      }
      if (!cancelled) setLoaded(true);
    }
    void init();
    return () => {
      cancelled = true;
    };
  }, []);

  const persist = useCallback((next: GameSaveState) => {
    setSave(next);
    writeLocal(next);
    if (rtdb && uidRef.current) {
      void set(ref(rtdb, savePath(uidRef.current)), next).catch(() => {});
    }
  }, []);

  return { save, persist, loaded, cloudAvailable };
}
