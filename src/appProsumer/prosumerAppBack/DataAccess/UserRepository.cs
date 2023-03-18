using Microsoft.EntityFrameworkCore;
using prosumerAppBack.Helper;
using prosumerAppBack.Models;

namespace prosumerAppBack.DataAccess;

public class UserRepository : IUserRepository
{
    private readonly DataContext _dbContext;
    private readonly IPasswordHasher _passwordHasher;

    public UserRepository(DataContext dbContext,IPasswordHasher passwordHasher)
    {
        _dbContext = dbContext;
        _passwordHasher = passwordHasher;

    }
    public async Task<User> GetUserByIdAsync(int id)
    {
        return await _dbContext.Users.FindAsync(id);
    }

    public async Task<User> GetUserByEmailAndPasswordAsync(string email, string password)
    {
        var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Email == email);

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

    public async Task<User> GetUserByEmailAsync(string email)
    {
        var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Email == email);

        if (user == null)
        {
            return null;
        }

        return user;
    }
    
    public async Task<User> CreateUser(UserRegisterDto userRegisterDto)
    {
        byte[] salt;
        byte[] hash;
        (salt,hash)= _passwordHasher.HashPassword(userRegisterDto.Password);
        var newUser = new User
        {
            UserName = userRegisterDto.Username,
            PhoneNumber = userRegisterDto.PhoneNumber,
            Email = userRegisterDto.Email,
            Address = userRegisterDto.Address.Split(",")[0],
            City = userRegisterDto.Address.Split(",")[1],
            Country = userRegisterDto.Address.Split(",")[2],
            Salt = salt,
            PasswordHash = hash,
            Role = "RegularUser",
            ID = Guid.NewGuid(),
        };
        _dbContext.Users.Add(newUser);
        await _dbContext.SaveChangesAsync();
        return newUser;
    }
    public Task<List<User>> GetAllUsers()
    {
        return _dbContext.Users.ToListAsync();
    }

    public async Task<string> GetUsernameByIdAsync(string id)
    {
        var user = new User();
        if (Guid.TryParse(id, out Guid guid))
        {
            user = await _dbContext.Users.FindAsync(guid);
        }
        return user.UserName;
    }
    public async Task<IEnumerable<User>> GetUsersAsync()
    {
        var users = (IEnumerable<User>)_dbContext.Users.ToListAsync();

        if (users == null)
        {
            return null;
        }

        return users;
    }

    public async Task<User> UpdateUser(int id, UserUpdateDto userUpdateDto)
    {
        User user = await this.GetUserByIdAsync(id);

        if(user == null)
        {
            return null;
        }

        user.UserName = userUpdateDto.Username;
        user.FirstName = userUpdateDto.FirstName;
        user.LastName = userUpdateDto.LastName;
        user.Address = userUpdateDto.Address;
        user.City = userUpdateDto.City;
        user.Country = userUpdateDto.Country;
        user.Email = userUpdateDto.Email;
        user.PhoneNumber = userUpdateDto.PhoneNumber;
        

        _dbContext.Users.Update(user);
        await _dbContext.SaveChangesAsync();

        return user;
    }

    public async Task<Boolean> UpdatePassword(int id, string newPassword)
    {
        var user = await this.GetUserByIdAsync(id);

        if (user == null)
        {
            return false;
        }

        byte[] salt;
        byte[] hash;
        (salt, hash) = _passwordHasher.HashPassword(newPassword);

        user.Salt = salt;
        user.PasswordHash = hash;

        await _dbContext.SaveChangesAsync();

        return true;
    }
}