import { useState, useCallback } from 'react';
import PayrollForm from '../components/PayrollForm';
import PayrollTable from '../components/PayrollTable';
import PayslipModal from '../components/PayslipModal';
import Toast from '../components/Toast';
import { runPayroll, getPayroll, getPayslip } from '../services/payrollApi';
import { MONTH_NAMES } from '../utils/dateConstants';
import styles from './PayrollDashboard.module.css';

export default function PayrollDashboard() {
  // Payroll table state
  const [tableData, setTableData] = useState([]);
  const [tableLoading, setTableLoading] = useState(false);
  const [tableError, setTableError] = useState(null);

  // Run payroll state
  const [runLoading, setRunLoading] = useState(false);

  // Track current month/year so we can reload after run
  const [currentPeriod, setCurrentPeriod] = useState(null);

  // Modal state
  const [modal, setModal] = useState({ open: false, slip: null, loading: false, error: null });

  // Toast state
  const [toast, setToast] = useState(null);

  // Load payroll data for a period
  const loadPayroll = useCallback(async (month, year) => {
    setTableLoading(true);
    setTableError(null);
    try {
      const data = await getPayroll(month, year);
      setTableData(data);
    } catch (err) {
      setTableError(err.message);
      setTableData([]);
    } finally {
      setTableLoading(false);
    }
  }, []);

  // Handle "Run Payroll" form submit
  async function handleRun(month, year) {
    setRunLoading(true);
    setCurrentPeriod({ month, year });
    try {
      await runPayroll(month, year);
      setToast({ type: 'success', message: `Payroll for ${MONTH_NAMES[month]} ${year} generated successfully.` });
      await loadPayroll(month, year);
    } catch (err) {
      const msg = err.message.toLowerCase();
      if (msg.includes('payroll exists') || msg.includes('conflict')) {
        setToast({ type: 'error', message: `Payroll for ${MONTH_NAMES[month]} ${year} already exists.` });
        // Still load the existing data
        await loadPayroll(month, year);
      } else {
        setToast({ type: 'error', message: err.message || 'Failed to run payroll.' });
      }
    } finally {
      setRunLoading(false);
    }
  }

  // Handle "View Slip"
  async function handleViewSlip(runId, employeeId) {
    setModal({ open: true, slip: null, loading: true, error: null });
    try {
      const slip = await getPayslip(runId, employeeId);
      setModal({ open: true, slip, loading: false, error: null });
    } catch (err) {
      setModal({ open: true, slip: null, loading: false, error: err.message });
    }
  }

  function handleCloseModal() {
    setModal({ open: false, slip: null, loading: false, error: null });
  }

  function handleRetry() {
    if (currentPeriod) {
      loadPayroll(currentPeriod.month, currentPeriod.year);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <PayrollForm onRun={handleRun} loading={runLoading} />

        <div className={styles.tableSection}>
          <PayrollTable
            data={tableData}
            loading={tableLoading}
            error={tableError}
            onViewSlip={handleViewSlip}
            onRetry={handleRetry}
          />
        </div>
      </div>

      {modal.open && (
        <PayslipModal
          slip={modal.slip}
          month={currentPeriod?.month}
          year={currentPeriod?.year}
          loading={modal.loading}
          error={modal.error}
          onClose={handleCloseModal}
        />
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
