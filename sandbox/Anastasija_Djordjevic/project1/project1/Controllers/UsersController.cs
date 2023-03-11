using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using project1.Data;
using project1.Models;

namespace project1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly DatabContext _context;

        public UsersController(IConfiguration configuration, DatabContext context)
        {
            _configuration = configuration;
            _context = context;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] User user)
        {
            if (_context.User.Any(u => u.UserName == user.UserName))
            {
                return BadRequest("Username already exists");
            }

            user.Role = "user"; 
            _context.User.Add(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Registration successful" });
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] User user)
        {
            var existingUser = _context.User.SingleOrDefault(u => u.UserName == user.UserName);
            if (existingUser == null)
            {
                return BadRequest("Invalid username or password");
            }

            if (existingUser.Password != user.Password)
            {
                return BadRequest("Invalid username or password");
            }

            var token = "token";

            return Ok(new { token });
        }
    }
}