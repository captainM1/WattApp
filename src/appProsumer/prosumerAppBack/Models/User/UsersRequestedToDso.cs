using System.ComponentModel.DataAnnotations;

namespace prosumerAppBack.Models
{
    public class UsersRequestedToDso
    {
        [Key]
        public Guid ID { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public byte[] PasswordHash { get; set; }
        public byte[] Salt { get; set; }
        public string? PhoneNumber { get; set; }
        public string? Address { get; set; }
        public string? City { get; set; }
        public string? Country { get; set; }
        public string? Email { get; set; }
    }
}
