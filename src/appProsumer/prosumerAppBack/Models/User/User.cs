using System.ComponentModel.DataAnnotations;
using prosumerAppBack.Models.Device;

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

        public virtual ICollection<DeviceOwners> DeviceOwners { get; set; }
    }
}
