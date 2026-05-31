// Auto-sleep engine: sleeps Tabs idle beyond the configured timeout across all
// windows, applying the pure Sleep policy. Runs from the background on an alarm.
import { browser } from 'wxt/browser';
import { isAutoSleepEligible } from '@/src/domain/sleep-policy';
import { getSettings } from '@/src/storage/storage';
import { getLockedTabIds } from '@/src/lock/keep-awake';
import { toSleepCandidate } from './tabs';

export async function runAutoSleep(now: number = Date.now()): Promise<void> {
  const settings = await getSettings();
  const idleMs = settings.idleMinutes * 60_000;
  if (idleMs <= 0) return; // 0 disables auto-sleep.

  const [tabs, lockedIds] = await Promise.all([
    browser.tabs.query({}), // all windows
    getLockedTabIds(),
  ]);
  const locked = new Set(lockedIds);

  for (const tab of tabs) {
    if (tab.id === undefined) continue;
    const eligible = isAutoSleepEligible(
      toSleepCandidate(tab, locked.has(tab.id), now),
      { now, idleMs, excludedDomains: settings.excludedDomains },
    );
    if (eligible) await browser.tabs.discard(tab.id);
  }
}
