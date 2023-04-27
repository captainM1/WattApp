using System.ComponentModel.DataAnnotations;
using prosumerAppBack.DataAccess;
using prosumerAppBack.Helper;
namespace prosumerAppBack.Models
{
    public class User
    {
        [Key]
        public Guid ID { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? UserName { get; set; }
        public byte[] PasswordHash { get; set; }
        public byte[] Salt { get; set; }
        public string? PhoneNumber { get; set; }
        public string? Address { get; set; }
        public string? City { get; set; }
        public string? Country { get; set; }
        public string? Role { get; set; }
        public string? Email { get; set; }

        public ICollection<Device.Device> Devices { get; set; }

        /*private readonly PasswordHasher hasher;

        public User(PasswordHasher hasher)
        {
            this.hasher = hasher;
        }

        public User AddDefaultUser()
        {
            var user = new User
            {
                ID = Guid.NewGuid(),
                FirstName = "Petar",
                LastName = "Simic",
                PhoneNumber = "064-316-15-81",
                Address = "Radoja Domanovica 6",
                City = "Kragujevac",
                Country = "Serbia",
                Role = "RegularUser",
                Email = "petarsimic@gmail.com"
            };
            
            var password = "petar123";
            var salt, hash = hasher.HashPassword(password);
            
            user.PasswordHash = hash;
            user.Salt = salt;
            
            return user;
        }
    }*/
    }
}
