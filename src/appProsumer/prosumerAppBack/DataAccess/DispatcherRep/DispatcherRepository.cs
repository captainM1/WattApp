using prosumerAppBack.Helper;
using Microsoft.EntityFrameworkCore;
using prosumerAppBack.Models.Dispatcher;
using prosumerAppBack.Models;

namespace prosumerAppBack.DataAccess.DispatcherRep;

public class DispatcherRepository : IDispatcherRepository
{
    private readonly DataContext _dbContext;
    private readonly IPasswordHasher _passwordHasher;
    private readonly ITokenMaker _tokenMaker;

    public DispatcherRepository(DataContext dbContext, IPasswordHasher passwordHasher, ITokenMaker tokenMaker)
    {
        _dbContext = dbContext;
        _passwordHasher = passwordHasher;
        _tokenMaker = tokenMaker;
    }

    public async Task<Dispatcher> GetDispatcherByIdAsync(Guid id)
    {
        return await _dbContext.Dispatchers.FindAsync(id);
    }

    public async Task<Dispatcher> GetUserByEmailAndPasswordAsync(string email, string password)
    {
        var dispatcher = await _dbContext.Dispatchers.FirstOrDefaultAsync(u => u.Email == email);

        if (dispatcher == null)
        {
            return null;
        }
        if (!_passwordHasher.VerifyPassword(password, dispatcher.Salt, dispatcher.PasswordHash))
        {
            return null;
        }
        return dispatcher;
    }

    public async Task<Boolean> UpdatePassword(Guid id, string newPassword)
    {
        var user = await this.GetDispatcherByIdAsync(id);

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

    public async Task<Dispatcher> CreateDispatcher(DispatcherRegisterDto dispatcherRegisterDto)
    {
        byte[] salt;
        byte[] hash;
        (salt, hash) = _passwordHasher.HashPassword(dispatcherRegisterDto.Password);
        var newDispatcher = new Dispatcher
        {
            UserName = dispatcherRegisterDto.Username,
            Email = dispatcherRegisterDto.Email,
            Salt = salt,
            PasswordHash = hash,
            Role = "Dispatcher",
            ID = Guid.NewGuid(),
        };
        _dbContext.Dispatchers.Add(newDispatcher);
        await _dbContext.SaveChangesAsync();
        return newDispatcher;
    }

    public async Task<Dispatcher> GetDispatcherByEmailAsync(string email)
    {
        var dispatcher = await _dbContext.Dispatchers.FirstOrDefaultAsync(u => u.Email == email);

        if (dispatcher == null)
        {
            return null;
        }

        return dispatcher;
    }

    public async Task<Dispatcher> GetDispatcherByUsernameAsync(string username)
    {
        var dispatcher = await _dbContext.Dispatchers.FirstOrDefaultAsync(u => u.UserName == username);

        if (dispatcher == null)
        {
            return null;
        }

        return dispatcher;
    }

    public async Task<List<Dispatcher>> GetAllDispatchersAsync()
    {
        var dispatchers = await _dbContext.Dispatchers
            .Select(u => new Dispatcher
            {
                ID = u.ID,
                UserName = u.UserName,
                Role = u.Role,
                Email = u.Email
            })
            .ToListAsync();

        return dispatchers;
    }
}
