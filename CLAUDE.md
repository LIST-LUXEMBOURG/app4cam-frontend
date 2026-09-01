# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm install          # install dependencies
pnpm dev              # start dev server (opens browser automatically)
pnpm build            # production build
pnpm lint             # run ESLint
pnpm check            # TypeScript type check (vue-tsc)
pnpm format           # Prettier format all files

pnpm test:unit:ci     # run all unit tests once
pnpm test:unit:watch  # run unit tests in watch mode
pnpm test:unit:coverage  # run unit tests with coverage report
```

To run a single test file:

```bash
pnpm vitest run src/helpers/DateConverter.spec.ts
```

## Architecture

App4Cam is a Vue 3 + Quasar 2 SPA that acts as a frontend for a wildlife camera backend API. It communicates exclusively via the REST API defined in `src/helpers/ApiClientService.ts`, with the backend URL configured through the `API_SERVER_URL` environment variable (`src/config.ts`).

### Layers

**API layer** — `src/helpers/ApiClientService.ts` is the single Axios client wrapping all backend endpoints. All API response types are declared in `src/helpers/ApiTypings.d.ts`.

**Stores (Pinia)** — `src/stores/` contains three stores:

- `settings.ts` — manages `ApplicationSettings` (camera, general, triggering sections). Tracks `current` and `initial` copies to diff and PATCH only changed fields. Flags like `isFocusEnabled` come from the backend and gate UI feature visibility.
- `properties.ts` — read-only device state (battery voltage, camera connection, light type, version, device ID).
- `files.ts` / `storage.ts` — media file list and storage status.

**Pages** — `src/pages/`: Dashboard, Settings (tabbed with CameraSettings / GeneralSettings / TriggerSettings), Media, ErrorNotFound.

**Settings types** — defined in `src/settings.d.ts`. The hierarchy is `ApplicationSettings` ⊃ `ApplicationSettingsWithoutFlags` ⊃ `PersistentSettings`. Only `PersistentSettings` fields are sent on save; flag fields (`isFocusEnabled`, etc.) are backend-controlled read-only metadata.

**Components** — `src/components/widgets/` holds dashboard widgets (BatteryStatus, CameraStatus, DiskUsage, MediaCounts, etc.). Settings forms live directly in `src/components/`.

### Testing

Tests use Vitest + `@testing-library/vue`. Test files sit next to the source files as `*.spec.ts`. Shared test utilities are in `src/test-helpers.ts` (provides `convertJsonToFiles`). Pinia stores are tested with `@pinia/testing`.

### Build config

`quasar.config.ts` injects `__APP_VERSION__` and `__COMMIT_HASH__` globals at build time. Quasar plugins in use: Dialog, LoadingBar, Notify.
