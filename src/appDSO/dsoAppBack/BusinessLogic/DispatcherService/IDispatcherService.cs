using dsoAppBack.Models;
using Microsoft.AspNetCore.Mvc;

namespace dsoAppBack.BusinessLogic.DispatcherService
{
    public interface IDispatcherService
    {
        Guid? GetID();
        string GetRole();
        Task<Dispatcher> GetUserByEmailAndPasswordAsync(string email, string password);
        Task<Dispatcher> CheckEmail(string email);
        Task<Dispatcher> CreateDispatcher(DispatcherRegisterDto dispatcherRegisterDto);
        Task<Dispatcher> CheckUsername(string username);
    }
}
