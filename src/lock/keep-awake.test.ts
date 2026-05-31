import { describe, it, expect } from 'vitest';
import { getLockedTabIds, isLocked, lockStore, toggleLock } from './keep-awake';

describe('toggleLock', () => {
  it('locks then unlocks a tab, returning the new state', async () => {
    expect(await toggleLock(1)).toBe(true);
    expect(await isLocked(1)).toBe(true);
    expect(await toggleLock(1)).toBe(false);
    expect(await isLocked(1)).toBe(false);
  });

  it('tracks multiple locked tabs independently', async () => {
    await toggleLock(1);
    await toggleLock(2);
    expect((await getLockedTabIds()).sort()).toEqual([1, 2]);
  });
});

describe('lockStore', () => {
  it('reads an empty set by default', async () => {
    expect(await lockStore.get()).toEqual(new Set());
  });

  it('reflects toggled locks as a decoded Set', async () => {
    await toggleLock(5);
    expect(await lockStore.get()).toEqual(new Set([5]));
  });

  it('notifies subscribers when a lock toggles', async () => {
    const seen: Set<number>[] = [];
    lockStore.subscribe((s) => seen.push(s));
    await toggleLock(8);
    expect(seen.at(-1)).toEqual(new Set([8]));
  });
});
