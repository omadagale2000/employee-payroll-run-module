using Payroll.API.Services;

namespace Payroll.Tests;

/// <summary>
/// Tests for PayrollCalculator, which mirrors usp_RunPayroll exactly:
///
///   GrossPay        = (BasicSalary / WorkingDays) × DaysPresent
///   PFDeduction     = BasicSalary × 12%          ← on basic, NOT gross
///   ProfessionalTax = ₹200 flat                  ← no slabs
///   NetPay          = GrossPay − PFDeduction − ProfessionalTax
/// </summary>
public class PayrollCalculatorTests
{
    // ──────────────────────────────────────────────────────────────
    // GetGrossPay
    // ──────────────────────────────────────────────────────────────

    [Fact]
    public void GetGrossPay_FullAttendance_ReturnsFullBasicSalary()
    {
        // 26/26 days → gross == basic
        var result = PayrollCalculator.GetGrossPay(30_000m, 26, 26);
        Assert.Equal(30_000m, result);
    }

    [Fact]
    public void GetGrossPay_HalfAttendance_ReturnsHalfBasicSalary()
    {
        var result = PayrollCalculator.GetGrossPay(30_000m, 13, 26);
        Assert.Equal(15_000m, result);
    }

    [Fact]
    public void GetGrossPay_ZeroDaysPresent_ReturnsZero()
    {
        var result = PayrollCalculator.GetGrossPay(30_000m, 0, 26);
        Assert.Equal(0m, result);
    }

    [Theory]
    [InlineData(30_000, 26, 26, 30_000.00)]   // full attendance
    [InlineData(30_000, 20, 26, 23_076.92)]   // (30000/26)*20, rounded
    [InlineData(50_000, 23, 26, 44_230.77)]   // (50000/26)*23, rounded
    [InlineData(15_000, 15, 30,  7_500.00)]   // (15000/30)*15
    [InlineData(25_000, 25, 25, 25_000.00)]   // full attendance different working-days
    public void GetGrossPay_VariousInputs_MatchesStoredProcFormula(
        decimal basic, int present, int working, decimal expected)
    {
        Assert.Equal(expected, PayrollCalculator.GetGrossPay(basic, present, working));
    }

    [Fact]
    public void GetGrossPay_ZeroWorkingDays_ThrowsArgumentOutOfRangeException()
    {
        Assert.Throws<ArgumentOutOfRangeException>(
            () => PayrollCalculator.GetGrossPay(30_000m, 0, 0));
    }

    [Fact]
    public void GetGrossPay_NegativeDaysPresent_ThrowsArgumentOutOfRangeException()
    {
        Assert.Throws<ArgumentOutOfRangeException>(
            () => PayrollCalculator.GetGrossPay(30_000m, -1, 26));
    }

    [Fact]
    public void GetGrossPay_DaysPresentExceedsWorkingDays_ThrowsArgumentOutOfRangeException()
    {
        Assert.Throws<ArgumentOutOfRangeException>(
            () => PayrollCalculator.GetGrossPay(30_000m, 27, 26));
    }

    // ──────────────────────────────────────────────────────────────
    // GetPFDeduction  — 12% of BASIC SALARY (not gross)
    // ──────────────────────────────────────────────────────────────

    [Fact]
    public void GetPFDeduction_StandardBasic_Returns12PercentOfBasic()
    {
        // SP: e.BasicSalary * 0.12
        Assert.Equal(3_600m, PayrollCalculator.GetPFDeduction(30_000m));
    }

    [Fact]
    public void GetPFDeduction_ZeroBasic_ReturnsZero()
    {
        Assert.Equal(0m, PayrollCalculator.GetPFDeduction(0m));
    }

    [Theory]
    [InlineData(10_000,  1_200.00)]
    [InlineData(25_000,  3_000.00)]
    [InlineData(50_000,  6_000.00)]
    [InlineData(15_833,  1_899.96)]  // fractional basic, rounded to 2dp
    public void GetPFDeduction_VariousBasicSalaries_Returns12PercentRounded(
        decimal basic, decimal expected)
    {
        Assert.Equal(expected, PayrollCalculator.GetPFDeduction(basic));
    }

    [Fact]
    public void GetPFDeduction_IsIndependentOfAttendance()
    {
        // PF is the same whether the employee worked 10 days or 26 days
        var pfFullMonth   = PayrollCalculator.GetPFDeduction(30_000m);
        var pfPartialMonth = PayrollCalculator.GetPFDeduction(30_000m);
        Assert.Equal(pfFullMonth, pfPartialMonth);
    }

