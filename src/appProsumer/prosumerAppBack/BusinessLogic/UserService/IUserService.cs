using prosumerAppBack.Models;

namespace prosumerAppBack.BusinessLogic;

public interface IUserService
{
    Guid? GetID();
    string GetRole();
    Task<IEnumerable<object>> GetCoordinatesForAllUsers();
    Task<string> GetUsernameByIdAsync(Guid id);
    Task<User> GetUserByEmailAsync(string email);
    Task<User> CreateUser(UserRegisterDto userRegisterDto);
    Task<User> GetUserByEmailAndPasswordAsync(string email, string password);
    Task<User> GetUserByIdAsync(Guid id);
    Task<List<User>> GetAllUsersAsync(int pageNumber, int pageSize);
    Task<int> UpdateUser(Guid id, UserUpdateDto userUpdateDto);
    Task<Boolean> UpdatePassword(Guid id, string newPassword);
    Task<Boolean> CreateUserRequestToDso(User user);
    Task<User> CheckEmail(string email);
}