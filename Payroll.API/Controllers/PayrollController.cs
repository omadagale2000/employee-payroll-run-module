using Microsoft.AspNetCore.Mvc;
using Payroll.API.DTOs;
using Payroll.API.Services;

namespace Payroll.API.Controllers
{
    [ApiController]

    [Route("api/payroll")]
    public class PayrollController : ControllerBase
    {
        private readonly IPayrollService _service;

        public PayrollController(IPayrollService service)
        {
            _service = service;
        }

        [HttpPost("run")]
        public async Task<IActionResult> Run(RunPayrollRequest request)
        {
            try
            {
                await _service.RunPayroll(request.Month, request.Year);
                return Created("", "Payroll Generated");
            }

            catch
            {
                return Conflict("Payroll Exists");
            }
        }

        [HttpGet("{month}/{year}")]

        public async Task<IActionResult>Get(int month,int year)
        {
            var data =await _service.GetPayroll(month,year);

            if (!data.Any()) return NotFound();

            return Ok(data);
        }

        [HttpGet("{runId}/slip/{employeeId}")]

        public async Task<IActionResult>Slip(int runId,int employeeId)
        {
            var result =await _service.GetSlip(runId,employeeId);

            if (result == null)return NotFound();

            return Ok(result);
        }
    }
}
