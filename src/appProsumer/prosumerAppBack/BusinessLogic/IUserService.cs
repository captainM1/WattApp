namespace prosumerAppBack.BusinessLogic;

public interface IUserService
{
    string GetID();
    string GetRole();
    Task<IEnumerable<object>> GetCoordinatesForAllUsers();
}