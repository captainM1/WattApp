using prosumerAppBack.Models;

namespace prosumerAppBack.BusinessLogic;

public interface IUserService
{
    Guid? GetID();
    string GetRole();
    Task<IEnumerable<object>> GetCoordinatesForAllUsers();   
    Task<User> GetUserByEmailAsync(string email);
    Task<User> CreateUser(UserRegisterDto userRegisterDto);
    Task<User> GetUserByEmailAndPasswordAsync(string email, string password);
    Task<User> GetUserByIdAsync(Guid id);
    Task<List<UserDto>> GetAllUsersAsync(int pageNumber, int pageSize);
    Task<int> UpdateUser(Guid id, UserUpdateDto userUpdateDto);
    Task<Boolean> UpdatePassword(Guid id, string oldPassword, string newPassword);
    Task<Boolean> CreateUserRequestToDso(Guid userID);
    Task<User> CheckEmail(string email);
    Task<object> GetCoordinatesForUser(Guid id);
    Task<int> GetNumberOfUsers();
    Task<List<UserDto>> GetAllUsersAsync();
    Task<Boolean> ApproveUserRequestToDso(Guid id);
    Task<Boolean> DeclineUserRequestToDso(Guid id);
    Task CreatePasswordResetToken(string email);
    Task<User> GetUserByPasswordResetTokenAsync(string passwordResetToken);
    Task ResetPasswordToken(string token);
    public bool DSOHasControl(Guid userID);
    public bool SharesWhidDSO(Guid userID);
    Task<User> DisconnectFromDso(Guid id);
    Task<Boolean> UpdateUserDataSharing(Guid id, Boolean sharesDataWithDso);
    Task<Boolean> UpdateUserDsoControl(Guid id, Boolean dsoHasControl);
    Task<List<UsersRequestedToDso>> GetUsersAppliedToDso();
    Task<Boolean> UserAllreadyAppliedToDso(Guid id);
    Task<Boolean> RemoveUserRequestToDso(Guid id);
}