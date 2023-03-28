using prosumerAppBack.Models;


public interface IUserRepository
{
    Task<User> GetUserByIdAsync(Guid id);
    Task<User> GetUserByEmailAndPasswordAsync(string email, string password);
    Task<User> CreateUser(UserRegisterDto userRegisterDto);
    Task<User> GetUserByEmailAsync(string email);
    Task<List<User>> GetAllUsers();
    Task<string> GetUsernameByIdAsync(Guid id);
    Task<Boolean> UpdatePassword(Guid id, string newPassword);
    Task<int> UpdateUser(Guid id, UserUpdateDto userUpdateDto);
    Task<Boolean> CreateUserRequestToDso(User user);
}