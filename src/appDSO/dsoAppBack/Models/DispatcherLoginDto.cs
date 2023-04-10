using System.ComponentModel.DataAnnotations;

namespace dsoAppBack.Models
{
    public class DispatcherLoginDto
    {
        [Required]
        public string Email { get; set; }

        [Required]
        public string Password { get; set; }
    }
}
