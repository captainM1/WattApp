using prosumerAppBack.Models;
using System;
using Microsoft.AspNetCore.Mvc;
using prosumerAppBack.Helper;
using Microsoft.EntityFrameworkCore;

namespace prosumerAppBack.Controllers;

[ApiController]
public class UserController : ControllerBase
{
    private readonly IUserRepository _userRepository;
    private readonly ITokenMaker _tokenMaker;

    public UserController(IUserRepository userRepository,ITokenMaker tokenMaker)
    {
        _userRepository = userRepository;
        _tokenMaker = tokenMaker;
    }

    [HttpPost("signup")]
    public async Task<IActionResult> Register([FromBody] UserRegisterDto userRegisterDto)
    {
        var user = await _userRepository.GetUserByUsernameAsync(userRegisterDto.Username);
        if (user != null)
        {
            return BadRequest("username already exist");
        }

        await _userRepository.CreateUser(userRegisterDto);

        return Ok(new { message = "User registered successfully" });
    }

    [HttpPost("signin")]
    public async Task<IActionResult> Login([FromBody] UserLoginDto userLoginDto)
    {
        var user = await _userRepository.GetUserByUsernameAndPasswordAsync(userLoginDto.Username, userLoginDto.Password);
        if (user == null)
        {
            return BadRequest("Invalid username or password");
        }

        var token = _tokenMaker.GenerateToken(user);
        return Ok( token );
    }
}