# Trace — Semnal Pierdut

Joc de detectiv pe smartphone simulat. Stack: **React + TypeScript (strict) + Vite + Tailwind CSS + Framer Motion + Firebase (Realtime Database, Auth anonimă, Storage) + PWA cu suport offline**, mobile-first.

## Rulare locală

Necesită Node.js 18+.

```bash
npm install
npm run dev
```

Deschide `http://localhost:5173`.

## Firebase

Cheile din `.env.local` sunt deja completate cu proiectul `trace-70e9d`. **Nu sunt urcate pe git** (vezi `.gitignore`).

Autentificarea e **anonimă** — fiecare vizitator primește automat un `uid` de la Firebase Auth (fără email/parolă), folosit ca să-i salvăm progresul. Trebuie doar activată în Firebase Console:

**Authentication → Sign-in method → Anonymous → Enable**

Salvarea progresului (deblocare + conexiuni pe board) se scrie în **Realtime Database**, la calea `saves/{uid}/cases/semnal-pierdut`. Pune aceste reguli în **Realtime Database → Rules**, altfel scrierile vor fi respinse:

```json
{
  "rules": {
    "saves": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid"
      }
    }
  }
}
```

Dacă Firebase nu e configurat sau nu ai rețea, jocul funcționează oricum integral offline — salvarea cade automat pe `localStorage`.

## Build & deploy

```bash
npm run build
```

Rezultatul e în `dist/`. Poate fi trimis direct pe GitHub (repo `trace`) și deploy-uit pe Vercel — Vercel va rula `npm install && npm run build` automat.

**Important**: variabilele `VITE_FIREBASE_*` din `.env.local` trebuie adăugate manual și în setările proiectului Vercel (Settings → Environment Variables), altfel build-ul de producție pornește fără Firebase configurat.

## Structură (motor reutilizabil pentru cazuri viitoare)

- `src/types.ts` — schema completă de date a unui caz (tipizată strict)
- `src/data/case.ts` — conținutul cazului „Semnal Pierdut”; un caz nou = un fișier nou aici, fără să atingi restul codului
- `src/components/` — motorul de UI (lock screen, home, cele 6 aplicații, board-ul de conexiuni)
- `src/hooks/useGameSave.ts` — salvare locală + sincronizare Firebase
- `src/hooks/useSound.ts` — sunet/haptics generate în browser, fără fișiere audio

## Ce nu e inclus (scop redus intenționat)

Promptul original cerea un caz cu 500+ mesaje, 150 poze, 40 video etc. — asta e muncă de luni pentru o echipă. Cazul demo are conținut real și complet jucabil (5 personaje, poze, indicii, 3 finaluri + fallback), dar la scară redusă. Structura de date suportă extinderea oricând.
