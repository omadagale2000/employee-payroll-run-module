using Payroll.API.DTOs;
using Payroll.API.Models;

namespace Payroll.API.Services
{
    public interface IAttendanceService
    {
        Task Add(AttendanceDto dto);

        Task<IEnumerable<Attendance>> GetByMonth(int month, int year);
    }
}
