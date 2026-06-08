import { useState } from 'react';
import styles from './AttendanceFilter.module.css';
import { MONTHS, YEARS, currentYear } from '../utils/dateConstants';

export default function AttendanceFilter({ onSearch, loading }) {
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(currentYear);

  function handleSubmit(e) {
    e.preventDefault();
    onSearch(month, year);
  }

  return (
    <div className={styles.card}>
      <h2 className={styles.cardTitle}>View Attendance</h2>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label htmlFor="att-month" className={styles.label}>Month</label>
          <select
            id="att-month"
            className={styles.select}
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            disabled={loading}
          >
            {MONTHS.map((m) => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <label htmlFor="att-year" className={styles.label}>Year</label>
          <select
            id="att-year"
            className={styles.select}
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            disabled={loading}
          >
            {YEARS.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

        <button type="submit" className={styles.searchBtn} disabled={loading}>
          {loading ? (
            <><span className={styles.spinner} aria-hidden="true" /> Loading...</>
          ) : (
            'View Records'
          )}
        </button>
      </form>
    </div>
  );
}
