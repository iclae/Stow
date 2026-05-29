import { useEffect, useState } from 'react';
import { getLockedTabIds } from '@/src/lock/keep-awake';

/** Live set of Keep-awake-locked tab ids, synced from session storage. */
export function useLocks(): Set<number> {
  const [locked, setLocked] = useState<Set<number>>(new Set());

  useEffect(() => {
    getLockedTabIds().then((ids) => setLocked(new Set(ids))).catch(console.error);

    const listener = (
      changes: Record<string, chrome.storage.StorageChange>,
      area: string,
    ) => {
      if (area === 'session' && changes.lockedTabIds) {
        setLocked(new Set((changes.lockedTabIds.newValue as number[]) ?? []));
      }
    };
    chrome.storage.onChanged.addListener(listener);
    return () => chrome.storage.onChanged.removeListener(listener);
  }, []);

  return locked;
}
