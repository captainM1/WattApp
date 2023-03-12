using Microsoft.EntityFrameworkCore;
using prosumerAppBack.DataAccess;
using prosumerAppBack.Models;
using prosumerAppBack.Helper;

public class UserRepository : IUserRepository
{
    private readonly DataContext _dbContext;
    private readonly PasswordHasher _passwordHasher;

    public UserRepository(DataContext dbContext,PasswordHasher passwordHasher)
    {
        _dbContext = dbContext;
        _passwordHasher = passwordHasher;

    }

    public async Task<User> GetUserByIdAsync(int id)
    {
        return await _dbContext.Users.FindAsync(id);
    }

    public async Task<User> GetUserByUsernameAndPasswordAsync(string username, string password)
    {
        var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.UserName == username);

        if (user == null)
        {
            return null;
        }
        if (!_passwordHasher.VerifyPassword(password, user.Salt, user.PasswordHash))
        {
            return null;
        }
        return user;
    }

    public async Task<User> GetUserByUsernameAsync(string username)
    {
        var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.UserName == username);

        if (user == null)
        {
            return null;
        }

        return user;
    }

    public async Task<User> CreateUser(UserInputDto userInputDto)
    {
        byte[] salt;
        byte[] hash;
        (salt,hash)= _passwordHasher.HashPassword(userInputDto.Password);
        var newUser = new User
        {
            UserName = userInputDto.Username,
            PhoneNumber = userInputDto.PhoneNumber,
            Email = userInputDto.Email,
            Address = userInputDto.Address,
            Salt = salt,
            PasswordHash = hash
        };
        _dbContext.Users.Add(newUser);
        await _dbContext.SaveChangesAsync();
        return newUser;
    }
}