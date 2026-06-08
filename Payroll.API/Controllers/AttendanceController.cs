using Microsoft.AspNetCore.Mvc;
using Payroll.API.DTOs;
using Payroll.API.Services;

namespace Payroll.API.Controllers
{
    [ApiController]
    [Route("api/attendance")]
    public class AttendanceController : Controller
    {
        private readonly IAttendanceService _service;

        public AttendanceController(IAttendanceService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult>Get()
        {
            return Ok(await _service.GetAll());
        }

        [HttpGet("{month}/{year}")]
        public async Task<IActionResult>Get(int month,int year)
        {
            return Ok(await _service.GetByMonth(month,year));
        }

        [HttpPost]
        public async Task<IActionResult>Add(AttendanceDto dto)
        {
            await _service.Add(dto);

            return Ok();
        }
    }
}
