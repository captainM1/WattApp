using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

using Microsoft.EntityFrameworkCore;
using prosumerAppBack.DataAccess;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using MongoDB.Driver;
using prosumerAppBack.BusinessLogic;
using prosumerAppBack.BusinessLogic.DeviceService;
using prosumerAppBack.Helper;
using prosumerAppBack.Models;
using Swashbuckle.AspNetCore.Filters;
using prosumerAppBack.BusinessLogic.PowerUsageService;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddHttpContextAccessor();
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(
        builder =>
        {
            builder.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod();
        });
});
builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("oauth2", new OpenApiSecurityScheme
    {
        Description = "Standardna autorizacija",
        In = ParameterLocation.Header,
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey
    });
    options.OperationFilter<SecurityRequirementsOperationFilter>();
});
builder.Services.AddAuthentication(x =>
{
    x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(x =>
{
    x.RequireHttpsMetadata = false;
    x.SaveToken = true;
    x.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("SecretKey10125779374235322")),
        ValidateAudience = false,
        ValidateIssuer = false
    };
});
builder.Services.AddDbContext<DataContext>(option =>
    option.UseSqlite(builder.Configuration.GetConnectionString("WebApiDatabase")));

builder.Services.AddScoped<IUserRepository,UserRepository>();
builder.Services.AddScoped<IPasswordHasher,PasswordHasher>();
builder.Services.AddScoped<ITokenMaker,TokenMaker>();
builder.Services.AddScoped<IPowerUsageRepository,PowerUsageRepository>();
builder.Services.AddScoped<IDeviceRepository,DeviceRepository>();
builder.Services.AddScoped<IDeviceService,DeviceService>();
builder.Services.AddScoped<IUserService,UserService>();
builder.Services.AddScoped<IEmailService,EmailService>();
builder.Services.AddScoped<IPowerUsageService,PowerUsageService>();

builder.Services.AddHttpClient<UserService>();
builder.Services.AddSingleton<IMongoDatabase>(provider =>
{
    var client = new MongoClient("mongodb://localhost:27017");
    return client.GetDatabase("data");
});
builder.Services.AddSingleton<MongoDataContext>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthentication();

app.UseCors();

app.UseAuthorization();

app.MapControllers();

app.Run();


