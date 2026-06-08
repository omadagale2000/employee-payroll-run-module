using Payroll.API.DTOs;
using Payroll.API.Models;

namespace Payroll.API.Repositories
{
    public interface IAttendanceRepository
    {
        Task<IEnumerable<Attendance>> GetByMonth(int month, int year);

        Task Add(AttendanceDto dto);
    }
}
