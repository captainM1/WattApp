using dsoAppBack.Models;
using Microsoft.EntityFrameworkCore;

namespace dsoAppBack.DataAccess.DataContext
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options)
        {
        }

        public DbSet<Dispatcher> Dispatchers { get; set; }        
    }
}
