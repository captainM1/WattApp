using System.IdentityModel.Tokens.Jwt;
using prosumerAppBack.Models;
using System;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using prosumerAppBack.Helper;
using Microsoft.EntityFrameworkCore;

namespace prosumerAppBack.Controllers;

[ApiController]
public class UserController : ControllerBase
{
    private readonly IPasswordHasher _passwordHasher;
    private readonly IUserRepository _userRepository;

    public UserController(IPasswordHasher passwordHasher, IUserRepository userRepository)
    {
        _passwordHasher = passwordHasher;
        _userRepository = userRepository;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] UserInputDto userInputDto)
    {
        var user = await _userRepository.GetUserByUsernameAsync(userInputDto.Username);
        if (user != null)
        {
            return BadRequest("username already exist");
        }

        await _userRepository.CreateUser(userInputDto);

        return Ok(new { message = "User registered successfully" });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] UserInputDto userInputDto)
    {
        var user = await _userRepository.GetUserByUsernameAndPasswordAsync(userInputDto.Username, userInputDto.Password);
        if (user == null)
        {
            return BadRequest("Invalid username or password");
        }

        var token = CreateJwt(user);
        return Ok( token );
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