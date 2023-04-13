using System.ComponentModel.DataAnnotations;

namespace prosumerAppBack.Models.Dispatcher
{
    public class DispatcherRegisterDto
    {
        [Required]
        public string Username { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        [MinLength(6)]
        public string Password { get; set; }
    }
}
