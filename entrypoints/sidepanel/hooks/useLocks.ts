import { lockStore } from '@/src/lock/keep-awake';
import { useStore } from '@/src/storage/live-value';

/** Live set of Keep-awake-locked tab ids, synced from session storage. */
export function useLocks(): Set<number> {
  return useStore(lockStore);
}
