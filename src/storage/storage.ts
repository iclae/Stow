// Storage: wraps chrome.storage.local behind a small interface. Both Stash
// entries and settings live here; nothing uses chrome.storage.sync (ADR-0001).
import { browser } from 'wxt/browser';
import { sortByOrder, type StashEntry } from '@/src/domain/stash';
import { liveValue } from './live-value';

const STASH_KEY = 'stash';
const SETTINGS_KEY = 'settings';

export interface Settings {
  /** Auto-sleep idle timeout, in minutes. */
  idleMinutes: number;
  /** Domains exempt from auto-sleep (matched by domain + subdomain). */
  excludedDomains: string[];
  /** Whether the Stash region is collapsed in the side panel. */
  stashCollapsed: boolean;
}

export const DEFAULT_SETTINGS: Settings = {
  idleMinutes: 30,
  excludedDomains: [],
  stashCollapsed: false,
};

/** Live, order-sorted view of the Stash. Reads here are always sorted. */
export const stashStore = liveValue('local', STASH_KEY, (raw) =>
  sortByOrder((raw as StashEntry[] | undefined) ?? []),
);

/** Live view of settings, merged over defaults. */
export const settingsStore = liveValue('local', SETTINGS_KEY, (raw) => ({
  ...DEFAULT_SETTINGS,
  ...(raw as Partial<Settings> | undefined),
}));

export const getStash = stashStore.get;

export async function setStash(entries: StashEntry[]): Promise<void> {
  await browser.storage.local.set({ [STASH_KEY]: entries });
}

/** Read-modify-write the Stash: persist `fn` applied to the current entries. */
export async function updateStash(
  fn: (entries: StashEntry[]) => StashEntry[],
): Promise<void> {
  await setStash(fn(await getStash()));
}

export const getSettings = settingsStore.get;

export async function setSettings(patch: Partial<Settings>): Promise<void> {
  const current = await getSettings();
  await browser.storage.local.set({ [SETTINGS_KEY]: { ...current, ...patch } });
}
