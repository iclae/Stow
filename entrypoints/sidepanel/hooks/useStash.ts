import type { StashEntry } from '@/src/domain/stash';
import { stashStore } from '@/src/storage/storage';
import { useStore } from '@/src/storage/live-value';

/** Live, order-sorted view of the Stash, kept in sync via storage changes. */
export function useStash(): StashEntry[] {
  return useStore(stashStore);
}
