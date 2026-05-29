import { sleepOtherTabs, stashOtherTabs } from '@/src/services/bulk-actions';
import styles from './Toolbar.module.css';

export function Toolbar() {
  return (
    <div className={styles.toolbar}>
      <button
        className={styles.button}
        title="Sleep all other tabs in this window"
        onClick={() => sleepOtherTabs()}
      >
        💤 Sleep others
      </button>
      <button
        className={styles.button}
        title="Stash all other tabs in this window"
        onClick={() => stashOtherTabs()}
      >
        📥 Stash others
      </button>
      <button
        className={styles.button}
        title="Settings"
        onClick={() => chrome.runtime.openOptionsPage()}
      >
        ⚙️
      </button>
    </div>
  );
}
