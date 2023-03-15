using System.Security.Claims;

namespace prosumerAppBack.BusinessLogic;

public class UserService:IUserService
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public UserService(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }
    public string GetID()
    {
        var ID = string.Empty;

        if (_httpContextAccessor.HttpContext != null)
            ID = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Name);

        return ID;
    }
    public string GetRole()
    {
        var role = string.Empty;

        if (_httpContextAccessor.HttpContext != null)
            role = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Role);

        return role;
    }
}