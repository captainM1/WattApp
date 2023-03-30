namespace prosumerAppBack.BusinessLogic;

public interface IUserService
{
    Guid? GetID();
    string GetRole();
    Task<IEnumerable<object>> GetCoordinatesForAllUsers();

    public Task<object> GetCoordinatesForUser(Guid id);
}