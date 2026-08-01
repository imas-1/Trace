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
  updatedAt: 0
};

function readLocal(): GameSaveState | null {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    return raw ? (JSON.parse(raw) as GameSaveState) : null;
  } catch {
    return null;
  }
}

function writeLocal(state: GameSaveState): void {
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(state));
  } catch {
    // storage unavailable — ignore, in-memory state still works this session
  }
}

function savePath(uid: string): string {
  return `saves/${uid}/cases/${CASE_ID}`;
}

/**
 * Loads/saves game progress. Always writes to localStorage immediately
 * (works fully offline, no Firebase needed to play), and additionally
 * syncs to Firebase Realtime Database in the background — keyed by an
 * anonymous auth uid, so progress follows the player across browser
 * restarts on the same device without any signup.
 */
export function useGameSave() {
  const [save, setSave] = useState<GameSaveState>(() => readLocal() ?? emptySave);
  const [loaded, setLoaded] = useState(false);
  const uidRef = useRef<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function init() {
      const user = await ensureAnonymousUser();
      if (cancelled) return;
      uidRef.current = user?.uid ?? null;

      if (rtdb && user) {
        try {
          const snap = await get(ref(rtdb, savePath(user.uid)));
          if (!cancelled && snap.exists()) {
            const remote = snap.val() as GameSaveState;
            const local = readLocal();
            // last-write-wins between local and remote copies
            const winner = !local || remote.updatedAt > local.updatedAt ? remote : local;
            setSave(winner);
            writeLocal(winner);
          }
        } catch {
          // offline or rules deny read — local save still applies
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
      void set(ref(rtdb, savePath(uidRef.current)), next).catch(() => {
        // offline — localStorage already has it; RTDB SDK also queues writes
        // internally and will retry once connectivity returns.
      });
    }
  }, []);

  return { save, persist, loaded };
}
