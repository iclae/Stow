// Sleep policy: pure decisions about whether a Tab may be slept. No Chrome API.

/** The Tab facts the policy needs. Decoupled from chrome.tabs.Tab for testing. */
export interface SleepCandidate {
  active: boolean;
  pinned: boolean;
  audible: boolean;
  /** Held by the session-only Keep-awake lock. */
  locked: boolean;
  /** Already asleep (discarded) — sleeping again is a no-op. */
  discarded: boolean;
  url: string;
  /** Epoch ms of the Tab's last view, from chrome's `lastAccessed`. */
  lastAccessed: number;
}

export interface AutoSleepConfig {
  now: number;
  idleMs: number;
  excludedDomains: string[];
}

/**
 * True when `pageUrl`'s host equals a listed domain or is a subdomain of one.
 * e.g. "mail.google.com" matches "google.com"; "notgoogle.com" does not.
 */
export function domainMatches(
  pageUrl: string,
  excludedDomains: string[],
): boolean {
  let host: string;
  try {
    host = new URL(pageUrl).hostname.toLowerCase();
  } catch {
    return false;
  }
  return excludedDomains.some((raw) => {
    const domain = raw.trim().toLowerCase();
    if (!domain) return false;
    return host === domain || host.endsWith('.' + domain);
  });
}

/** Single-Tab manual Sleep button: blocked on the active, locked, or asleep Tab. */
export function isManualSleepEligible(tab: SleepCandidate): boolean {
  return !tab.active && !tab.locked && !tab.discarded;
}

/** One-click sleep-others: also exempts pinned Tabs; asleep Tabs are a no-op. */
export function isOneClickSleepEligible(tab: SleepCandidate): boolean {
  return !tab.active && !tab.pinned && !tab.locked && !tab.discarded;
}

/**
 * Auto-sleep eligibility: never the active / pinned / audible / locked / asleep
 * Tab, never an excluded domain, and only once idle beyond the timeout.
 */
export function isAutoSleepEligible(
  tab: SleepCandidate,
  config: AutoSleepConfig,
): boolean {
  if (tab.active || tab.pinned || tab.audible || tab.locked || tab.discarded) {
    return false;
  }
  if (domainMatches(tab.url, config.excludedDomains)) return false;
  return config.now - tab.lastAccessed >= config.idleMs;
}
