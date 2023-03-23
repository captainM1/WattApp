using Microsoft.EntityFrameworkCore;
using MongoDB.Driver;
using prosumerAppBack.Models;

namespace prosumerAppBack.DataAccess
{
	public class DeviceRepository
    {
        private readonly DataContext _dbContext;

        public DeviceRepository(DataContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<Device> GetDeviceByIdAsync(Guid id)
        {
            return await _dbContext.Devices.FirstOrDefaultAsync(d => d.ID == id);
        }

        public async Task<List<Device>> GetAllDevices()
        {
            return await _dbContext.Devices.ToListAsync();
        }
    }
}

