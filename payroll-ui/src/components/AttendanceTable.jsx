import styles from './AttendanceTable.module.css';

function SkeletonRow() {
  return (
    <tr className={styles.skeletonRow}>
      {Array.from({ length: 5 }).map((_, i) => (
        <td key={i}><span className={styles.skeletonCell} /></td>
      ))}
    </tr>
  );
}

function AttendanceBadge({ present, working }) {
  const pct = working > 0 ? Math.round((present / working) * 100) : 0;
  const color = pct >= 90 ? styles.good : pct >= 75 ? styles.ok : styles.low;
  return (
    <span className={`${styles.badge} ${color}`}>{pct}%</span>
  );
}

export default function AttendanceTable({ data, loading, error, onRetry, searched }) {
  if (loading) {
    return (
      <div className={styles.tableCard}>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead><TableHead /></thead>
            <tbody>
              {Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.tableCard}>
        <div className={styles.stateBox}>
          <span className={styles.stateIcon}>⚠</span>
          <p className={styles.stateTitle}>Failed to load attendance</p>
          <p className={styles.stateMsg}>{error}</p>
          {onRetry && (
            <button className={styles.retryBtn} onClick={onRetry}>Retry</button>
          )}
        </div>
      </div>
    );
  }

  if (!searched) {
    return (
      <div className={styles.tableCard}>
        <div className={styles.stateBox}>
          <span className={styles.stateIcon}>📅</span>
          <p className={styles.stateTitle}>Select a period to view attendance</p>
          <p className={styles.stateMsg}>
            Choose a month and year above, then click "View Records".
          </p>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className={styles.tableCard}>
        <div className={styles.stateBox}>
          <span className={styles.stateIcon}>📋</span>
          <p className={styles.stateTitle}>No attendance records found</p>
          <p className={styles.stateMsg}>
            No records for this period. Use the form above to add entries.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.tableCard}>
      <div className={styles.tableHeader}>
        <h2 className={styles.tableTitle}>Attendance Records</h2>
        <span className={styles.badge2}>{data.length} employees</span>
      </div>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead><TableHead /></thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.id} className={styles.row}>
                <td className={styles.idCell}>{row.employeeId}</td>
                <td className={styles.numCell}>{row.month}</td>
                <td className={styles.numCell}>{row.year}</td>
                <td className={styles.numCell}>{row.workingDays}</td>
                <td className={styles.numCell}>{row.daysPresent}</td>
                <td>
                  <AttendanceBadge present={row.daysPresent} working={row.workingDays} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TableHead() {
  return (
    <tr>
      <th>Employee ID</th>
      <th>Month</th>
      <th>Year</th>
      <th>Working Days</th>
      <th>Days Present</th>
      <th>Attendance %</th>
    </tr>
  );
}
