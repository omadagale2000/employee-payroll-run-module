# Employee Payroll Run Module

A payroll management system with an ASP.NET Core 9 API and a React + Vite frontend. HR can track attendance and run monthly payroll from the browser.

---

## Prerequisites

- .NET 9 SDK
- Node.js 18+ and npm
- SQL Server (any edition, Express works fine)

---

## Database Setup

Open SSMS, connect to your local SQL Server, and run the `database.sql` file in the project root. It creates the database, all tables, seeds some sample data, and sets up the stored procedure used for payroll calculation.

The default connection string in `Payroll.API/appsettings.json` uses Windows Authentication:

```
Server=localhost;Database=PayrollDB;Trusted_Connection=True;TrustServerCertificate=True;
```

If you use SQL auth instead:

```
Server=localhost;Database=PayrollDB;User Id=yourUser;Password=yourPassword;TrustServerCertificate=True;
```

Named instance (e.g. SQL Express)? Change `Server=localhost` to `Server=localhost\SQLEXPRESS`.

---

## Running the Backend

```bash
cd Payroll.API
dotnet run
```

API runs on `https://localhost:7241`. Swagger is at `/swagger` when in development.

---

## Running the Frontend

```bash
cd payroll-ui
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`.

The API URL is set in `payroll-ui/.env`:

```
VITE_API_BASE_URL=https://localhost:7241
```

Update this if you changed the backend port.

---

## Payroll Calculation

Done inside a stored procedure (`usp_RunPayroll`):

- **Gross Pay** = BasicSalary × (DaysPresent / WorkingDays)
- **PF** = 12% of BasicSalary
- **Professional Tax** = flat ₹200
- **Net Pay** = Gross − PF − PT

Running payroll twice for the same month/year returns a 409 — it's blocked at the DB level.

---

## Assumptions

- No authentication. Kept out of scope to focus on the payroll flow itself.
- Working days and days present are entered manually per employee — no calendar integration.
- Professional tax is flat ₹200 for everyone. Real PT would be slab-based per state.
- PF is on basic salary only, which matches the statutory minimum.
- Departments are seeded (IT, HR) and not manageable from the UI.

