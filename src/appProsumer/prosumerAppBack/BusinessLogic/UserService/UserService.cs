using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using prosumerAppBack.DataAccess;

namespace prosumerAppBack.BusinessLogic;

public class UserService:IUserService
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    private readonly DataContext _dbContext;
    private readonly HttpClient _httpClient;
    public UserService(IHttpContextAccessor httpContextAccessor, HttpClient httpClient, DataContext dbContext)
    {
        _httpContextAccessor = httpContextAccessor;
        _httpClient = httpClient;
        _dbContext = dbContext;
    }
    public string GetID()
    {
        var ID = string.Empty;

        if (_httpContextAccessor.HttpContext != null)
            ID = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Name);

        return ID;
    }
    public string GetRole()
    {
        var role = string.Empty;

        if (_httpContextAccessor.HttpContext != null)
            role = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Role);

        return role;
    }
    public async Task<IEnumerable<object>> GetCoordinatesForAllUsers()
    {
        var bingMapsApiKey = "AjxCmzN-m_jJJS97ob2OeGpEhL4afHaUSYTKRhRa1BzCAzc9A6Wri3lB6QjzxYBp";

        var results = new List<object>();
        var addresses = await _dbContext.Users
            .Select(u => new 
            {
                u.Address,
                u.City,
                u.Country
            })
            .ToListAsync();

        foreach (var address in addresses)
        {
            var addressFull = $"{address.Address} {address.City} {address.Country}";
            Console.WriteLine(addressFull);
            var urlBuilder = new UriBuilder("http://dev.virtualearth.net/REST/v1/Locations");
            urlBuilder.Query = $"q={Uri.EscapeDataString(addressFull)}&key={bingMapsApiKey}";

            var url = urlBuilder.ToString();
            
            var response = await _httpClient.GetAsync(url);
            var responseString = await response.Content.ReadAsStringAsync();

            var data = JObject.Parse(responseString);
            var location = data["resourceSets"][0]["resources"][0]["point"]["coordinates"];

            results.Add(new
            {
                Address = address, 
                Coordinates = JsonConvert.SerializeObject(location)
            });
        }

        return results;
    }
}