using prosumerAppBack.Models;
using System;
using System.Text.Json;
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

    [HttpGet("username")]
    public ActionResult<string> GetData()
    {
        var id = _userService.GetID();
        var username = _userRepository.GetUsernameByIdAsync(id);
        return Ok(JsonSerializer.Serialize(username));
    }
    [HttpPost("signup")]
    public async Task<IActionResult> Register([FromBody] UserRegisterDto userRegisterDto)
    {
        var user = await _userRepository.GetUserByEmailAsync(userRegisterDto.Email);
        if (user != null)
        {
            return BadRequest("email already exist");
        }

        await _userRepository.CreateUser(userRegisterDto);

        return Ok(new { message = "User registered successfully" });
    }

    [HttpPost("signin")]
    public async Task<IActionResult> Login([FromBody] UserLoginDto userLoginDto)
    {
        var user = await _userRepository.GetUserByEmailAndPasswordAsync(userLoginDto.Email, userLoginDto.Password);
        if (user == null)
        {
            return BadRequest("Invalid email or password");
        }

        var token = _tokenMaker.GenerateToken(user);
        return Ok( JsonSerializer.Serialize(token) );
    }

    [HttpGet("users"),Authorize(Roles = "RegularUser")]
    public async Task<IActionResult> GetUsers()
    {
        var users = await _userRepository.GetAllUsers();
        return Ok(users);
    }
    [HttpPost("validate-token")]
    public ActionResult<object> ValidateToken([FromBody] object body)
    {
        string token = body.ToString();
        var result = _tokenMaker.ValidateJwtToken(token);

        if (!result)
        {
            return BadRequest("Invalid token");
        }
        
        return true;
    }

    [HttpGet("users/{id}")]
    public async Task<ActionResult<User>> GetUser(int id)
    {
        var user = await _userRepository.GetUserByIdAsync(id);
        if(user == null)
        {
            return BadRequest("User not found");
        }

        return Ok(user);
    }

    [HttpGet("users")]
    public async Task<IActionResult> GetUsers()
    {
        var users = await _userRepository.GetUsersAsync();

        if(users == null)
        {
            return BadRequest("Theres no users in the database");
        }

        return Ok(users);
    }

    [HttpPost("users/{id}")]
    public async Task<IActionResult> UpdateUser(int id, [FromBody] UserUpdateDto userUpdateDto)
    {
        var user = _userRepository.UpdateUser(id, userUpdateDto);

        if(user == null)
        {
            return BadRequest("cannot update user");
        }

        return Ok(new { message = "user updated successfully" });
    }
}