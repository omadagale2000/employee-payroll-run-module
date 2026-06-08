import { useEffect, useRef } from 'react';
import styles from './PayslipModal.module.css';

const MONTHS = [
  '', 'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function PayslipModal({ slip, month, year, loading, error, onClose }) {
  const overlayRef = useRef(null);

  // Close on Escape key
  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  // Close when clicking the backdrop
  function handleOverlayClick(e) {
    if (e.target === overlayRef.current) onClose();
  }

  return (
    <div
      className={styles.overlay}
      ref={overlayRef}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-label="Payslip"
    >
      <div className={styles.modal}>
        {/* Modal header */}
        <div className={styles.modalHeader}>
          <div>
            <h2 className={styles.modalTitle}>Payslip</h2>
            {slip && (
              <p className={styles.modalSubtitle}>
                {MONTHS[month]} {year}
              </p>
            )}
          </div>
          <button
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close payslip"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className={styles.body}>
          {loading && (
            <div className={styles.centeredState}>
              <span className={styles.spinner} />
              <p>Loading payslip...</p>
            </div>
          )}

          {error && !loading && (
            <div className={styles.centeredState}>
              <span className={styles.errorIcon}>⚠</span>
              <p className={styles.errorMsg}>{error}</p>
            </div>
          )}

          {slip && !loading && !error && (
            <>
              {/* Employee info */}
              <div className={styles.employeeInfo}>
                <div className={styles.avatar}>{slip.name.charAt(0).toUpperCase()}</div>
                <div>
                  <p className={styles.empName}>{slip.name}</p>
                  <p className={styles.empId}>Employee #{slip.employeeId}</p>
                  {slip.departmentName && (
                    <p className={styles.empDept}>{slip.departmentName}</p>
                  )}
                </div>
              </div>

              {/* Period */}
              <div className={styles.period}>
                <span className={styles.periodLabel}>Pay Period</span>
                <span className={styles.periodValue}>
                  {MONTHS[month]} {year}
                </span>
              </div>

              {/* Attendance summary */}
              <div className={styles.attendanceSummary}>
                <div className={styles.attendanceItem}>
                  <span className={styles.attLabel}>Working Days</span>
                  <span className={styles.attValue}>{slip.workingDays}</span>
                </div>
                <div className={styles.attendanceItem}>
                  <span className={styles.attLabel}>Days Present</span>
                  <span className={styles.attValue}>{slip.daysPresent}</span>
                </div>
              </div>

              {/* Salary breakdown */}
              <div className={styles.section}>
                <p className={styles.sectionLabel}>Earnings</p>
                <div className={styles.row}>
                  <span>Basic Salary</span>
                  <span>{formatCurrency(slip.basicSalary)}</span>
                </div>
                <div className={`${styles.row} ${styles.grossRow}`}>
                  <span>Gross Pay</span>
                  <span>{formatCurrency(slip.grossPay)}</span>
                </div>
              </div>

              <div className={styles.section}>
                <p className={styles.sectionLabel}>Deductions</p>
                <div className={styles.row}>
                  <span>PF Deduction</span>
                  <span className={styles.deductAmt}>
                    − {formatCurrency(slip.pfDeduction)}
                  </span>
                </div>
                <div className={styles.row}>
                  <span>Professional Tax</span>
                  <span className={styles.deductAmt}>
                    − {formatCurrency(slip.professionalTax)}
                  </span>
                </div>
              </div>

              <div className={styles.netPayRow}>
                <span>Net Pay</span>
                <span className={styles.netAmt}>{formatCurrency(slip.netPay)}</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
