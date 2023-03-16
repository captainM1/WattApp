using prosumerAppBack.Models;

public interface IUserRepository
{
    Task<User> GetUserByIdAsync(int id);
    Task<User> GetUserByEmailAndPasswordAsync(string email, string password);
    Task<User> CreateUser(UserRegisterDto userRegisterDto);
    Task<User> GetUserByEmailAsync(string email);
    public Task<List<User>> GetAllUsers();
    Task<string> GetUsernameByIdAsync(string id);
}