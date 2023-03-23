using System;
using System.ComponentModel.DataAnnotations;

namespace prosumerAppBack.Models
{
	public class ResetPasswordDto
	{
        [Required]
        public string? Email { get; set; }

        [Required]
		public string? Password { get; set; }
	}
}

