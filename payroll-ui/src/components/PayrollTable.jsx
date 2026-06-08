import styles from './PayrollTable.module.css';

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

function SkeletonRow() {
  return (
    <tr className={styles.skeletonRow}>
      {Array.from({ length: 10 }).map((_, i) => (
        <td key={i}>
          <span className={styles.skeletonCell} />
        </td>
      ))}
    </tr>
  );
}

export default function PayrollTable({ data, loading, onViewSlip, onRetry, error }) {
  if (loading) {
    return (
      <div className={styles.tableCard}>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <TableHead />
            </thead>
            <tbody>
              {Array.from({ length: 5 }).map((_, i) => (
                <SkeletonRow key={i} />
              ))}
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
          <p className={styles.stateTitle}>Failed to load payroll data</p>
          <p className={styles.stateMsg}>{error}</p>
          {onRetry && (
            <button className={styles.retryBtn} onClick={onRetry}>
              Retry
            </button>
          )}
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className={styles.tableCard}>
        <div className={styles.stateBox}>
          <span className={styles.stateIcon}>📋</span>
          <p className={styles.stateTitle}>No payroll generated yet</p>
          <p className={styles.stateMsg}>
            Select a month and year above, then click "Run Payroll" to generate.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.tableCard}>
      <div className={styles.tableHeader}>
        <h2 className={styles.tableTitle}>Payroll Results</h2>
        <span className={styles.badge}>{data.length} employees</span>
      </div>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <TableHead />
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={`${row.runId}-${row.employeeId}`} className={styles.row}>
                <td className={styles.idCell}>{row.employeeId}</td>
                <td className={styles.nameCell}>{row.name}</td>
                <td>{formatCurrency(row.basicSalary)}</td>
                <td className={styles.numCell}>{row.workingDays}</td>
                <td className={styles.numCell}>{row.daysPresent}</td>
                <td className={styles.amountCell}>{formatCurrency(row.grossPay)}</td>
                <td className={styles.deductCell}>{formatCurrency(row.pfDeduction)}</td>
                <td className={styles.deductCell}>{formatCurrency(row.professionalTax)}</td>
                <td className={styles.netCell}>{formatCurrency(row.netPay)}</td>
                <td>
                  <button
                    className={styles.slipBtn}
                    onClick={() => onViewSlip(row.runId, row.employeeId)}
                  >
                    View Slip
                  </button>
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
      <th>Emp ID</th>
      <th>Name</th>
      <th>Basic Salary</th>
      <th>Working Days</th>
      <th>Days Present</th>
      <th>Gross Pay</th>
      <th>PF Deduction</th>
      <th>Professional Tax</th>
      <th>Net Pay</th>
      <th>Action</th>
    </tr>
  );
}
