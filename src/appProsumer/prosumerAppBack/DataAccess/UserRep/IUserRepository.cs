using prosumerAppBack.Models;


public interface IUserRepository
{
    Task<User> GetUserByIdAsync(Guid id);
    Task<User> GetUserByEmailAndPasswordAsync(string email, string password);
    Task<User> CreateUser(UserRegisterDto userRegisterDto);
    Task<User> GetUserByEmailAsync(string email);    
    Task<Boolean> UpdatePassword(Guid id, string newPassword);
    Task<int> UpdateUser(Guid id, UserUpdateDto userUpdateDto);
    Task<List<UserDto>> GetAllUsersAsync(int pageNumber, int pageSize);
    Task<Boolean> CreateUserRequestToDso(User user);
    Task<int> GetNumberOfUsers();
    Task<List<UserDto>> GetAllUsersAsync();
    Task<Boolean> ApproveUserRequestToDso(Guid id);
    Task<Boolean> DeclineUserRequestToDso(Guid id);
}