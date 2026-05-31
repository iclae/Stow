import { describe, it, expect, vi } from 'vitest';
import { browser } from 'wxt/browser';
import { liveValue } from './live-value';

interface Box {
  n: number;
}
const decode = (raw: unknown): Box => ({ n: (raw as number) ?? 0 });

describe('liveValue.initial', () => {
  it('is decode(undefined)', () => {
    expect(liveValue('local', 'k', decode).initial).toEqual({ n: 0 });
  });
});

describe('liveValue.get', () => {
  it('decodes the default when the key is absent', async () => {
    expect(await liveValue('local', 'k', decode).get()).toEqual({ n: 0 });
  });

  it('decodes the stored value', async () => {
    await browser.storage.local.set({ k: 7 });
    expect(await liveValue('local', 'k', decode).get()).toEqual({ n: 7 });
  });
});

describe('liveValue.subscribe', () => {
  it('fires with the decoded new value on a matching change', async () => {
    const cb = vi.fn();
    liveValue('local', 'k', decode).subscribe(cb);
    await browser.storage.local.set({ k: 3 });
    expect(cb).toHaveBeenCalledWith({ n: 3 });
  });

  it('ignores changes to other keys', async () => {
    const cb = vi.fn();
    liveValue('local', 'k', decode).subscribe(cb);
    await browser.storage.local.set({ other: 1 });
    expect(cb).not.toHaveBeenCalled();
  });

  it('ignores changes in other areas', async () => {
    const cb = vi.fn();
    liveValue('local', 'k', decode).subscribe(cb);
    await browser.storage.session.set({ k: 9 });
    expect(cb).not.toHaveBeenCalled();
  });

  it('stops firing after unsubscribe', async () => {
    const cb = vi.fn();
    const unsubscribe = liveValue('local', 'k', decode).subscribe(cb);
    unsubscribe();
    await browser.storage.local.set({ k: 5 });
    expect(cb).not.toHaveBeenCalled();
  });
});
