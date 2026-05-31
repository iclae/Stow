// A live, decoded view of one chrome.storage key: read it once or subscribe to
// its changes, with decoding (and defaults) applied in a single place. The
// subscription wiring lives here once, rather than being repeated per consumer.
import { useEffect, useState } from 'react';
import { browser } from 'wxt/browser';

export type StorageArea = 'local' | 'session';

export interface LiveValue<T> {
  /** Decoded value of an empty store: `decode(undefined)`. Used as first-paint state. */
  initial: T;
  /** Read the current value, decoded. */
  get(): Promise<T>;
  /** Observe changes to this key, decoded. Returns an unsubscribe function. */
  subscribe(cb: (value: T) => void): () => void;
}

/**
 * Build a LiveValue for `area`/`key`. `decode` maps the raw stored value (or
 * `undefined` when absent) to `T`, so defaults and shape live in one function.
 */
export function liveValue<T>(
  area: StorageArea,
  key: string,
  decode: (raw: unknown) => T,
): LiveValue<T> {
  return {
    initial: decode(undefined),
    async get() {
      const res = await browser.storage[area].get(key);
      return decode(res[key]);
    },
    subscribe(cb) {
      const listener = (
        changes: Record<string, { newValue?: unknown }>,
        changedArea: string,
      ) => {
        if (changedArea === area && key in changes) {
          cb(decode(changes[key].newValue));
        }
      };
      browser.storage.onChanged.addListener(listener);
      return () => browser.storage.onChanged.removeListener(listener);
    },
  };
}

/** Subscribe a React component to a LiveValue, keeping it in sync with storage. */
export function useStore<T>(store: LiveValue<T>): T {
  const [value, setValue] = useState<T>(store.initial);

  useEffect(() => {
    let alive = true;
    store.get().then((v) => alive && setValue(v)).catch(console.error);
    const unsubscribe = store.subscribe(setValue);
    return () => {
      alive = false;
      unsubscribe();
    };
  }, [store]);

  return value;
}
