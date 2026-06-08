namespace Payroll.API.Models
{
    public class PayrollResult
    {
        public int EmployeeId { get; set; }

        public string Name { get; set; }

        public decimal BasicSalary { get; set; }

        public int WorkingDays { get; set; }

        public int DaysPresent { get; set; }

        public decimal GrossPay { get; set; }

        public decimal PFDeduction { get; set; }

        public decimal ProfessionalTax { get; set; }

        public decimal NetPay { get; set; }
    }
}
