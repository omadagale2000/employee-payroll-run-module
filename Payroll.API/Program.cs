using Payroll.API.Repositories;
using Payroll.API.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services
builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy
            .AllowAnyOrigin()
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

builder.Services.AddScoped<IEmployeeRepository,EmployeeRepository>();

builder.Services.AddScoped<IPayrollRepository,PayrollRepository>();

builder.Services.AddScoped<IPayrollService,PayrollService>();

builder.Services.AddScoped<IAttendanceRepository,AttendanceRepository>();

builder.Services.AddScoped<IAttendanceService,AttendanceService>();

var app = builder.Build();

app.UseCors("AllowAll");

// Configure middleware
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();