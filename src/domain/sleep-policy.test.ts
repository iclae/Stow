import { describe, it, expect } from 'vitest';
import {
  domainMatches,
  isAutoSleepEligible,
  isManualSleepEligible,
  isOneClickSleepEligible,
  type SleepCandidate,
} from './sleep-policy';

function candidate(over: Partial<SleepCandidate> = {}): SleepCandidate {
  return {
    active: false,
    pinned: false,
    audible: false,
    locked: false,
    discarded: false,
    url: 'https://example.com',
    lastAccessed: 0,
    ...over,
  };
}

describe('domainMatches', () => {
  it('matches an exact domain', () => {
    expect(domainMatches('https://google.com/x', ['google.com'])).toBe(true);
  });
  it('matches a subdomain', () => {
    expect(domainMatches('https://mail.google.com', ['google.com'])).toBe(true);
  });
  it('does not match a non-subdomain lookalike', () => {
    expect(domainMatches('https://notgoogle.com', ['google.com'])).toBe(false);
  });
  it('does not match an unrelated domain', () => {
    expect(domainMatches('https://example.com', ['google.com'])).toBe(false);
  });
  it('ignores blank entries and is case-insensitive', () => {
    expect(domainMatches('https://Google.com', ['  ', 'GOOGLE.COM'])).toBe(true);
  });
  it('returns false on an unparseable url', () => {
    expect(domainMatches('not a url', ['google.com'])).toBe(false);
  });
});

describe('isManualSleepEligible', () => {
  it('allows an awake, unlocked, non-active Tab', () => {
    expect(isManualSleepEligible(candidate())).toBe(true);
  });
  it('blocks the active Tab', () => {
    expect(isManualSleepEligible(candidate({ active: true }))).toBe(false);
  });
  it('blocks a locked Tab', () => {
    expect(isManualSleepEligible(candidate({ locked: true }))).toBe(false);
  });
  it('blocks an already-asleep Tab', () => {
    expect(isManualSleepEligible(candidate({ discarded: true }))).toBe(false);
  });
  it('allows a pinned Tab (single sleep is fine on pinned)', () => {
    expect(isManualSleepEligible(candidate({ pinned: true }))).toBe(true);
  });
});

describe('isOneClickSleepEligible', () => {
  it('sleeps an ordinary background Tab', () => {
    expect(isOneClickSleepEligible(candidate())).toBe(true);
  });
  it('exempts the active Tab', () => {
    expect(isOneClickSleepEligible(candidate({ active: true }))).toBe(false);
  });
  it('exempts pinned Tabs', () => {
    expect(isOneClickSleepEligible(candidate({ pinned: true }))).toBe(false);
  });
  it('exempts locked Tabs', () => {
    expect(isOneClickSleepEligible(candidate({ locked: true }))).toBe(false);
  });
  it('skips already-asleep Tabs (no-op)', () => {
    expect(isOneClickSleepEligible(candidate({ discarded: true }))).toBe(false);
  });
});

describe('isAutoSleepEligible', () => {
  const config = { now: 100_000, idleMs: 60_000, excludedDomains: ['music.com'] };

  it('sleeps a Tab idle beyond the timeout', () => {
    expect(isAutoSleepEligible(candidate({ lastAccessed: 0 }), config)).toBe(true);
  });
  it('keeps a Tab idle for less than the timeout', () => {
    expect(isAutoSleepEligible(candidate({ lastAccessed: 50_000 }), config)).toBe(
      false,
    );
  });
  it('never sleeps the active Tab', () => {
    expect(
      isAutoSleepEligible(candidate({ active: true, lastAccessed: 0 }), config),
    ).toBe(false);
  });
  it('never sleeps pinned, audible, locked, or asleep Tabs', () => {
    for (const over of [
      { pinned: true },
      { audible: true },
      { locked: true },
      { discarded: true },
    ]) {
      expect(
        isAutoSleepEligible(candidate({ ...over, lastAccessed: 0 }), config),
      ).toBe(false);
    }
  });
  it('never sleeps an excluded domain', () => {
    expect(
      isAutoSleepEligible(
        candidate({ url: 'https://music.com/play', lastAccessed: 0 }),
        config,
      ),
    ).toBe(false);
  });
});
