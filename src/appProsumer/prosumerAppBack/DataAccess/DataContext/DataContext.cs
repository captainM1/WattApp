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
        public DbSet<DeviceType> DeviceTypes { get; set; }
        
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
            
            modelBuilder.Entity<DeviceTypeConnection>()
                .HasKey(dt => new { dt.DeviceID, dt.DeviceTypeID });

            modelBuilder.Entity<DeviceTypeConnection>()
                .HasOne(dt => dt.Device)
                .WithMany(d => d.DeviceDeviceTypes)
                .HasForeignKey(dt => dt.DeviceID);

            modelBuilder.Entity<DeviceTypeConnection>()
                .HasOne(dt => dt.DeviceType)
                .WithMany(dt => dt.DeviceDeviceTypes)
                .HasForeignKey(dt => dt.DeviceTypeID);
        }
    }
}