    // ──────────────────────────────────────────────────────────────
    // GetProfessionalTax  — flat ₹200 (no slabs)
    // ──────────────────────────────────────────────────────────────

    [Fact]
    public void GetProfessionalTax_AlwaysReturns200()
    {
        Assert.Equal(200m, PayrollCalculator.GetProfessionalTax());
    }

    [Fact]
    public void GetProfessionalTax_EqualsConstant()
    {
        Assert.Equal(PayrollCalculator.FlatProfessionalTax, PayrollCalculator.GetProfessionalTax());
    }

    // ──────────────────────────────────────────────────────────────
    // Calculate  — end-to-end, matching usp_RunPayroll exactly
    // ──────────────────────────────────────────────────────────────

    [Fact]
    public void Calculate_FullAttendance_AllFieldsCorrect()
    {
        // Basic 30,000 | 26/26 days
        // Gross = 30,000 | PF = 30,000×12% = 3,600 | PT = 200 | Net = 26,200
        var (gross, pf, pt, net) = PayrollCalculator.Calculate(30_000m, 26, 26);

        Assert.Equal(30_000m, gross);
        Assert.Equal( 3_600m, pf);
        Assert.Equal(   200m, pt);
        Assert.Equal(26_200m, net);
    }

    [Fact]
    public void Calculate_PartialAttendance_GrossIsProratedButPFIsFullBasic()
    {
        // Basic 30,000 | 13/26 days
        // Gross = 15,000 | PF = 30,000×12% = 3,600 | PT = 200 | Net = 11,200
        var (gross, pf, pt, net) = PayrollCalculator.Calculate(30_000m, 13, 26);

        Assert.Equal(15_000m, gross);
        Assert.Equal( 3_600m, pf);    // PF on FULL basic, not on prorated gross
        Assert.Equal(   200m, pt);
        Assert.Equal(11_200m, net);   // 15,000 - 3,600 - 200
    }

    [Fact]
    public void Calculate_ZeroDaysPresent_GrossIsZeroButPFAndPTStillApply()
    {
        // Absent the whole month: gross = 0, but PF and PT are still deducted
        // (matches the stored proc — no conditional logic)
        var (gross, pf, pt, net) = PayrollCalculator.Calculate(30_000m, 0, 26);

        Assert.Equal(     0m, gross);
        Assert.Equal( 3_600m, pf);
        Assert.Equal(   200m, pt);
        Assert.Equal(-3_800m, net);   // 0 - 3600 - 200
    }

    [Fact]
    public void Calculate_HighSalary_CorrectAllFields()
    {
        // Basic 50,000 | 23/26 days
        // Gross = (50000/26)*23 = 44,230.77
        // PF    = 50,000 * 12% = 6,000
        // PT    = 200
        // Net   = 44,230.77 - 6,000 - 200 = 38,030.77
        var (gross, pf, pt, net) = PayrollCalculator.Calculate(50_000m, 23, 26);

        Assert.Equal(44_230.77m, gross);
        Assert.Equal( 6_000m,    pf);
        Assert.Equal(   200m,    pt);
        Assert.Equal(38_030.77m, net);
    }

    [Fact]
    public void Calculate_NetPay_AlwaysEqualsGrossMinusPFMinusPT()
    {
        // Invariant: net == gross - pf - pt (rounded to 2dp)
        var (gross, pf, pt, net) = PayrollCalculator.Calculate(45_000m, 22, 26);
        Assert.Equal(Math.Round(gross - pf - pt, 2), net);
    }

    [Theory]
    [InlineData(20_000, 26, 26, 20_000.00, 2_400.00, 200, 17_400.00)]
    [InlineData(20_000, 13, 26, 10_000.00, 2_400.00, 200,  7_400.00)]
    [InlineData(40_000, 20, 25, 32_000.00, 4_800.00, 200, 27_000.00)]
    public void Calculate_TheoryMatrix_AllFieldsMatchStoredProcFormula(
        decimal basic, int present, int working,
        decimal expGross, decimal expPf, decimal expPt, decimal expNet)
    {
        var (gross, pf, pt, net) = PayrollCalculator.Calculate(basic, present, working);

        Assert.Equal(expGross, gross);
        Assert.Equal(expPf,    pf);
        Assert.Equal(expPt,    pt);
        Assert.Equal(expNet,   net);
    }
}
