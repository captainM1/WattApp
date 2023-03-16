using Microsoft.AspNetCore.Mvc;
using prosumerAppBack.Models;

public interface IUserRepository
{
    Task<User> GetUserByIdAsync(int id);
    Task<User> GetUserByUsernameAndPasswordAsync(string username, string password);
    Task<User> CreateUser(UserRegisterDto userRegisterDto);
    Task<User> GetUserByUsernameAsync(string username);
    Task<User> GetUserByEmailAsync(string email);
    Task<User> CreateUserPasswordResetTokenAsync(User user);
    Task<User> GetUserByPasswordResetToken(string token);
    public Task<List<User>> GetAllUsers();
}