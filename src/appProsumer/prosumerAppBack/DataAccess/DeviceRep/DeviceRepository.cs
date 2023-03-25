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
        public async Task<Boolean> UpdateDevice(Guid id, UpdateDeviceDto deviceUpdateDto)
        {
            var updatedDevice = await _dbContext.Devices.FirstOrDefaultAsync(d => d.ID == id);
            if (deviceUpdateDto == null)
            {
                return false;
            }
            updatedDevice.Manufacturer = deviceUpdateDto.Manufacturer;
            updatedDevice.UsageFrequency = deviceUpdateDto.UsageFrequency;
            updatedDevice.MacAdress = deviceUpdateDto.MacAdress;
            updatedDevice.Name = deviceUpdateDto.Name;
            updatedDevice.DeviceAge = deviceUpdateDto.DeviceAge;
            updatedDevice.Wattage = deviceUpdateDto.Wattage;



            _dbContext.Devices.Update(updatedDevice);
            await _dbContext.SaveChangesAsync();

            return true;
        }
    }
}

