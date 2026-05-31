import { settingsStore, type Settings } from '@/src/storage/storage';
import { useStore } from '@/src/storage/live-value';

/** Live view of persisted settings, kept in sync via storage changes. */
export function useSettings(): Settings {
  return useStore(settingsStore);
}
