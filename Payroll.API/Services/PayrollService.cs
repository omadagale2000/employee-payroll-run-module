using Payroll.API.DTOs;
using Payroll.API.Repositories;

namespace Payroll.API.Services
{
    public class PayrollService : IPayrollService
    {
        private readonly IPayrollRepository _repository;

        public PayrollService(IPayrollRepository repository)
        {
            _repository = repository;
        }

        public async Task RunPayroll(int month,int year)
        {
            if (await _repository.Exists(month,year))
            {
                throw new Exception("Payroll already exists");
            }

            await _repository.RunPayroll(month,year);
        }

        public async Task<IEnumerable<PayrollResponseDto>>GetPayroll(int month,int year)
        {
            return await _repository.GetPayroll(month,year);
        }

        public async Task<PayrollResponseDto?>GetSlip(int runId,int employeeId)
        {
            return await _repository.GetSlip(runId,employeeId);
        }
    }
}
