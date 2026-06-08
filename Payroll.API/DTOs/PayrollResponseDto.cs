namespace Payroll.API.DTOs
{
    public class PayrollResponseDto
    {
        public int EmployeeId { get; set; }

        public string Name { get; set; }

        public decimal BasicSalary { get; set; }

        public int WorkingDays { get; set; }

        public int DaysPresent { get; set; }

        public int DepartmentId { get; set; }

        public string DepartmentName { get; set; }

        public decimal GrossPay { get; set; }

        public decimal PFDeduction { get; set; }

        public decimal ProfessionalTax { get; set; }

        public decimal NetPay { get; set; }
    }
}
