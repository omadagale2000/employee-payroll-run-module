using Dapper;
using Microsoft.Data.SqlClient;
using Payroll.API.Models;

namespace Payroll.API.Repositories
{
    public class EmployeeRepository : IEmployeeRepository
    {
        private readonly IConfiguration _config;

        public EmployeeRepository(IConfiguration config)
        {
            _config = config;
        }

        public async Task<IEnumerable<Employee>>GetEmployees()
        {
            using var connection =
            new SqlConnection(_config.GetConnectionString("DefaultConnection"));

            return await connection.QueryAsync<Employee>("SELECT * FROM Employees");
        }
    }
}
