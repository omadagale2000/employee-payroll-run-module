import { useState, useCallback } from 'react';
import AttendanceFilter from '../components/AttendanceFilter';
import AttendanceTable from '../components/AttendanceTable';
import AddAttendanceModal from '../components/AddAttendanceModal';
import Toast from '../components/Toast';
import { getAttendanceByMonth, addAttendance, getEmployees } from '../services/attendanceApi';
import styles from './AttendanceDashboard.module.css';

export default function AttendanceDashboard() {
  // Table state
  const [records, setRecords] = useState([]);
  const [tableLoading, setTableLoading] = useState(false);
  const [tableError, setTableError] = useState(null);
  const [searched, setSearched] = useState(false);
  const [currentPeriod, setCurrentPeriod] = useState(null);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Employees for modal dropdown
  const [employees, setEmployees] = useState([]);
  const [empLoading, setEmpLoading] = useState(false);

  // Toast
  const [toast, setToast] = useState(null);

  const loadRecords = useCallback(async (month, year) => {
    setTableLoading(true);
    setTableError(null);
    try {
      const data = await getAttendanceByMonth(month, year);
      setRecords(data);
      setSearched(true);
    } catch (err) {
      setTableError(err.message);
      setRecords([]);
    } finally {
      setTableLoading(false);
    }
  }, []);

  function handleSearch(month, year) {
    setCurrentPeriod({ month, year });
    loadRecords(month, year);
  }

  function handleRetry() {
    if (currentPeriod) loadRecords(currentPeriod.month, currentPeriod.year);
  }

  // Open modal — fetch employees lazily
  async function handleOpenModal() {
    setShowModal(true);
    if (employees.length === 0) {
      setEmpLoading(true);
      try {
        const data = await getEmployees();
        setEmployees(data);
      } catch {
        setToast({ type: 'error', message: 'Could not load employees. Please try again.' });
        setShowModal(false);
      } finally {
        setEmpLoading(false);
      }
    }
  }

  async function handleAddSubmit(payload) {
    setSubmitting(true);
    try {
      await addAttendance(payload);
      setToast({ type: 'success', message: 'Attendance record added successfully.' });
      setShowModal(false);
      // Refresh table if we're currently viewing the same period
      if (
        currentPeriod &&
        currentPeriod.month === payload.month &&
        currentPeriod.year === payload.year
      ) {
        loadRecords(payload.month, payload.year);
      }
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Failed to save attendance.' });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.content}>
        {/* Top bar: filter + add button */}
        <div className={styles.topBar}>
          <div className={styles.filterWrap}>
            <AttendanceFilter onSearch={handleSearch} loading={tableLoading} />
          </div>
          <button className={styles.addBtn} onClick={handleOpenModal}>
            + Add Attendance
          </button>
        </div>

        {/* Table */}
        <AttendanceTable
          data={records}
          loading={tableLoading}
          error={tableError}
          onRetry={handleRetry}
          searched={searched}
        />
      </div>

      {showModal && (
        <AddAttendanceModal
          employees={employees}
          empLoading={empLoading}
          onSubmit={handleAddSubmit}
          onClose={() => setShowModal(false)}
          submitting={submitting}
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
