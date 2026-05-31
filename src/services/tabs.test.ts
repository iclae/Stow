import { describe, it, expect } from 'vitest';
import type { Tabs } from 'wxt/browser';
import { toSleepCandidate } from './tabs';

function tab(over: Partial<Tabs.Tab> = {}): Tabs.Tab {
  return {
    active: false,
    pinned: false,
    audible: true,
    discarded: false,
    url: 'https://example.com',
    lastAccessed: 1000,
    ...over,
  } as Tabs.Tab;
}

describe('toSleepCandidate', () => {
  it('maps Tab fields and the supplied locked flag', () => {
    expect(toSleepCandidate(tab({ active: true, pinned: true }), true, 0)).toEqual(
      {
        active: true,
        pinned: true,
        audible: true,
        locked: true,
        discarded: false,
        url: 'https://example.com',
        lastAccessed: 1000,
      },
    );
  });

  it('defaults missing audible/discarded/url to false/false/empty', () => {
    const c = toSleepCandidate(
      tab({ audible: undefined, discarded: undefined, url: undefined }),
      false,
      0,
    );
    expect(c.audible).toBe(false);
    expect(c.discarded).toBe(false);
    expect(c.url).toBe('');
  });

  it('uses the fallback when lastAccessed is absent', () => {
    expect(
      toSleepCandidate(tab({ lastAccessed: undefined }), false, 42).lastAccessed,
    ).toBe(42);
  });

  it('keeps the reported lastAccessed over the fallback', () => {
    expect(
      toSleepCandidate(tab({ lastAccessed: 1000 }), false, 42).lastAccessed,
    ).toBe(1000);
  });
});
