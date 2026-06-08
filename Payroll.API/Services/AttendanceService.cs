using Payroll.API.DTOs;
using Payroll.API.Models;
using Payroll.API.Repositories;

namespace Payroll.API.Services
{
    public class AttendanceService : IAttendanceService
    {
        private readonly IAttendanceRepository _repo;

        public AttendanceService(IAttendanceRepository repo)
        {
            _repo = repo;
        }

        public async Task Add(AttendanceDto dto)
        {
            if (dto.DaysPresent > dto.WorkingDays)
            {
                throw new Exception("Invalid attendance");
            }

            await _repo.Add(dto);
        }

        public async Task<IEnumerable<Attendance>> GetByMonth(int month, int year)
        {
            return await _repo.GetByMonth(month,year);
        }
    }
}
