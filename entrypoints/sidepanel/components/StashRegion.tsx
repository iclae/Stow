import styles from './StashRegion.module.css';

export function StashRegion() {
  return (
    <section className={styles.region}>
      <header className={styles.header}>
        <h2 className={styles.heading}>Stash</h2>
      </header>
      <p className={styles.empty}>Nothing stashed yet.</p>
    </section>
  );
}
