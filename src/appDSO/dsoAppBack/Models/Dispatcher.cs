using System.ComponentModel.DataAnnotations;

namespace dsoAppBack.Models
{
    public class Dispatcher
    {
        [Key]
        public Guid ID { get; set; }
        public string? UserName { get; set; }
        public byte[] PasswordHash { get; set; }
        public byte[] Salt { get; set; }
        public string? Role { get; set; }
        public string? Email { get; set; }    
    }
}

