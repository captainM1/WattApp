using System.Security.Cryptography;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json.Linq;
using prosumerAppBack.Helper;
using prosumerAppBack.Models;

namespace prosumerAppBack.DataAccess;

public class UserRepository : IUserRepository
{
    private readonly DataContext _dbContext;
    private readonly IPasswordHasher _passwordHasher;
    private readonly ITokenMaker _tokenMaker;

    public UserRepository(DataContext dbContext,IPasswordHasher passwordHasher, ITokenMaker tokenMaker)
    {
        _dbContext = dbContext;
        _passwordHasher = passwordHasher;
        _tokenMaker = tokenMaker;

    }
    public async Task<User> GetUserByIdAsync(Guid id)
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

    public async Task CreatePasswordResetToken(string email)
    {
        var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Email == email);

        user.PasswordResetTokenExpires = DateTime.Now.AddDays(1);
        user.PasswordResetToken = CreateTokenForPassword();
        await _dbContext.SaveChangesAsync();
    }
    public async Task ResetPasswordToken(string token)
    {
        var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.PasswordResetToken == token);

        user.PasswordResetTokenExpires = null;
        user.PasswordResetToken = null;
        await _dbContext.SaveChangesAsync();
    }
    public async Task<User> GetUserByPasswordResetTokenAsync(string passwordResetToken)
    {
        var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.PasswordResetToken == passwordResetToken);

        if (user == null)
        {
            return null;
        }

        return user;
    }

    private string CreateTokenForPassword()
    {
        return Convert.ToHexString(RandomNumberGenerator.GetBytes(64));
    }

    public async Task<User> CreateUser(UserRegisterDto userRegisterDto)
    {
        byte[] salt;
        byte[] hash;
        (salt,hash)= _passwordHasher.HashPassword(userRegisterDto.Password);
        var newUser = new User
        {
            FirstName = userRegisterDto.FirstName,
            LastName = userRegisterDto.LastName,
            PhoneNumber = userRegisterDto.PhoneNumber,
            Email = userRegisterDto.Email,
            Address = userRegisterDto.Address.Split(",")[0],
            City = userRegisterDto.Address.Split(",")[1],
            Country = userRegisterDto.Address.Split(",")[2],
            Salt = salt,
            PasswordHash = hash,
            Role = "UnapprovedUser",
            ID = Guid.NewGuid(),
            PasswordResetToken = null,
            PasswordResetTokenExpires = null
        };
        _dbContext.Users.Add(newUser);
        await _dbContext.SaveChangesAsync();
        return newUser;
    }

    public async Task<List<UserDto>> GetAllUsersAsync(int pageNumber, int pageSize)
    {
        var pagedData = await _dbContext.Users
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .Select(u => new UserDto {
                ID = u.ID,
                FirstName = u.FirstName,
                LastName = u.LastName,
                PhoneNumber = u.PhoneNumber,
                Address = u.Address,
                City = u.City,
                Country = u.Country,
                Role = u.Role,
                Email = u.Email
            })
            .ToListAsync();
        return pagedData;
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

    public async Task<int> UpdateUser(Guid id, UserUpdateDto userUpdateDto)
    {
        User user = await this.GetUserByIdAsync(id);

        if(user == null)
        {
            return 0;
        }

        user.FirstName = userUpdateDto.FirstName;
        user.LastName = userUpdateDto.LastName;
        user.Address = userUpdateDto.Address;
        user.Country = userUpdateDto.Country;
        user.Email = userUpdateDto.Email;
        user.PhoneNumber = userUpdateDto.PhoneNumber;
        user.dsoHasControl = userUpdateDto.dsoHasControl;
        user.sharesDataWithDso = user.sharesDataWithDso;
        
        _dbContext.Users.Update(user);
        await _dbContext.SaveChangesAsync();

        return 2; // sve je proslo kako treba
    }

    public async Task<Boolean> UpdatePassword(Guid id, string newPassword)
    {
        var user = await this.GetUserByIdAsync(id);

        string token = _tokenMaker.GenerateToken(user);

        bool result = _tokenMaker.ValidateJwtToken(token);

        if (result == false)
        {
            return false;
        }

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
            FirstName = user.FirstName,
            LastName = user.LastName,
            PhoneNumber = user.PhoneNumber,
            Email = user.Email,
            Address = user.Address,
            City = user.City,
            Country = user.Country,
            Salt = user.Salt,
            PasswordHash = user.PasswordHash,
            ID = user.ID,
            sharesDataWithDso = user.sharesDataWithDso,
            dsoHasControl = user.dsoHasControl,
        };
        _dbContext.UsersAppliedToDSO.Add(newUser);
        await _dbContext.SaveChangesAsync();
        return true;
    }
    public async Task<Boolean> ApproveUserRequestToDso(Guid id)
    {
        var newUser = await _dbContext.UsersAppliedToDSO.FindAsync(id);

        var approvedUser = new User
        {
            ID = newUser.ID,
            FirstName = newUser.FirstName,
            LastName = newUser.LastName,           
            PhoneNumber = newUser.PhoneNumber,
            Email = newUser.Email,
            Address = newUser.Address,
            City = newUser.City,
            Country = newUser.Country,
            Salt = newUser.Salt,
            PasswordHash = newUser.PasswordHash,
            Role= "RegularUser",
        };

        _dbContext.Users.Update(approvedUser);
        await _dbContext.SaveChangesAsync();

        var user = await _dbContext.UsersAppliedToDSO.FindAsync(id);

        _dbContext.UsersAppliedToDSO.Remove(user);
        await _dbContext.SaveChangesAsync();
        return true;
    }

    public async Task<Boolean> DeclineUserRequestToDso(Guid id)
    {
        var user = await _dbContext.UsersAppliedToDSO.FindAsync(id);

        _dbContext.UsersAppliedToDSO.Remove(user);
        await _dbContext.SaveChangesAsync();
        return true;
    }

    public async Task<User> DisconnectFromDso(Guid id)
    {
        var user = await _dbContext.Users.FindAsync(id);
        user.Role = "UnapprovedUser";
        user.dsoHasControl = false;
        user.sharesDataWithDso = false;

        _dbContext.Users.Update(user);
        await _dbContext.SaveChangesAsync();
        return user;
    }

    public async Task<int> GetNumberOfUsers()
    {
        return await _dbContext.Users.CountAsync();
    }

    public async Task<List<UserDto>> GetAllUsersAsync()
    {
        var users = await _dbContext.Users
            .Select(u => new UserDto {
                ID = u.ID,
                FirstName = u.FirstName,
                LastName = u.LastName,
                PhoneNumber = u.PhoneNumber,
                Address = u.Address,
                City = u.City,
                Country = u.Country,
                Role = u.Role,
                Email = u.Email
            })
            .ToListAsync();

        return users;
    }

    public bool SharesWhidDSO(Guid userID)
    {
        bool sharesWithDSO = _dbContext.Users
                            .Where(u => u.ID == userID)
                            .Select(share => share.sharesDataWithDso)
                            .FirstOrDefault();

        return sharesWithDSO;
                            
    }

    public bool DSOHasControl(Guid userID)
    {
        bool sharesWithDSO = _dbContext.Users
                            .Where(u => u.ID == userID)
                            .Select(share => share.dsoHasControl)
                            .FirstOrDefault();

        return sharesWithDSO;

    }
    public async Task<Boolean> UpdateUserDataSharing(Guid id, Boolean sharesDataWithDso)
    {
        var user = await _dbContext.Users.FindAsync(id);
        if (user.Role != "RegularUser")
        {
            return false;
        }
        user.sharesDataWithDso = sharesDataWithDso;

        _dbContext.Users.Update(user);
        await _dbContext.SaveChangesAsync();
        return true;
    }
    public async Task<Boolean> UpdateUserDsoControl(Guid id, Boolean dsoHasControl)
    {
        var user = await _dbContext.Users.FindAsync(id);
        if(user.Role != "RegularUser")
        {
            return false;
        }
        user.dsoHasControl = dsoHasControl;

        _dbContext.Users.Update(user);
        await _dbContext.SaveChangesAsync();
        return true;
    }

}
