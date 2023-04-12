using Microsoft.AspNetCore.Components;
using prosumerAppBack.DataAccess.DispatcherRep;
using prosumerAppBack.Models.Dispatcher;
using SendGrid.Helpers.Errors.Model;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Dispatcher = prosumerAppBack.Models.Dispatcher.Dispatcher;

namespace prosumerAppBack.BusinessLogic.DispatcherService
{
    public class DispatcherService : IDispatcherService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IDispatcherRepository _repository;

        public DispatcherService(IHttpContextAccessor httpContextAccessor, IDispatcherRepository repository)
        {
            _httpContextAccessor = httpContextAccessor;
            _repository = repository;
        }

        public Guid? GetID()
        {
            var token = _httpContextAccessor.HttpContext.Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            var handler = new JwtSecurityTokenHandler();
            try
            {
                var jwtToken = handler.ReadJwtToken(token);
                var dispatcherIdClaim = jwtToken.Claims.FirstOrDefault(c => c.Type == "unique_name");
                if (dispatcherIdClaim != null)
                {
                    Guid dispatcherIdGuid;
                    if (Guid.TryParse(dispatcherIdClaim.Value, out dispatcherIdGuid))
                    {
                        return dispatcherIdGuid;
                    }
                }

                return null;
            }
            catch (Exception ex)
            {
                // Log the exception
                return null;
            }
        }
        public string GetRole()
        {
            var role = string.Empty;

            if (_httpContextAccessor.HttpContext != null)
                role = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Role);

            return role;
        }

        public async Task<Dispatcher> GetUserByEmailAndPasswordAsync(string email, string password)
        {
            var dispatcher = await _repository.GetUserByEmailAndPasswordAsync(email, password);
            if (dispatcher == null)
            {
                throw new NullReferenceException("Invalid email or password");
            }

            return dispatcher;
        }

        public async Task<Dispatcher> CreateDispatcher(DispatcherRegisterDto dispatcherRegisterDto)
        {
            var dispatcher = await _repository.CreateDispatcher(dispatcherRegisterDto);
            if (dispatcher == null)
            {
                throw new NullReferenceException("Failed to create user");
            }

            return dispatcher;
        }
        public async Task<Dispatcher> CheckEmail(string email)
        {
            var dispatcher = await _repository.GetDispatcherByEmailAsync(email);
            if (dispatcher != null)
            {
                throw new NotFoundException("email already exist");
            }

            return dispatcher;
        }
        public async Task<Dispatcher> CheckUsername(string username)
        {
            var dispatcher = await _repository.GetDispatcherByUsernameAsync(username);
            if (dispatcher != null)
            {
                throw new NotFoundException("username already exist");
            }

            return dispatcher;
        }
    }
}
