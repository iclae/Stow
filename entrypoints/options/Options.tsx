import { useEffect, useState } from 'react';
import { getSettings, setSettings } from '@/src/storage/storage';
import styles from './Options.module.css';

/** Hostname of the first active http(s) Tab across windows, or null. */
async function currentTabDomain(): Promise<string | null> {
  const tabs = await chrome.tabs.query({ active: true });
  for (const t of tabs) {
    try {
      const u = new URL(t.url ?? '');
      if (u.protocol === 'http:' || u.protocol === 'https:') return u.hostname;
    } catch {
      // skip unparseable / special pages
    }
  }
  return null;
}

function parseDomains(text: string): string[] {
  return text
    .split('\n')
    .map((d) => d.trim())
    .filter(Boolean);
}

export function Options() {
  const [idleMinutes, setIdleMinutes] = useState<number>(30);
  const [domainsText, setDomainsText] = useState<string>('');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    getSettings().then((s) => {
      setIdleMinutes(s.idleMinutes);
      setDomainsText(s.excludedDomains.join('\n'));
      setLoaded(true);
    });
  }, []);

  function saveIdle(value: number) {
    setIdleMinutes(value);
    setSettings({ idleMinutes: value });
  }

  function saveDomains(text: string) {
    setDomainsText(text);
    setSettings({ excludedDomains: parseDomains(text) });
  }

  async function addCurrentDomain() {
    const domain = await currentTabDomain();
    if (!domain) return;
    const existing = parseDomains(domainsText);
    if (existing.includes(domain)) return;
    saveDomains([...existing, domain].join('\n'));
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

      <section className={styles.section}>
        <h2 className={styles.heading}>Excluded domains</h2>
        <textarea
          className={styles.textarea}
          rows={6}
          value={domainsText}
          onChange={(e) => saveDomains(e.target.value)}
          placeholder="one domain per line, e.g. mail.google.com"
        />
        <div className={styles.row}>
          <button className={styles.button} onClick={addCurrentDomain}>
            Add current tab&apos;s domain
          </button>
        </div>
        <p className={styles.hint}>
          A Tab is never auto-slept if its domain equals or is a subdomain of a
          listed domain.
        </p>
      </section>
    </main>
  );
}
