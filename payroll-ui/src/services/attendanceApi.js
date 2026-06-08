const BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * GET /api/attendance/{month}/{year}
 * Fetch attendance records for a specific month and year.
 */
export async function getAttendanceByMonth(month, year) {
  const res = await fetch(`${BASE_URL}/api/attendance/${month}/${year}`);

  if (!res.ok) {
    throw new Error(`Failed to fetch attendance: ${res.status}`);
  }

  return res.json();
}

/**
 * POST /api/attendance
 * Add a new attendance record.
 * Body: { employeeId, month, year, workingDays, daysPresent }
 */
export async function addAttendance(data) {
  const res = await fetch(`${BASE_URL}/api/attendance`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Failed to add attendance: ${res.status}`);
  }
}

/**
 * GET /api/employees
 * Fetch all employees (used for the Add Attendance form dropdown).
 */
export async function getEmployees() {
  const res = await fetch(`${BASE_URL}/api/employees`);

  if (!res.ok) {
    throw new Error(`Failed to fetch employees: ${res.status}`);
  }

  return res.json();
}
