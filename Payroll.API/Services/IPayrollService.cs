using Payroll.API.DTOs;

namespace Payroll.API.Services
{
    public interface IPayrollService
    {
        Task RunPayroll(int month,int year);

        Task<IEnumerable<PayrollResponseDto>>GetPayroll(int month,int year);

        Task<PayrollResponseDto?>GetSlip(int runId,int employeeId);
    }
}
