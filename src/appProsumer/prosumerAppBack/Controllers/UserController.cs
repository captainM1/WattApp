using prosumerAppBack.Models;
using System;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using prosumerAppBack.Helper;
using Microsoft.EntityFrameworkCore;
using prosumerAppBack.BusinessLogic;

namespace prosumerAppBack.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UserController : ControllerBase
{
    private readonly IUserRepository _userRepository;
    private readonly ITokenMaker _tokenMaker;
    private readonly IUserService _userService;

    public UserController(IUserRepository userRepository,ITokenMaker tokenMaker, IUserService userService)
    {
        _userRepository = userRepository;
        _tokenMaker = tokenMaker;
        _userService = userService;
    }

    [HttpGet, Authorize]
    public ActionResult<string> GetData()
    {
        var id = _userService.GetID();
        var role = _userService.GetRole();
        return Ok(new {id,role});
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

    [HttpGet("users"),Authorize(Roles = "RegularUser")]
    public async Task<IActionResult> GetUsers()
    {
        var users = await _userRepository.GetAllUsers();
        return Ok(users);
    }
}