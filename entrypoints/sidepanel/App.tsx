import { useTabs } from './hooks/useTabs';
import { OpenRegion } from './components/OpenRegion';
import { StashRegion } from './components/StashRegion';
import styles from './App.module.css';

export function App() {
  const tabs = useTabs();

  return (
    <div className={styles.app}>
      <OpenRegion tabs={tabs} />
      <StashRegion />
    </div>
  );
}
