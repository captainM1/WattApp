using System.IdentityModel.Tokens.Jwt;
using prosumerAppBack.Models;
using System;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace prosumerAppBack.Controllers;

[ApiController]
public class UserController : ControllerBase
{
    [HttpPost("authentiacate")]
    public async Task<IActionResult> Authenticate()
    {
        User user = new User()
        {
            Id = 1,
            FirstName = "Milovan",
            LastName = "Samardzic",
            Email = "77-2020@pmf.kg.ac.rs",
            Role = "Admin",
            UserName = "77-2020",
            Password = "123",
        };
        user.Token = CreateJwt(user);
        return Ok(new
        {
            Token = user.Token,
            Message = "Crated Token"
        });
    }
    private string CreateJwt(User user)
    {
        var jwtTokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes("veryverysceret.....");
        var identity = new ClaimsIdentity(new Claim[]
        {
            new Claim(ClaimTypes.Role, user.Role),
            new Claim(ClaimTypes.Name,$"{user.FirstName} {user.LastName}")
        });

        var credentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256);

        var tokenDescription = new SecurityTokenDescriptor()
        {
            Subject = identity,
            Expires = DateTime.Now.AddDays(1),
            SigningCredentials = credentials
        };
        var token = jwtTokenHandler.CreateToken(tokenDescription);
        return jwtTokenHandler.WriteToken(token);
    }
}