using Microsoft.EntityFrameworkCore;
using MongoDB.Driver;
using prosumerAppBack.Models;
using prosumerAppBack.Models.Device;

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

        public async Task<Device> AddDevice(Models.Device.AddDeviceDto addDeviceDto)
        {
            var newDevice = new Device
            {
                ID = Guid.NewGuid(),
                Name = addDeviceDto.Name,
                Manufacurer = addDeviceDto.Manufacurer,
                Wattage = addDeviceDto.Wattage,
                UsageFrequency = addDeviceDto.UsageFrequency,
                MacAdress = addDeviceDto.MacAdress,
                UsageTime = addDeviceDto.UsageTime
            };

            _dbContext.Devices.Add(newDevice);
            await _dbContext.SaveChangesAsync();
            return newDevice;
        }
    }
}

