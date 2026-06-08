IF DB_ID('PayrollDB') IS NULL
BEGIN
    CREATE DATABASE PayrollDB
END
GO

USE PayrollDB
GO

CREATE TABLE Departments
(
    Id   INT IDENTITY PRIMARY KEY,
    Name NVARCHAR(100) NOT NULL
)

CREATE TABLE Employees
(
    Id           INT IDENTITY PRIMARY KEY,
    Name         NVARCHAR(200) NOT NULL,
    DepartmentId INT NOT NULL,
    BasicSalary  DECIMAL(18,2) NOT NULL,

    CONSTRAINT FK_Employee_Department
        FOREIGN KEY (DepartmentId)
        REFERENCES Departments(Id)
)

CREATE TABLE Attendance
(
    Id          INT IDENTITY PRIMARY KEY,
    EmployeeId  INT NOT NULL,
    [Month]     INT NOT NULL,
    [Year]      INT NOT NULL,
    WorkingDays INT NOT NULL,
    DaysPresent INT NOT NULL,

    FOREIGN KEY (EmployeeId)
        REFERENCES Employees(Id)
)

CREATE TABLE PayrollRun
(
    Id          INT IDENTITY PRIMARY KEY,
    [Month]     INT NOT NULL,
    [Year]      INT NOT NULL,
    CreatedAt   DATETIME DEFAULT GETDATE(),
    IsFinalized BIT DEFAULT 1,

    CONSTRAINT UQ_Payroll UNIQUE([Month], [Year])
)

CREATE TABLE PayrollDetails
(
    Id              INT IDENTITY PRIMARY KEY,
    PayrollRunId    INT,
    EmployeeId      INT,
    GrossPay        DECIMAL(18,2),
    PFDeduction     DECIMAL(18,2),
    ProfessionalTax DECIMAL(18,2),
    NetPay          DECIMAL(18,2),

    FOREIGN KEY (PayrollRunId)
        REFERENCES PayrollRun(Id),

    FOREIGN KEY (EmployeeId)
        REFERENCES Employees(Id)
)

INSERT INTO Departments (Name)
VALUES
    ('IT'),
    ('HR')

INSERT INTO Employees (Name, DepartmentId, BasicSalary)
VALUES
    ('Ravi Sharma', 1, 30000),
    ('Amit Joshi',  1, 40000),
    ('Priya Patil', 2, 35000),
    ('Sneha Rao',   2, 45000),
    ('Karan Shah',  1, 50000)

INSERT INTO Attendance (EmployeeId, [Month], [Year], WorkingDays, DaysPresent)
VALUES
    (1, 6, 2026, 26, 24),
    (2, 6, 2026, 26, 22),
    (3, 6, 2026, 26, 26),
    (4, 6, 2026, 26, 20),
    (5, 6, 2026, 26, 25)

GO

CREATE PROCEDURE usp_RunPayroll
(
    @Month INT,
    @Year  INT
)
AS
BEGIN
    SET NOCOUNT ON

    INSERT INTO PayrollRun ([Month], [Year])
    VALUES (@Month, @Year)

    DECLARE @RunId INT = SCOPE_IDENTITY()

    INSERT INTO PayrollDetails
    (
        PayrollRunId,
        EmployeeId,
        GrossPay,
        PFDeduction,
        ProfessionalTax,
        NetPay
    )
    SELECT
        @RunId,
        e.Id,
        -- GrossPay: pro-rated basic salary
        (e.BasicSalary * a.DaysPresent / a.WorkingDays),
        -- PF deduction: 12% of basic salary
        (e.BasicSalary * 0.12),
        -- Professional tax: flat 200
        200,
        -- NetPay: GrossPay - PFDeduction - ProfessionalTax
        (e.BasicSalary * a.DaysPresent / a.WorkingDays)
            - (e.BasicSalary * 0.12)
            - 200
    FROM Employees e
    INNER JOIN Attendance a ON e.Id = a.EmployeeId
    WHERE a.[Month] = @Month
      AND a.[Year]  = @Year
END
GO
