import { sleepOtherTabs } from '@/src/services/bulk-actions';
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
    </div>
  );
}
