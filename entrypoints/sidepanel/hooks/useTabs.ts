import { useCallback, useEffect, useState } from 'react';
import { browser } from 'wxt/browser';
import { queryCurrentWindowTabs, type TabView } from '@/src/services/tabs';

/**
 * Live, read-only view of the current window's Tabs. Re-queries on any tab
 * event so the panel mirrors the real tab strip.
 */
export function useTabs(): TabView[] {
  const [tabs, setTabs] = useState<TabView[]>([]);

  const refresh = useCallback(() => {
    queryCurrentWindowTabs().then(setTabs).catch(console.error);
  }, []);

  useEffect(() => {
    refresh();

    const t = browser.tabs;
    const onUpdated = () => refresh();
    t.onCreated.addListener(refresh);
    t.onRemoved.addListener(refresh);
    t.onActivated.addListener(refresh);
    t.onMoved.addListener(refresh);
    t.onUpdated.addListener(onUpdated);
    t.onAttached.addListener(refresh);
    t.onDetached.addListener(refresh);
    t.onReplaced.addListener(refresh);

    return () => {
      t.onCreated.removeListener(refresh);
      t.onRemoved.removeListener(refresh);
      t.onActivated.removeListener(refresh);
      t.onMoved.removeListener(refresh);
      t.onUpdated.removeListener(onUpdated);
      t.onAttached.removeListener(refresh);
      t.onDetached.removeListener(refresh);
      t.onReplaced.removeListener(refresh);
    };
  }, [refresh]);

  return tabs;
}
