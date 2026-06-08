namespace Payroll.API.DTOs
{
    public class AttendanceDto
    {
        public int EmployeeId { get; set; }

        public int Month { get; set; }

        public int Year { get; set; }

        public int WorkingDays { get; set; }

        public int DaysPresent { get; set; }
    }
}
