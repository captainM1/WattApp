using prosumerAppBack.Models;

public interface IUserRepository
{
    Task<User> GetUserByIdAsync(int id);
    Task<User> GetUserByUsernameAndPasswordAsync(string username, string password);
    Task<User> CreateUser(UserInputDto userInputDto);
    Task<User> GetUserByUsernameAsync(string username);
}