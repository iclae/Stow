import { Undo2 } from 'lucide-react';
import { runUndo, useUndoToast } from '../undo/undoStore';
import styles from './UndoToast.module.css';

export function UndoToast() {
  const toast = useUndoToast();
  if (!toast) return null;

  return (
    <div className={styles.toast} role="status">
      <span className={styles.message} title={toast.message}>
        {toast.message}
      </span>
      <button className={styles.undo} onClick={runUndo}>
        <Undo2 size={13} />
        Undo
      </button>
    </div>
  );
}
