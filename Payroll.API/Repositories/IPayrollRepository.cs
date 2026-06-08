using Payroll.API.DTOs;

namespace Payroll.API.Repositories
{
    public interface IPayrollRepository
    {
        Task RunPayroll(int month,int year);

        Task<bool> Exists(int month,int year);

        Task<IEnumerable<PayrollResponseDto>>GetPayroll(int month,int year);

        Task<PayrollResponseDto?>GetSlip(int runId,int employeeId);
    }
}
