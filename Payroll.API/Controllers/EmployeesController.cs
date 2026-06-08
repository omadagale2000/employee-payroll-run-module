using Microsoft.AspNetCore.Mvc;
using Payroll.API.Repositories;

namespace Payroll.API.Controllers
{
    [ApiController]
    [Route("api/employees")]

    public class EmployeesController : ControllerBase
    {
        private readonly IEmployeeRepository _repo;

        public EmployeesController(IEmployeeRepository repo)
        {
            _repo = repo;
        }

        [HttpGet]
        public async Task<IActionResult>Get()
        {
            return Ok(await _repo.GetEmployees());
        }
    }
}
