using Microsoft.EntityFrameworkCore;
using ReactChess.Server.Services;
using ReactChess.Server.Domain;
using ReactChess.Server.Hubs;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddSignalR(option =>
{
    option.KeepAliveInterval = TimeSpan.FromSeconds(15);
    option.ClientTimeoutInterval = TimeSpan.FromSeconds(35);
});
builder.Services.AddControllers();

builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy", request =>
    {
        request.WithOrigins("https://localhost:3000", "https://localhost:3001")
               .AllowAnyHeader()
               .AllowAnyMethod()
               .AllowCredentials();
    });
});

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddScoped<GameManagerService>();
builder.Services.AddScoped<ArbiterService>();
builder.Services.AddSingleton<GameService>();
builder.Services.AddSingleton<MatchMakingService>();

builder.Services.AddDbContext<DataContext>(opt =>
    opt.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.UseDeveloperExceptionPage();
}
else
{
}

app.UseHttpsRedirection();
app.UseCors("CorsPolicy");
app.UseAuthorization();

app.MapControllers();
app.MapHub<GameHub>("/GameHub");

// apply migrations
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<DataContext>();

    // dbContext.Database.EnsureDeleted();
    await dbContext.Database.MigrateAsync();

}

app.Run();
