import { useState, useEffect, useRef } from 'react';
import styles from './AddAttendanceModal.module.css';
import { MONTHS, YEARS, currentYear } from '../utils/dateConstants';

const EMPTY_FORM = {
  employeeId: '',
  month: new Date().getMonth() + 1,
  year: currentYear,
  workingDays: '',
  daysPresent: '',
};

export default function AddAttendanceModal({ employees, empLoading, onSubmit, onClose, submitting }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const overlayRef = useRef(null);

  // Close on Escape
  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose(); }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  function handleOverlayClick(e) {
    if (e.target === overlayRef.current) onClose();
  }

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  }

  function validate() {
    const errs = {};
    if (!form.employeeId) errs.employeeId = 'Select an employee';
    const wd = Number(form.workingDays);
    const dp = Number(form.daysPresent);
    if (!form.workingDays || isNaN(wd) || wd < 1) errs.workingDays = 'Enter a valid number';
    if (form.daysPresent === '' || isNaN(dp) || dp < 0) errs.daysPresent = 'Enter a valid number';
    if (!errs.workingDays && !errs.daysPresent && dp > wd) {
      errs.daysPresent = 'Cannot exceed working days';
    }
    return errs;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    onSubmit({
      employeeId: Number(form.employeeId),
      month: Number(form.month),
      year: Number(form.year),
      workingDays: Number(form.workingDays),
      daysPresent: Number(form.daysPresent),
    });
  }

  return (
    <div
      className={styles.overlay}
      ref={overlayRef}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-label="Add Attendance"
    >
      <div className={styles.modal}>
        <div className={styles.header}>
          <div>
            <h2 className={styles.title}>Add Attendance</h2>
            <p className={styles.subtitle}>Record attendance for an employee</p>
          </div>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">✕</button>
        </div>

        <form className={styles.body} onSubmit={handleSubmit} noValidate>

          {/* Employee */}
          <div className={styles.field}>
            <label htmlFor="add-emp" className={styles.label}>Employee</label>
            {empLoading ? (
              <div className={styles.loadingSelect}>Loading employees...</div>
            ) : (
              <select
                id="add-emp"
                className={`${styles.select} ${errors.employeeId ? styles.invalid : ''}`}
                value={form.employeeId}
                onChange={(e) => set('employeeId', e.target.value)}
                disabled={submitting}
              >
                <option value="">— Select employee —</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    #{emp.id} — {emp.name}
                  </option>
                ))}
              </select>
            )}
            {errors.employeeId && <span className={styles.error}>{errors.employeeId}</span>}
          </div>

          {/* Month + Year row */}
          <div className={styles.row}>
            <div className={styles.field}>
              <label htmlFor="add-month" className={styles.label}>Month</label>
              <select
                id="add-month"
                className={styles.select}
                value={form.month}
                onChange={(e) => set('month', e.target.value)}
                disabled={submitting}
              >
                {MONTHS.map((m) => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </select>
            </div>

            <div className={styles.field}>
              <label htmlFor="add-year" className={styles.label}>Year</label>
              <select
                id="add-year"
                className={styles.select}
                value={form.year}
                onChange={(e) => set('year', e.target.value)}
                disabled={submitting}
              >
                {YEARS.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Working Days + Days Present row */}
          <div className={styles.row}>
            <div className={styles.field}>
              <label htmlFor="add-wd" className={styles.label}>Working Days</label>
              <input
                id="add-wd"
                type="number"
                min="1"
                max="31"
                className={`${styles.input} ${errors.workingDays ? styles.invalid : ''}`}
                placeholder="e.g. 26"
                value={form.workingDays}
                onChange={(e) => set('workingDays', e.target.value)}
                disabled={submitting}
              />
              {errors.workingDays && <span className={styles.error}>{errors.workingDays}</span>}
            </div>

            <div className={styles.field}>
              <label htmlFor="add-dp" className={styles.label}>Days Present</label>
              <input
                id="add-dp"
                type="number"
                min="0"
                max="31"
                className={`${styles.input} ${errors.daysPresent ? styles.invalid : ''}`}
                placeholder="e.g. 24"
                value={form.daysPresent}
                onChange={(e) => set('daysPresent', e.target.value)}
                disabled={submitting}
              />
              {errors.daysPresent && <span className={styles.error}>{errors.daysPresent}</span>}
            </div>
          </div>

          <div className={styles.footer}>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </button>
            <button type="submit" className={styles.submitBtn} disabled={submitting}>
              {submitting ? (
                <><span className={styles.spinner} aria-hidden="true" /> Saving...</>
              ) : (
                'Save Attendance'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
