// Keep-awake lock registry: a session-only set of locked tab ids. Backed by
// chrome.storage.session, which is in-memory and cleared on browser restart
// (ADR-0002) while surviving service-worker unloads and staying shared between
// the side panel and background. This is not the rejected self-generated-id +
// page sessionStorage anchoring scheme — it keys directly on chrome's tabId.

const KEY = 'lockedTabIds';

async function read(): Promise<Set<number>> {
  const res = await chrome.storage.session.get(KEY);
  return new Set((res[KEY] as number[] | undefined) ?? []);
}

async function write(ids: Set<number>): Promise<void> {
  await chrome.storage.session.set({ [KEY]: [...ids] });
}

export async function getLockedTabIds(): Promise<number[]> {
  return [...(await read())];
}

export async function isLocked(tabId: number): Promise<boolean> {
  return (await read()).has(tabId);
}

/** Toggle the lock for a Tab and return its new locked state. */
export async function toggleLock(tabId: number): Promise<boolean> {
  const ids = await read();
  const nowLocked = !ids.has(tabId);
  if (nowLocked) ids.add(tabId);
  else ids.delete(tabId);
  await write(ids);
  return nowLocked;
}
