# Queueless 2.0

Community-powered guide to real business wait times and local activity in the **New Orleans metro**.

## Current phase: 1 — frontend foundation

- Explore screen (search, category chips, map placeholder, recent reports, discover places), Favorites, Report, Profile, Settings.
- Theme (System/Light/Dark) and accent (Blue/Emerald/Orange/Purple/Pink/Teal), applied instantly and saved in `localStorage`.
- Wait-status colors are fixed tokens, independent of the accent.
- All data goes through `src/lib/data/places-service.ts` (`PlacesDataService`). The Phase 1 implementation returns `not_connected` — **no fake businesses, reports, pins or activity**.
- Rules in `src/lib/wait.ts`: no report = "unknown" (never 0 min); reports expire after 90 minutes.

## Run / test

Use Bun **1.4.4** and Node.js **24.22.1**, matching CI. Node runs the existing tool CLIs; Bun installs dependencies using `bun.lock`.

```bash
bun install --frozen-lockfile
bun run dev
bun run test
bun x --no-install tsc --noEmit
bun run build
```

## Automated pull request checks

[Pull request checks](.github/workflows/checks.yml) runs when a pull request targeting `main` is opened, reopened, or updated, including draft PRs. New pushes cancel older runs for the same PR.

- **Tests, types, and build** installs dependencies with the frozen lockfile and runs the tests, TypeScript checking, and production build. A failure fails the job. After a successful install, TypeScript and the build still run if another check fails.
- **Style baseline (informational)** runs ESLint and Prettier separately on a clean checkout. Their failures remain visible in step logs and the run summary but do not fail the job while the existing baseline is unresolved. Setup or dependency installation failures still fail the job.

To inspect results, open the PR's **Checks** tab or select **Actions → Pull request checks**. Open either job for its logs; the workflow run's summary lists each check's actual result. Use **Re-run failed jobs** for failures or **Re-run all jobs** to repeat informational style checks.

Run the same read-only style checks locally with:

```bash
bun run lint
bun x --no-install prettier --check .
```

The existing ESLint baseline includes 71 formatting errors and 9 React refresh warnings; Prettier also reports existing formatting issues. This workflow reports that debt without fixing files or weakening either tool's configuration. Once the baseline is resolved, remove `continue-on-error` from the two style steps in a separate reviewed PR.

The workflow uses a read-only `contents: read` GitHub token, does not persist checkout credentials, and needs no additional secrets or application dependencies. Actions are pinned to commit SHAs; update those pins and the Bun/Node versions deliberately and verify the same commands before changing them. It does not deploy or merge changes. Making **Tests, types, and build** mandatory for merging requires a separate repository ruleset or branch-protection setting; this PR does not change those settings.

## TODO

- **Google Places**: implement `PlacesDataService.searchBusinesses` server-side (key never in client), map results to `Business`; mount a real map in `MapPanel`.
- **Metro boundary validation**: replace the bounding box in `src/lib/region.ts` with a metro polygon; reject Northshore (e.g. Covington) results.
- **Supabase / Auth / RLS**: tables for wait reports & favorites, RLS per user, optional sign-in.
- **Reporting**: submission flow, 90-minute expiry enforced server-side, abuse protection.
- **GitHub / Codex handoff**: connect GitHub, keep `AGENTS.md` rules current.
