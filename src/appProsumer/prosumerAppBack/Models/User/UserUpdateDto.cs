using System;
using System.ComponentModel.DataAnnotations;

namespace prosumerAppBack.Models
{
	public class UserUpdateDto
	{
        [Required]
        public string PhoneNumber { get; set; }

        [Required]
        public string Address { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        [MinLength(6)]
        public string Password { get; set; }

        [Required]
        public string Country { get; set; }

        [Required]
        public string? FirstName { get; set; }

        [Required]
        public string? LastName { get; set; }
        public Boolean sharesDataWithDso { get; set; }
        public Boolean dsoHasControl { get; set; }
    }
}

