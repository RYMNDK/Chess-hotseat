using Microsoft.EntityFrameworkCore;
using ReactChess.Server.Model;

namespace ReactChess.Server.Domain;

public class DataContext(DbContextOptions options) : DbContext(options)
{
    public DbSet<Room> Rooms { get; set; }
}