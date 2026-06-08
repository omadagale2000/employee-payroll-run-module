import styles from './Header.module.css';

export default function Header({ activeTab, onTabChange }) {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        {/* Brand */}
        <div className={styles.brand}>
          <span className={styles.logo}>₹</span>
          <div>
            <h1 className={styles.title}>Payroll Run</h1>
            <p className={styles.subtitle}>HR Payroll Management</p>
          </div>
        </div>

        {/* Tabs */}
        <nav className={styles.tabs} aria-label="Main navigation">
          <button
            className={`${styles.tab} ${activeTab === 'payroll' ? styles.active : ''}`}
            onClick={() => onTabChange('payroll')}
          >
            <span className={styles.tabIcon}>💰</span>
            Payroll
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'attendance' ? styles.active : ''}`}
            onClick={() => onTabChange('attendance')}
          >
            <span className={styles.tabIcon}>📅</span>
            Attendance
          </button>
        </nav>
      </div>
    </header>
  );
}
