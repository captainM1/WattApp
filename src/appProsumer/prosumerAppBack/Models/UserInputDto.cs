using System.ComponentModel.DataAnnotations;

namespace prosumerAppBack.Models;

public class UserInputDto
{
    [Required]
    public string Username { get; set; }

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
}