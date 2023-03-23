using Microsoft.EntityFrameworkCore;
using prosumerAppBack.Models;

namespace prosumerAppBack.DataAccess
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options)
        {

        }

        public DbSet<User> Users { get; set; }
        public DbSet<UsersRequestedToDso> UsersAppliedToDSO { get; set; }
        
        public DbSet<Device> Devices { get; set; }
    }
}
