using Microsoft.EntityFrameworkCore;
using prosumerAppBack.Models;
using prosumerAppBack.Models.Device;

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
        public DbSet<DeviceOwners> DeviceOwners { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            
            modelBuilder.Entity<DeviceOwners>()
                .HasKey(d => new { d.DeviceID, d.UserID });
            
            modelBuilder.Entity<DeviceOwners>()
                .HasOne(d => d.Device)
                .WithMany(d => d.DeviceOwners)
                .HasForeignKey(d => d.DeviceID);
            
            modelBuilder.Entity<DeviceOwners>()
                .HasOne(d => d.User)
                .WithMany(u => u.DeviceOwners)
                .HasForeignKey(d => d.UserID);
        }
    }
}
