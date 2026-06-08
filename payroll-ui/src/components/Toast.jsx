import { useEffect } from 'react';
import styles from './Toast.module.css';

/**
 * Toast notification component.
 * type: 'success' | 'error'
 * Auto-dismisses after `duration` ms (default 3500).
 */
export default function Toast({ message, type = 'success', onClose, duration = 3500 }) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div className={`${styles.toast} ${styles[type]}`} role="alert">
      <span className={styles.icon}>{type === 'success' ? '✓' : '✕'}</span>
      <span className={styles.msg}>{message}</span>
      <button className={styles.dismiss} onClick={onClose} aria-label="Dismiss">
        ✕
      </button>
    </div>
  );
}
