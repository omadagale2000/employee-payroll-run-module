namespace Payroll.API.Services
{
    /// <summary>
    /// Pure, stateless net-pay calculation logic mirroring usp_RunPayroll exactly.
    ///
    /// Formula (from stored procedure)
    /// --------------------------------
    ///   GrossPay        = (BasicSalary / WorkingDays) × DaysPresent
    ///   PFDeduction     = BasicSalary × 12%
    ///   ProfessionalTax = ₹200 (flat)
    ///   NetPay          = GrossPay − PFDeduction − ProfessionalTax
    /// </summary>
    public static class PayrollCalculator
    {
        /// <summary>PF rate applied to basic salary.</summary>
        public const decimal PfRate = 0.12m;

        /// <summary>Flat professional tax amount (matches stored procedure).</summary>
        public const decimal FlatProfessionalTax = 200m;

        /// <summary>
        /// Calculates prorated gross pay.
        /// Formula: (BasicSalary / WorkingDays) × DaysPresent
        /// </summary>
        public static decimal GetGrossPay(decimal basicSalary, int daysPresent, int workingDays)
        {
            if (workingDays <= 0)
                throw new ArgumentOutOfRangeException(nameof(workingDays), "Working days must be greater than zero.");
            if (daysPresent < 0)
                throw new ArgumentOutOfRangeException(nameof(daysPresent), "Days present cannot be negative.");
            if (daysPresent > workingDays)
                throw new ArgumentOutOfRangeException(nameof(daysPresent), "Days present cannot exceed working days.");

            return Math.Round(basicSalary / workingDays * daysPresent, 2);
        }

        /// <summary>
        /// Calculates PF deduction as 12% of basic salary (not gross pay).
        /// </summary>
        public static decimal GetPFDeduction(decimal basicSalary)
            => Math.Round(basicSalary * PfRate, 2);

        /// <summary>
        /// Returns the flat professional tax of ₹200 (matches stored procedure).
        /// </summary>
        public static decimal GetProfessionalTax()
            => FlatProfessionalTax;

        /// <summary>
        /// Full net-pay calculation end-to-end.
        /// Returns a value tuple with every intermediate figure.
        /// </summary>
        public static (decimal GrossPay, decimal PFDeduction, decimal ProfessionalTax, decimal NetPay)
            Calculate(decimal basicSalary, int daysPresent, int workingDays)
        {
            var gross = GetGrossPay(basicSalary, daysPresent, workingDays);
            var pf    = GetPFDeduction(basicSalary);
            var pt    = GetProfessionalTax();
            var net   = Math.Round(gross - pf - pt, 2);
            return (gross, pf, pt, net);
        }
    }
}
