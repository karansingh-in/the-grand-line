# Hack the Hunt

Organized by SHAIDS.

A mobile-first companion web app for a physical college treasure hunt, skinned head-to-toe in One Piece.
Teams sail through two chapters on one continuous clock — ten trials of
craft (name the tool from its real mark), then a walking chart: one shore
on foot with a single random verse on a single island, then straight to the One Piece.

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
multi-device team sync. Without them the game
runs in local-only mode.

## Round 2 — hosts, read this

Three fixed verses live in `src/lib/game.ts` (`HUNT_STOPS`): Throne,
Registration desk, Lootbox. The 1st crew to register is dealt the 1st
verse, the 2nd crew the 2nd, the 3rd the 3rd, then it wraps. No hints,
no leaderboard — one verse on foot, then straight to the final.
Empty the `teams` table before the event so the rotation starts at zero.

## Final — hosts, read this

The final question is announced offline (on stage), so the app shows
only an answer box. Every crew expects the SAME answer: `FINAL_QUESTIONS[0]`
in `src/lib/game.ts`. Set its `a` to the answer of whatever you announce.

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
   (creates the `teams` table for team sync).
5. Smoke test: two phones → same crew code → progress syncs.

## Scripts

- `npm run dev` — local dev server
- `npm run build` — production build
- `npm run preview` — preview the production build
- `npm test` — test suite
