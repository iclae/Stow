// Toolbar bulk operations. The eligibility decision lives entirely in the
// Sleep policy / Stash domain; this module only queries tabs and applies it.
import { browser, type Tabs } from 'wxt/browser';
import {
  isOneClickSleepEligible,
  type SleepCandidate,
} from '@/src/domain/sleep-policy';
import { getLockedTabIds } from '@/src/lock/keep-awake';
import { stashTabs } from './stash-actions';

function toCandidate(tab: Tabs.Tab, locked: boolean): SleepCandidate {
  return {
    active: tab.active,
    pinned: tab.pinned,
    audible: tab.audible ?? false,
    locked,
    discarded: tab.discarded ?? false,
    url: tab.url ?? '',
    lastAccessed: tab.lastAccessed ?? 0,
  };
}

/** Sleep every Tab in the current window except the active one (current window only). */
export async function sleepOtherTabs(): Promise<void> {
  const [tabs, lockedIds] = await Promise.all([
    browser.tabs.query({ currentWindow: true }),
    getLockedTabIds(),
  ]);
  const locked = new Set(lockedIds);
  for (const tab of tabs) {
    if (tab.id === undefined) continue;
    if (isOneClickSleepEligible(toCandidate(tab, locked.has(tab.id)))) {
      await browser.tabs.discard(tab.id);
    }
  }
}

/**
 * Stash every Tab in the current window except the active and pinned ones.
 * Special / unrestorable pages are skipped by the Stash domain; asleep Tabs
 * are included. Current window only.
 */
export async function stashOtherTabs(): Promise<void> {
  const tabs = await browser.tabs.query({ currentWindow: true });
  const targets = tabs
    .filter((t) => t.id !== undefined && !t.active && !t.pinned)
    .map((t) => ({
      id: t.id!,
      url: t.url ?? '',
      title: t.title ?? '',
      favIconUrl: t.favIconUrl,
    }));
  await stashTabs(targets);
}
