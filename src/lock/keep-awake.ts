// Keep-awake lock registry: a session-only set of locked tab ids. Backed by
// chrome.storage.session, which is in-memory and cleared on browser restart
// (ADR-0002) while surviving service-worker unloads and staying shared between
// the side panel and background. This is not the rejected self-generated-id +
// page sessionStorage anchoring scheme — it keys directly on chrome's tabId.
import { browser } from 'wxt/browser';
import { liveValue } from '@/src/storage/live-value';

const KEY = 'lockedTabIds';

/**
 * Live view of the locked tab ids. Owns the storage key and decoding, so
 * consumers (e.g. the side panel) observe locks through this interface rather
 * than reaching into chrome.storage.session directly.
 */
export const lockStore = liveValue(
  'session',
  KEY,
  (raw) => new Set((raw as number[] | undefined) ?? []),
);

async function write(ids: Set<number>): Promise<void> {
  await browser.storage.session.set({ [KEY]: [...ids] });
}

export async function getLockedTabIds(): Promise<number[]> {
  return [...(await lockStore.get())];
}

export async function isLocked(tabId: number): Promise<boolean> {
  return (await lockStore.get()).has(tabId);
}

/** Toggle the lock for a Tab and return its new locked state. */
export async function toggleLock(tabId: number): Promise<boolean> {
  const ids = await lockStore.get();
  const nowLocked = !ids.has(tabId);
  if (nowLocked) ids.add(tabId);
  else ids.delete(tabId);
  await write(ids);
  return nowLocked;
}
