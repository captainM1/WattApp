using Microsoft.EntityFrameworkCore;
using prosumerAppBack.Models;
using prosumerAppBack.Models.Device;
using prosumerAppBack.Models.Dispatcher;

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
        
        public DbSet<DeviceType> DeviceTypes { get; set; }
        public DbSet<DeviceGroup> DeviceGroups { get; set; }
        public DbSet<DeviceManufacturers> DeviceManufacturers { get; set; }
        public DbSet<Dispatcher> Dispatchers { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<DeviceType>()
                .HasOne(d => d.Group)
                .WithMany(g => g.DeviceTypes)
                .HasForeignKey(d => d.GroupID);

            modelBuilder.Entity<DeviceType>()
                .HasOne(d => d.Manufacturer)
                .WithMany(m => m.DeviceTypes)
                .HasForeignKey(d => d.ManufacturerID);
            
            modelBuilder.Entity<Device>()
                .HasOne(d => d.DeviceType)
                .WithMany(dt => dt.Devices)
                .HasForeignKey(d => d.DeviceTypeID);

            modelBuilder.Entity<Device>()
                .HasOne(d => d.Owner)
                .WithMany(u => u.Devices)
                .HasForeignKey(d => d.OwnerID);
        }
    }
}
