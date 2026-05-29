import { activateTab, type TabView } from '@/src/services/tabs';
import styles from './TabRow.module.css';

const STATE_LABEL: Record<TabView['state'], string> = {
  active: 'Active',
  awake: 'Awake',
  asleep: 'Asleep',
};

export function TabRow({ tab }: { tab: TabView }) {
  return (
    <li className={styles.row} data-state={tab.state}>
      <img
        className={styles.favicon}
        src={tab.favIconUrl || undefined}
        alt=""
        aria-hidden
      />
      <button
        className={styles.title}
        title={tab.title}
        onClick={() => activateTab(tab.id)}
      >
        {tab.title}
      </button>
      <span className={styles.badge} data-state={tab.state}>
        {STATE_LABEL[tab.state]}
      </span>
    </li>
  );
}
