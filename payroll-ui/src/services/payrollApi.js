const BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * POST /api/payroll/run
 * Triggers payroll generation for a given month and year.
 */
export async function runPayroll(month, year) {
  const res = await fetch(`${BASE_URL}/api/payroll/run`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ month, year }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed with status ${res.status}`);
  }

  return res.text(); // returns "Payroll Generated"
}

/**
 * GET /api/payroll/{month}/{year}
 * Fetches all payroll records for a given month and year.
 */
export async function getPayroll(month, year) {
  const res = await fetch(`${BASE_URL}/api/payroll/${month}/${year}`);

  if (res.status === 404) return [];

  if (!res.ok) {
    throw new Error(`Failed to fetch payroll: ${res.status}`);
  }

  return res.json();
}

/**
 * GET /api/payroll/{runId}/slip/{employeeId}
 * Fetches the payslip for a specific employee in a payroll run.
 */
export async function getPayslip(runId, employeeId) {
  const res = await fetch(`${BASE_URL}/api/payroll/${runId}/slip/${employeeId}`);

  if (!res.ok) {
    throw new Error(`Failed to fetch payslip: ${res.status}`);
  }

  return res.json();
}
