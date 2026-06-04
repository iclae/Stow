# Stow

A Chrome side-panel tab manager built on two reversible verbs: **Sleep** and **Stash**.

Stow lives in the browser's side panel. Open it while mid-task, thin out the noise, and bring tabs back whenever you need them. Nothing is ever lost.

---

## How it works

**Sleep** discards a tab from memory while leaving it in the tab strip. The window gets lighter; the tab is still there, reloading automatically when you click it.

**Stash** closes a tab and saves its metadata (URL, title, favicon) to the extension's local storage. The tab leaves the tab strip entirely and reappears in the Stash region, one click from return.

Both operations are reversible. Every destructive action has an undo toast.

---

## Features

- **Sleep** — free tab memory without losing the tab's place in the strip
- **Stash** — clear tabs into a saved list and restore them on demand
- **Pop restore / Copy restore** — restore a stash entry and remove it, or restore while keeping it
- **Keep-awake lock** — pin a tab so it is never slept by any path (session-scoped; cleared on restart)
- **Auto-sleep** — background rule that sleeps tabs idle for longer than a configured threshold; exempt pinned, audible, and locked tabs, plus any domain on the exclusion list
- **Bulk actions** — "Sleep others" and "Stash others" buttons in the toolbar act on the whole window at once
- **Drag-and-drop reorder** — reorder stash entries or move tabs between regions by dragging
- **Undo toast** — 8-second undo window after every Close or Delete; single-slot, so a new action commits the previous one

---

## Development

**Requirements**: Node.js ≥ 18, pnpm (or npm)

```bash
# Install dependencies
pnpm install

# Start dev server (hot-reloads into Chrome)
pnpm dev

# Type-check
pnpm compile

# Run tests
pnpm test

# Build for production
pnpm build

# Package as .zip for the Chrome Web Store
pnpm zip
```

### Loading the extension in Chrome

1. Run `pnpm dev` — WXT writes the built extension to `.output/chrome-mv3-dev/`
2. Open `chrome://extensions`, enable **Developer mode**
3. Click **Load unpacked** and select the `.output/chrome-mv3-dev/` directory
4. Open the side panel from the Chrome toolbar

---

## Architecture

```
src/
  domain/      # Pure business logic — no Chrome APIs (sleep policy, stash list ops)
  services/    # Chrome API adapters and orchestration (tabs, auto-sleep, bulk actions)
  storage/     # chrome.storage wrappers and reactive live-value observers
  lock/        # Keep-awake lock registry (session storage)
entrypoints/
  background.ts      # Service worker — initialises side panel, schedules auto-sleep
  sidepanel/         # React side-panel UI
  options/           # Settings page (idle timeout, excluded domains)
docs/
  adr/               # Architecture decision records
```

The domain layer has no dependency on Chrome APIs and is fully unit-tested. Services layer adapts and orchestrates; UI hooks subscribe to live storage values and re-render on change.

---

## Permissions

| Permission  | Why |
|-------------|-----|
| `tabs`      | Query, activate, close, and discard tabs |
| `storage`   | Persist stash entries and settings |
| `sidePanel` | Register and control the side-panel surface |
| `alarms`    | Run the auto-sleep engine on a per-minute schedule |

All data is stored locally (`chrome.storage.local`). Nothing is synced to the cloud or sent to any server.

---

## Tech stack

- [WXT](https://wxt.dev) — Chrome extension framework (Vite-based)
- React 19 + TypeScript
- [Pragmatic drag and drop](https://atlassian.design/components/pragmatic-drag-and-drop/) — drag-and-drop
- CSS Modules — scoped component styles
- Vitest — unit tests
