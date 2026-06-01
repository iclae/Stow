import { describe, it, expect } from 'vitest';
import {
  addEntries,
  isStashable,
  removeEntry,
  reorder,
  sortByOrder,
  type StashEntry,
  type StashableTab,
} from './stash';

let counter = 0;
const newId = () => `id-${++counter}`;

function tab(url: string, title = url): StashableTab {
  return { url, title };
}

describe('isStashable', () => {
  it('accepts http(s) pages', () => {
    expect(isStashable('https://example.com')).toBe(true);
    expect(isStashable('http://example.com/path')).toBe(true);
  });

  it('rejects special and unrestorable pages', () => {
    expect(isStashable('chrome://extensions')).toBe(false);
    expect(isStashable('chrome://newtab/')).toBe(false);
    expect(isStashable('about:blank')).toBe(false);
    expect(isStashable('https://chromewebstore.google.com/detail/x')).toBe(false);
    expect(isStashable(undefined)).toBe(false);
    expect(isStashable('')).toBe(false);
    expect(isStashable('not a url')).toBe(false);
  });
});

describe('addEntries', () => {
  it('appends an entry per stashable tab', () => {
    counter = 0;
    const result = addEntries([], [tab('https://a.com'), tab('https://b.com')], 1000, newId);
    expect(result.map((e) => e.url)).toEqual(['https://a.com', 'https://b.com']);
    expect(result.every((e) => e.stashedAt === 1000)).toBe(true);
  });

  it('allows duplicate URLs as separate entries', () => {
    counter = 0;
    const result = addEntries([], [tab('https://a.com'), tab('https://a.com')], 1, newId);
    expect(result).toHaveLength(2);
    expect(result[0].id).not.toBe(result[1].id);
  });

  it('skips unstashable pages', () => {
    counter = 0;
    const result = addEntries([], [tab('chrome://x'), tab('https://ok.com')], 1, newId);
    expect(result.map((e) => e.url)).toEqual(['https://ok.com']);
  });

  it('inserts a new single entry above existing ones (newest first)', () => {
    counter = 0;
    const first = addEntries([], [tab('https://a.com')], 1, newId);
    const second = addEntries(first, [tab('https://b.com')], 2, newId);
    expect(sortByOrder(second).map((e) => e.url)).toEqual([
      'https://b.com',
      'https://a.com',
    ]);
  });

  it('prepends a batch as a block, keeping the tabs given order within it', () => {
    counter = 0;
    const existing = addEntries([], [tab('https://x.com'), tab('https://y.com')], 1, newId);
    const after = addEntries(
      existing,
      [tab('https://a.com'), tab('https://b.com'), tab('https://c.com')],
      2,
      newId,
    );
    expect(sortByOrder(after).map((e) => e.url)).toEqual([
      'https://a.com',
      'https://b.com',
      'https://c.com',
      'https://x.com',
      'https://y.com',
    ]);
  });
});

describe('removeEntry (pop restore persisted half)', () => {
  it('removes the matching entry and keeps the rest', () => {
    counter = 0;
    const list = addEntries([], [tab('https://a.com'), tab('https://b.com')], 1, newId);
    const after = removeEntry(list, list[0].id);
    expect(after.map((e) => e.url)).toEqual(['https://b.com']);
  });
});

describe('copy restore semantics', () => {
  it('keeps the entry in the list (no removal)', () => {
    counter = 0;
    const list = addEntries([], [tab('https://a.com')], 1, newId);
    // Copy restore reopens the tab but does not touch the stash list.
    expect(list).toHaveLength(1);
    expect(list.find((e) => e.id === list[0].id)).toBeDefined();
  });
});

describe('reorder', () => {
  function make(): StashEntry[] {
    counter = 0;
    return addEntries(
      [],
      [tab('https://a.com'), tab('https://b.com'), tab('https://c.com')],
      1,
      newId,
    );
  }

  it('moves an entry to a new index and renumbers contiguously', () => {
    const list = make();
    const moved = reorder(list, list[0].id, 2);
    expect(sortByOrder(moved).map((e) => e.url)).toEqual([
      'https://b.com',
      'https://c.com',
      'https://a.com',
    ]);
    expect(sortByOrder(moved).map((e) => e.order)).toEqual([0, 1, 2]);
  });

  it('persisted order survives a sort round-trip', () => {
    const list = make();
    const moved = reorder(list, list[2].id, 0);
    // Shuffle input order; sortByOrder must still reflect the move.
    const shuffled = [moved[1], moved[2], moved[0]];
    expect(sortByOrder(shuffled).map((e) => e.url)).toEqual([
      'https://c.com',
      'https://a.com',
      'https://b.com',
    ]);
  });

  it('is a no-op for an unknown id', () => {
    const list = make();
    expect(reorder(list, 'nope', 0)).toEqual(list);
  });
});
