import { Moon, Archive, Settings } from 'lucide-react';
import { sleepOtherTabs, stashOtherTabs } from '@/src/services/bulk-actions';
import styles from './Toolbar.module.css';

export function Toolbar() {
  return (
    <div className={styles.toolbar}>
      <button
        className={styles.button}
        title="Sleep all other tabs in this window"
        aria-label="Sleep other tabs"
        onClick={() => sleepOtherTabs()}
      >
        <Moon size={13} />
        <span className={styles.label}>Sleep others</span>
      </button>
      <button
        className={styles.button}
        title="Stash all other tabs in this window"
        aria-label="Stash other tabs"
        onClick={() => stashOtherTabs()}
      >
        <Archive size={13} />
        <span className={styles.label}>Stash others</span>
      </button>
      <button
        className={`${styles.button} ${styles.iconOnly}`}
        title="Settings"
        aria-label="Settings"
        onClick={() => chrome.runtime.openOptionsPage()}
      >
        <Settings size={15} />
      </button>
    </div>
  );
}
