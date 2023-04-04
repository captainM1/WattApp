using prosumerAppBack.Models;
using System;
using System.Text.Json;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using prosumerAppBack.Helper;
using Microsoft.EntityFrameworkCore;
using prosumerAppBack.BusinessLogic;
using System.Security.Cryptography;
using prosumerAppBack.BusinessLogic.DeviceService;
using prosumerAppBack.DataAccess;

namespace prosumerAppBack.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UserController : ControllerBase
{
    private readonly IUserRepository _userRepository;
    private readonly ITokenMaker _tokenMaker;
    private readonly IUserService _userService;
    private readonly IEmailService _emailService;
    private readonly IDeviceService _deviceService;

    public UserController(IUserRepository userRepository,ITokenMaker tokenMaker, IUserService userService, IEmailService emailService, IDeviceService deviceService)
    {
        _userRepository = userRepository;
        _tokenMaker = tokenMaker;
        _userService = userService;
        _emailService = emailService;
        _deviceService = deviceService;
    }

    [HttpGet("username")]
    public async Task<ActionResult<string>> Username()
    {
        Guid? nullableGuid = _userService.GetID();

        if (nullableGuid == null)
        {
            return BadRequest("Guid is null.");
        }

        Guid nonNullableGuid = nullableGuid.Value;
        Console.WriteLine(nonNullableGuid);
        var username = await _userService.GetUsernameByIdAsync(nonNullableGuid);
        return Ok(JsonSerializer.Serialize(username));
    }
    [HttpPost("signup")]
    public async Task<IActionResult> Register([FromBody] UserRegisterDto userRegisterDto)
    {
        try
        {
            var user = await _userService.CheckEmail(userRegisterDto.Email);

            await _userService.CreateUser(userRegisterDto);

            return Ok(new { message = "User registered successfully" });
        }
        catch (ArgumentNullException ex)
        {
            throw new ArgumentException(ex.Message);
        }
    }

    [HttpPost("signin")]
    public async Task<IActionResult> Login([FromBody] UserLoginDto userLoginDto)
    {        
        try
        {
            var user = await _userService.GetUserByEmailAndPasswordAsync(userLoginDto.Email, userLoginDto.Password);
            
            var token = _tokenMaker.GenerateToken(user);
            return Ok(JsonSerializer.Serialize(token));
        }
        catch (ArgumentNullException ex)
        {
            throw new ArgumentException(ex.Message);
        }
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
    public async Task<ActionResult<User>> GetUser(Guid id)
    {        
        try
        {
            var user = await _userService.GetUserByIdAsync(id);            

            return Ok(user);
        }
        catch (ArgumentNullException ex)
        {
            throw new ArgumentException(ex.Message);
        }
    }

    [HttpGet("users")]
    public async Task<List<User>> GetUsers([FromQuery]int pageNumber,[FromQuery] int pageSize)
    {
        var users = await _userService.GetAllUsersAsync(pageNumber,pageSize);
        return users;
    }

    [HttpPost("users/{id}")]
    public async Task<IActionResult> UpdateUser(Guid id, [FromBody] UserUpdateDto userUpdateDto)
    {
        await _userService.UpdateUser(id, userUpdateDto);

        return Ok(new { message = "user updated successfully" });
    }

    [HttpPost("send-reset-email")]
    public async Task<IActionResult> SendResetEmail([FromBody] ResetPasswordEmailDto resetPasswordEmailDto)
    {
        var user = await _userService.GetUserByEmailAsync(resetPasswordEmailDto.Email);

        var token = _tokenMaker.GenerateToken(user);
        var resetPasswordUrl = $"https://localhost:7182/api/user/reset-password?token={token}";
        var message = $"Please click the following link to reset your password: {resetPasswordUrl}";
        await _emailService.SendEmailAsync(user.Email, "Reset password", message);

        return Ok(new { message = "Reset password link has been sent to your email" });
    }

    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword([FromQuery] string token,[FromBody] ResetPasswordDto resetPasswordDto)
    {
        bool result = _tokenMaker.ValidateJwtToken(token);

        if (result == false)
        {
            return BadRequest("Invalid token");
        }

        var id = _userService.GetID().Value;
        Task<User> user = _userService.GetUserByIdAsync(id);

        var userCheck = _userService.GetUserByEmailAsync(resetPasswordDto.Email);

        if (userCheck == null || resetPasswordDto.Email != user.Result.Email)
        {
            return BadRequest("Invalid email address");
        }

        var action = _userRepository.UpdatePassword(user.Result.ID, resetPasswordDto.Password).GetAwaiter().GetResult();

        if (!action)
        {
            return BadRequest("Action failed");
        }

        return Ok(new { message = "Password changed" }); 
    }

    [HttpGet("coordinatesForEveryUser")]
    public async Task<ActionResult<IEnumerable<object>>> GetCoordinatesForAllUsers()
    {
        try
        {
            var results = await _userService.GetCoordinatesForAllUsers();

            return Ok(results);
        }
        catch (Exception ex)
        {
            return StatusCode(500, ex.Message);
        }
    }

    [HttpPost("send-request-to-dso/{id}")]
    public async Task<IActionResult> CreateRequestForDso(Guid id)
    {
        try
        {
            var user = await _userService.GetUserByIdAsync(id);
            
            var result = await _userService.CreateUserRequestToDso(user);

            return Ok(result);
        }
        catch (Exception ex)
        {
            return StatusCode(500, ex.Message);
        }
    }

    [HttpPost("update-user")]
    [Authorize]
    public async Task<IActionResult> UpdateUserInformation([FromBody] UserUpdateDto userUpdateDto)
    {        
        try
        {
            Guid userId = _userService.GetID().Value;

            User user = await _userService.GetUserByIdAsync(userId);

            int check = await _userService.UpdateUser(userId, userUpdateDto);

            return Ok(new { message = "user updated successfully" });
        }
        catch (Exception ex)
        {
            return StatusCode(500, ex.Message);
        }
    }

    [HttpPost("update-user/update-password")]
    [Authorize]
    public async Task<IActionResult> UpdateUserPassword([FromBody] UserUpdateDto userUpdateDto)
    {       
        try
        {
            Guid userId = _userService.GetID().Value;

            User user = await _userService.GetUserByIdAsync(userId);

            var action = _userService.UpdatePassword(userId, userUpdateDto.Password).GetAwaiter().GetResult();

            return Ok(new { message = "Password changed" });
        }
        catch (Exception ex)
        {
            return StatusCode(500, ex.Message);
        }
    }
    
    [HttpGet("coordinates/{id}")]
    public async Task<IActionResult> GetCoordinatesForUser(Guid id)
    {
        var devices = _deviceService.GetDevicesForUser(id);
        
        try
        {
            var results = await _userService.GetCoordinatesForUser(id);

             return Ok(devices);
         }
         catch (Exception ex)
         {
             return StatusCode(500, ex.Message);
         }  
    }
}