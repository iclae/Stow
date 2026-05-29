import type { TabView } from '@/src/services/tabs';
import { TabRow } from './TabRow';
import styles from './OpenRegion.module.css';

export function OpenRegion({ tabs }: { tabs: TabView[] }) {
  return (
    <section className={styles.region}>
      <header className={styles.header}>
        <h2 className={styles.heading}>Open</h2>
        <span className={styles.count}>{tabs.length}</span>
      </header>
      <ul className={styles.list}>
        {tabs.map((tab) => (
          <TabRow key={tab.id} tab={tab} />
        ))}
      </ul>
    </section>
  );
}
