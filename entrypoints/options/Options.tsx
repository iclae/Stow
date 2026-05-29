import { useEffect, useState } from 'react';
import { getSettings, setSettings } from '@/src/storage/storage';
import styles from './Options.module.css';

export function Options() {
  const [idleMinutes, setIdleMinutes] = useState<number>(30);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    getSettings().then((s) => {
      setIdleMinutes(s.idleMinutes);
      setLoaded(true);
    });
  }, []);

  function saveIdle(value: number) {
    setIdleMinutes(value);
    setSettings({ idleMinutes: value });
  }

  if (!loaded) return null;

  return (
    <main className={styles.page}>
      <h1 className={styles.title}>TabSwap Settings</h1>

      <section className={styles.section}>
        <h2 className={styles.heading}>Auto-sleep</h2>
        <label className={styles.field}>
          <span>Idle timeout (minutes)</span>
          <input
            type="number"
            min={0}
            value={idleMinutes}
            onChange={(e) => saveIdle(Number(e.target.value))}
          />
        </label>
        <p className={styles.hint}>
          Tabs you haven&apos;t viewed for this long are slept automatically
          across all windows. Set to 0 to disable.
        </p>
      </section>
    </main>
  );
}
