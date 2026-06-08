using Dapper;
using Microsoft.Data.SqlClient;
using Payroll.API.DTOs;
using Payroll.API.Models;

namespace Payroll.API.Repositories
{
    public class AttendanceRepository : IAttendanceRepository
    {
        private readonly IConfiguration _config;

        public AttendanceRepository(IConfiguration config)
        {
            _config = config;
        }

        public async Task<IEnumerable<Attendance>>GetAll()
        {
            using var conn =new SqlConnection(_config.GetConnectionString("DefaultConnection"));

            return await conn.QueryAsync<Attendance>("SELECT * FROM Attendance");
        }

        public async Task<IEnumerable<Attendance>>GetByMonth(int month,int year)
        {
            using var conn =new SqlConnection(_config.GetConnectionString("DefaultConnection"));

            var sql = @"
                        SELECT * FROM Attendance
                        WHERE
                        Month=@month
                        AND Year=@year";

            return await conn.QueryAsync<Attendance>(sql,new{month,year});
        }

        public async Task Add(AttendanceDto dto)
        {
            using var conn =new SqlConnection(_config.GetConnectionString("DefaultConnection"));

            var sql = @"
                        INSERT INTO Attendance (EmployeeId,Month,Year,WorkingDays,DaysPresent)
                        VALUES (@EmployeeId,@Month,@Year,@WorkingDays,@DaysPresent)";

            await conn.ExecuteAsync(sql,dto);
        }
    }
}
