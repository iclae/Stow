// Stash domain: pure list operations over Stash entries. No Chrome API access.

export interface StashEntry {
  id: string;
  url: string;
  title: string;
  favIconUrl?: string;
  stashedAt: number;
  /** Explicit, persisted ordering. Lower comes first. */
  order: number;
}

/** Minimal shape captured from a Tab at stash time. */
export interface StashableTab {
  url: string;
  title: string;
  favIconUrl?: string;
}

/**
 * Whether a page can be meaningfully stashed and later restored. Special and
 * unrestorable pages (chrome://, the Web Store, blank new tabs, etc.) are not.
 */
export function isStashable(url: string | undefined): boolean {
  if (!url) return false;
  let scheme: string;
  let host: string;
  try {
    const u = new URL(url);
    scheme = u.protocol;
    host = u.host;
  } catch {
    return false;
  }
  if (scheme !== 'http:' && scheme !== 'https:' && scheme !== 'ftp:') {
    return false;
  }
  // Chrome Web Store pages cannot be reopened by an extension-created tab.
  if (host === 'chromewebstore.google.com' || host === 'chrome.google.com') {
    return false;
  }
  return true;
}

/** Entries sorted by their explicit order value. */
export function sortByOrder(entries: StashEntry[]): StashEntry[] {
  return [...entries].sort((a, b) => a.order - b.order);
}

/**
 * The order value the first entry of a `count`-sized block should take when
 * prepended on top, so the whole block sorts above every existing entry.
 */
export function topOrderBase(entries: StashEntry[], count: number): number {
  if (entries.length === 0) return 0;
  return Math.min(...entries.map((e) => e.order)) - count;
}

/**
 * Add new entries for the given tabs at the top of the list (newest first).
 * A batch keeps the tabs' given order within the prepended block. Duplicates
 * are allowed (the same URL stashed twice yields two entries); unstashable
 * pages are skipped.
 */
export function addEntries(
  entries: StashEntry[],
  tabs: StashableTab[],
  now: number,
  newId: () => string,
): StashEntry[] {
  const stashable = tabs.filter((tab) => isStashable(tab.url));
  const result = [...entries];
  let order = topOrderBase(entries, stashable.length);
  for (const tab of stashable) {
    result.push({
      id: newId(),
      url: tab.url,
      title: tab.title,
      favIconUrl: tab.favIconUrl,
      stashedAt: now,
      order: order++,
    });
  }
  return result;
}

/** Remove the entry with the given id (the persisted half of pop restore). */
export function removeEntry(entries: StashEntry[], id: string): StashEntry[] {
  return entries.filter((e) => e.id !== id);
}

/**
 * Move the entry with `id` to `toIndex` within the order-sorted list and
 * renumber order values to be contiguous, so the arrangement persists.
 */
export function reorder(
  entries: StashEntry[],
  id: string,
  toIndex: number,
): StashEntry[] {
  const sorted = sortByOrder(entries);
  const fromIndex = sorted.findIndex((e) => e.id === id);
  if (fromIndex === -1) return entries;
  const [moved] = sorted.splice(fromIndex, 1);
  const clamped = Math.max(0, Math.min(toIndex, sorted.length));
  sorted.splice(clamped, 0, moved);
  return sorted.map((e, i) => ({ ...e, order: i }));
}
