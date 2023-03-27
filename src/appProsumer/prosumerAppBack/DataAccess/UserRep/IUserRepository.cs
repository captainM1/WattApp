using prosumerAppBack.Models;


public interface IUserRepository
{
    Task<User> GetUserByIdAsync(int id);
    Task<User> GetUserByEmailAndPasswordAsync(string email, string password);
    Task<User> CreateUser(UserRegisterDto userRegisterDto);
    Task<User> GetUserByEmailAsync(string email);
    Task<User> CreateUserPasswordResetTokenAsync(User user);
    Task<User> GetUserByPasswordResetToken(string token);
    Task<List<User>> GetAllUsersAyncs(int pageNumber, int pageSize);
    Task<string> GetUsernameByIdAsync(string id);
    Task<Boolean> UpdatePassword(int id, string newPassword);
    Task<int> UpdateUser(int id, UserUpdateDto userUpdateDto);
    Task<Boolean> CreateUserRequestToDso(User user);
}