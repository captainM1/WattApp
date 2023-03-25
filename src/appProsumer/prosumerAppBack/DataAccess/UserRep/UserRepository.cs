using System.Security.Cryptography;
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

    public async Task<List<User>> GetAllUsers()
    {
        return await _dbContext.Users.ToListAsync();
    }
    
    public async Task<User> CreateUserPasswordResetTokenAsync(User user)
    {
        user.PasswordResetToken = CreateRandomToken();
        user.ResetTokenExpires = DateTime.Now.AddDays(1);
        await _dbContext.SaveChangesAsync();

        return user;
    }

    private string CreateRandomToken()
    {
        return Convert.ToHexString(RandomNumberGenerator.GetBytes(64));
    }

    public async Task<User> GetUserByPasswordResetToken(string token)
    {
        var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.PasswordResetToken == token);
        if(user.ResetTokenExpires < DateTime.Now)
        {
            user = null;
        }
        if (user == null)
        {
            return null;
        }

        return user;
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

    public async Task<User> GetUserByUsername(string username)
    {
        var user = await _dbContext.Users.FirstOrDefaultAsync(un => un.UserName == username);

        if (user == null)
        {
            return null;
        }

        return user;
    }
    public async Task<int> UpdateUser(int id, UserUpdateDto userUpdateDto)
    {
        User user = await this.GetUserByIdAsync(id);

        if(user == null)
        {
            return 0;
        }

        var usernameCheck = this.GetUserByUsername(userUpdateDto.Username);
        if(usernameCheck != null)
        {
            return 1; // zauzeto username
        }
        user.UserName = userUpdateDto.Username;
        user.FirstName = userUpdateDto.FirstName;
        user.LastName = userUpdateDto.LastName;
        user.Address = userUpdateDto.Address;
        user.Country = userUpdateDto.Country;
        user.Email = userUpdateDto.Email;
        user.PhoneNumber = userUpdateDto.PhoneNumber;
        

        _dbContext.Users.Update(user);
        await _dbContext.SaveChangesAsync();

        return 2; // sve je proslo kako treba
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
    public async Task<Boolean> CreateUserRequestToDso(User user)
    {
        var newUser = new UsersRequestedToDso
        {
            UserName = user.UserName,
            PhoneNumber = user.PhoneNumber,
            Email = user.Email,
            Address = user.Address,
            City = user.City,
            Country = user.Country,
            Salt = user.Salt,
            PasswordHash = user.PasswordHash,
            ID = user.ID,
        };
        _dbContext.UsersAppliedToDSO.Add(newUser);
        await _dbContext.SaveChangesAsync();
        return true;
    }
}