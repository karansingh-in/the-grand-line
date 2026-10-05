# The Grand Line — Technical Treasure Hunt

A mobile-first companion web app for a physical college treasure hunt.
Teams sail through two chapters on one continuous clock — ten trials of
craft (name the tool from its real mark), then a walking chart: seven
shores across campus, every crew dealt a different route and a single
random verse per shore.

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

## Round 2 — hosts, read this

Seven stops live in `src/lib/game.ts` (`HUNT_STOPS`). Each has a title, an
`area` (the real place), three `riddles` (cryptic first, near-explicit
last — each crew is dealt one at random), and a `nudge` (costs the team 1 of its 2 chart notes). Replace the
placeholder areas/riddles with your venue before the event. Every crew is
dealt all seven stops in a shuffled order, so routes differ per team.

No QR codes, no scanning — the round is entirely on foot. Old
`/fragment`, `/decoy`, and `/final` links now show a retired notice and
point back at the game.

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
5. Host screen: `https://<app>.vercel.app/leaderboard`
6. Smoke test: two phones → same crew code → progress syncs; finishing
   crew appears on `/leaderboard`.

## Scripts

- `npm run dev` — local dev server
- `npm run build` — production build
- `npm run preview` — preview the production build
- `npm test` — test suite
