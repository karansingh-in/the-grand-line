# The Grand Line — Technical Treasure Hunt

A mobile-first companion web app for a physical college treasure hunt.
Teams sail through three rounds — a timed technical quiz, a QR-driven
campus hunt, and a final challenge — racing a single continuous timer.

## Run locally

Requires Node.js and npm.

```sh
npm i
npm run dev
```

For phones on the same WiFi:

```sh
npx vite dev --host
```

Copy `.env.example` to `.env` and fill in the Supabase values to enable
multi-device team sync and the live leaderboard. Without them the game
runs in local-only mode.

## Deploy to Vercel

No `vercel.json` needed — the server preset is pinned to Vercel in
`vite.config.ts`.

1. Push to GitHub (`.env` is git-ignored; never commit real keys).
2. Vercel → New Project → import the repo. Build command `npm run build`.
3. Project Settings → Environment Variables — add:
   - `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`,
     `VITE_SUPABASE_PROJECT_ID`
   - `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_PROJECT_ID`
4. In the Supabase SQL editor, run once:
   `supabase/migrations/20261003000000_create_teams.sql`
   (creates the `teams` table for sync + leaderboard).
5. Deploy. Point the printed physical QR codes at the public URL:
   - Genuine: `https://<app>.vercel.app/fragment?id=1` … `?id=9`
   - Decoy: `https://<app>.vercel.app/decoy`
   - Final map: `https://<app>.vercel.app/final`
   - Host screen: `https://<app>.vercel.app/leaderboard`
6. Smoke test: two phones → same crew code → progress syncs; finishing
   crew appears on `/leaderboard`.

## Scripts

- `npm run dev` — local dev server
- `npm run build` — production build
- `npm run preview` — preview the production build
- `npm test` — test suite
