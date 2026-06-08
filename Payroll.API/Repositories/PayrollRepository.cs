using Dapper;
using Microsoft.Data.SqlClient;
using Payroll.API.DTOs;
using System.Data;

namespace Payroll.API.Repositories
{
    public class PayrollRepository : IPayrollRepository
    {
        private readonly IConfiguration _config;

        public PayrollRepository(IConfiguration config)
        {
            _config = config;
        }

        public async Task RunPayroll(int month,int year)
        {
            using var conn =
            new SqlConnection(_config.GetConnectionString("DefaultConnection"));

            await conn.ExecuteAsync(
                "usp_RunPayroll",

                new
                {
                    Month = month,
                    Year = year
                },

                commandType:
                CommandType.StoredProcedure
            );
        }

        public async Task<bool>Exists(int month,int year)
        {
            using var conn =new SqlConnection(_config.GetConnectionString("DefaultConnection"));

            var sql = @"
                        SELECT COUNT(*)
                        FROM PayrollRun
                        WHERE Month=@month
                        AND Year=@year";

            return await conn.ExecuteScalarAsync<int>(sql,new { month, year }) > 0;
        }

        public async Task<IEnumerable<PayrollResponseDto>>GetPayroll(int month,int year)
        {
            using var conn = new SqlConnection(_config.GetConnectionString("DefaultConnection"));

            var sql = @"
                        SELECT

                        pr.Id AS RunId,
                        e.Id AS EmployeeId,
                        e.Name,
                        e.BasicSalary,

                        d.Id AS DepartmentId,
                        d.Name AS DepartmentName,

                        a.WorkingDays,
                        a.DaysPresent,

                        pd.GrossPay,
                        pd.PFDeduction,
                        pd.ProfessionalTax,
                        pd.NetPay

                        FROM PayrollDetails pd

                        JOIN Employees e
                        ON e.Id = pd.EmployeeId

                        JOIN Departments d
                        ON d.Id = e.DepartmentId

                        JOIN PayrollRun pr
                        ON pr.Id = pd.PayrollRunId

                        JOIN Attendance a
                        ON a.EmployeeId = e.Id
                        AND a.Month = pr.Month
                        AND a.Year = pr.Year

                        WHERE
                        pr.Month = @month
                        AND pr.Year = @year";

            return await conn.QueryAsync<PayrollResponseDto>(sql,new { month, year });
        }

        public async Task<PayrollResponseDto?>GetSlip(int runId,int employeeId)
        {
            using var conn =new SqlConnection(_config.GetConnectionString("DefaultConnection"));

            var sql = @"
                        SELECT TOP 1

                        pr.Id AS RunId,
                        e.Id AS EmployeeId,
                        e.Name,
                        e.BasicSalary,

                        d.Id AS DepartmentId,
                        d.Name AS DepartmentName,

                        a.WorkingDays,
                        a.DaysPresent,

                        pd.GrossPay,
                        pd.PFDeduction,
                        pd.ProfessionalTax,
                        pd.NetPay

                        FROM PayrollDetails pd

                        JOIN Employees e
                        ON e.Id = pd.EmployeeId

                        JOIN Departments d
                        ON d.Id = e.DepartmentId

                        JOIN PayrollRun pr
                        ON pr.Id = pd.PayrollRunId

                        JOIN Attendance a
                        ON a.EmployeeId = e.Id
                        AND a.Month = pr.Month
                        AND a.Year = pr.Year

                        WHERE
                        pd.PayrollRunId = @runId
                        AND pd.EmployeeId = @employeeId";

            return await conn.QueryFirstOrDefaultAsync<PayrollResponseDto>(
                sql,
                new
                {
                    runId,
                    employeeId
                }
            );
        }
    }
}
