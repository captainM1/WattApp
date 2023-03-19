using Microsoft.AspNetCore.Mvc;
using prosumerAppBack.Models;

public interface IUserRepository
{
    Task<User> GetUserByIdAsync(int id);
    Task<User> GetUserByEmailAndPasswordAsync(string email, string password);
    Task<User> CreateUser(UserRegisterDto userRegisterDto);
    Task<User> GetUserByUsernameAsync(string username);
    Task<User> GetUserByEmailAsync(string email);
    Task<User> CreateUserPasswordResetTokenAsync(User user);
    Task<User> GetUserByPasswordResetToken(string token);
    Task<List<User>> GetAllUsers();
    Task<User> GetUserByEmailAsync(string email);
    Task<string> GetUsernameByIdAsync(string id);
    Task<Boolean> UpdatePassword(int id, string newPassword);
    Task<User> UpdateUser(int id, UserUpdateDto userUpdateDto);
}