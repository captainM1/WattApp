using Microsoft.AspNetCore.Components;
using prosumerAppBack.Models.Dispatcher;
using Dispatcher = prosumerAppBack.Models.Dispatcher.Dispatcher;

namespace prosumerAppBack.BusinessLogic.DispatcherService
{
    public interface IDispatcherService
    {
        Guid? GetID();
        string GetRole();
        Task<Dispatcher> GetUserByEmailAndPasswordAsync(string email, string password);
        Task<Dispatcher> CheckEmail(string email);
        Task<Dispatcher> CreateDispatcher(DispatcherRegisterDto dispatcherRegisterDto);
        Task<Dispatcher> CheckUsername(string username);
        Task<List<Dispatcher>> GetAllDispatchersAsync();
    }
}
