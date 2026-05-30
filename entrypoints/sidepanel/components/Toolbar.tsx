import { Moon, Archive, GearSix } from '@phosphor-icons/react';
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
        <Moon size={13} weight="regular" />
        Sleep others
      </button>
      <button
        className={styles.button}
        title="Stash all other tabs in this window"
        onClick={() => stashOtherTabs()}
      >
        <Archive size={13} weight="regular" />
        Stash others
      </button>
      <button
        className={`${styles.button} ${styles.iconOnly}`}
        title="Settings"
        onClick={() => chrome.runtime.openOptionsPage()}
      >
        <GearSix size={15} weight="regular" />
      </button>
    </div>
  );
}
