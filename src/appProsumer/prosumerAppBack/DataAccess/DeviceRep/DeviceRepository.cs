using Microsoft.EntityFrameworkCore;
using MongoDB.Driver;
using prosumerAppBack.BusinessLogic;
using prosumerAppBack.Models;
using prosumerAppBack.Models.Device;

namespace prosumerAppBack.DataAccess
{
	public class DeviceRepository: IDeviceRepository
    {
        private readonly DataContext _dbContext;

        public DeviceRepository(DataContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<Device> GetDeviceByIdAsync(Guid id)
        {
            return await _dbContext.Devices.FindAsync(id);
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
            updatedDevice.MacAdress = deviceUpdateDto.MacAdress;
            updatedDevice.Name = deviceUpdateDto.Name;
            updatedDevice.Wattage = deviceUpdateDto.Wattage;



            _dbContext.Devices.Update(updatedDevice);
            await _dbContext.SaveChangesAsync();

            return true;
        }
        public IEnumerable<Device> GetDevicesForUser(Guid userID)
        {
            var devices = from deviceOwner in _dbContext.Set<DeviceOwners>()
                join device in _dbContext.Set<Device>() on deviceOwner.DeviceID equals device.ID
                where deviceOwner.UserID == userID
                select device;
                      
            return devices.ToList();
        }

        public async Task<Device> AddDevice(Models.Device.AddDeviceDto addDeviceDto)
        {
            var newDevice = new Device
            {
                ID = Guid.NewGuid(),
                Name = addDeviceDto.Name,
                Manufacturer = addDeviceDto.Manufacturer,
                Wattage = addDeviceDto.Wattage,
                MacAdress = addDeviceDto.MacAdress,
            };

            _dbContext.Devices.Add(newDevice);
            await _dbContext.SaveChangesAsync();
            return newDevice;
        }
    }
}

