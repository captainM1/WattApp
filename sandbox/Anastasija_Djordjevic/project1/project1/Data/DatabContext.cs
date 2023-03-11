using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using project1.Models;

namespace project1.Data

{
    public class DatabContext : DbContext
    {
        public DatabContext(DbContextOptions<DatabContext> options) : base(options)
        {

        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            base.OnConfiguring(optionsBuilder);
            optionsBuilder.UseSqlServer("Server=localhost;database=Users;Encrypt=False;TrustServerCertificate=False;User ID=SA;Password={password};");
        }

        public DbSet<User> User { get; set; }
    }
}

