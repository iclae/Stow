import { useEffect, useState } from 'react';
import { getSettings, setSettings } from '@/src/storage/storage';
import { Plus } from '@phosphor-icons/react';
import styles from './Options.module.css';

/**
 * Deduplicated hostnames of all open http(s) Tabs across every window, with a
 * leading "www." stripped (listing the apex also matches its www subdomain).
 */
async function openTabDomains(): Promise<string[]> {
  const tabs = await chrome.tabs.query({});
  const domains = new Set<string>();
  for (const t of tabs) {
    try {
      const u = new URL(t.url ?? '');
      if (u.protocol === 'http:' || u.protocol === 'https:') {
        domains.add(u.hostname.replace(/^www\./, ''));
      }
    } catch {
      // skip unparseable / special pages
    }
  }
  return [...domains].sort();
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
  const [openDomains, setOpenDomains] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    getSettings().then((s) => {
      setIdleMinutes(s.idleMinutes);
      setDomainsText(s.excludedDomains.join('\n'));
      setLoaded(true);
    });
    openTabDomains().then(setOpenDomains);
  }, []);

  function saveIdle(value: number) {
    setIdleMinutes(value);
    setSettings({ idleMinutes: value });
  }

  function saveDomains(text: string) {
    setDomainsText(text);
    setSettings({ excludedDomains: parseDomains(text) });
  }

  function addDomain(domain: string) {
    saveDomains([...parseDomains(domainsText), domain].join('\n'));
  }

  if (!loaded) return null;

  const excluded = new Set(parseDomains(domainsText));
  const candidates = openDomains.filter((d) => !excluded.has(d));

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>TabSwap Settings</h1>
      </header>

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
        {candidates.length > 0 && (
          <div className={styles.chips}>
            {candidates.map((domain) => (
              <button
                key={domain}
                className={styles.button}
                onClick={() => addDomain(domain)}
              >
                <Plus size={12} weight="bold" />
                {domain}
              </button>
            ))}
          </div>
        )}
        <p className={styles.hint}>
          A Tab is never auto-slept if its domain equals or is a subdomain of a
          listed domain. Click an open tab&apos;s domain above to add it.
        </p>
      </section>
    </main>
  );
}
