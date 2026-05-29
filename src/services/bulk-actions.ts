// Toolbar bulk operations. The eligibility decision lives entirely in the
// Sleep policy / Stash domain; this module only queries tabs and applies it.
import { browser, type Tabs } from 'wxt/browser';
import {
  isOneClickSleepEligible,
  type SleepCandidate,
} from '@/src/domain/sleep-policy';
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
  const tabs = await browser.tabs.query({ currentWindow: true });
  for (const tab of tabs) {
    if (tab.id === undefined) continue;
    if (isOneClickSleepEligible(toCandidate(tab, false))) {
      await browser.tabs.discard(tab.id);
    }
  }
}
