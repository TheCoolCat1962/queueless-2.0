# Queueless 2.0

Community-powered guide to real business wait times and local activity in the **New Orleans metro**.

## Current phase: 1 — frontend foundation
- Explore screen (search, category chips, map placeholder, recent reports, discover places), Favorites, Report, Profile, Settings.
- Theme (System/Light/Dark) and accent (Blue/Emerald/Orange/Purple/Pink/Teal), applied instantly and saved in `localStorage`.
- Wait-status colors are fixed tokens, independent of the accent.
- All data goes through `src/lib/data/places-service.ts` (`PlacesDataService`). The Phase 1 implementation returns `not_connected` — **no fake businesses, reports, pins or activity**.
- Rules in `src/lib/wait.ts`: no report = "unknown" (never 0 min); reports expire after 90 minutes.

## Run / test
```bash
bun install
bun run dev
bunx vitest run
```

## TODO
- **Google Places**: implement `PlacesDataService.searchBusinesses` server-side (key never in client), map results to `Business`; mount a real map in `MapPanel`.
- **Metro boundary validation**: replace the bounding box in `src/lib/region.ts` with a metro polygon; reject Northshore (e.g. Covington) results.
- **Supabase / Auth / RLS**: tables for wait reports & favorites, RLS per user, optional sign-in.
- **Reporting**: submission flow, 90-minute expiry enforced server-side, abuse protection.
- **GitHub / Codex handoff**: connect GitHub, keep `AGENTS.md` rules current.
