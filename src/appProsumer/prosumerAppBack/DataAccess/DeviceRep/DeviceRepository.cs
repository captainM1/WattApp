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
        private readonly IUserService _userService;

        public DeviceRepository(DataContext dbContext,UserService userService)
        {
            _dbContext = dbContext;
            _userService = userService;
        }

        public async Task<Device> GetDeviceByIdAsync(Guid id)
        {
            return _dbContext.Devices.FirstOrDefault(d => d.ID == id);
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
            updatedDevice.MacAdress = deviceUpdateDto.MacAdress;

            _dbContext.Devices.Update(updatedDevice);
            await _dbContext.SaveChangesAsync();

            return true;
        }
        public IEnumerable<Device> GetDevicesForUser(Guid userID)
        {
            return _dbContext.Devices.Where(d => d.OwnerID == userID).ToArray();
        }
        
        public IEnumerable<DeviceGroup> GetDeviceGroups()
        {
            return _dbContext.DeviceGroups.ToArray();
        }
        public IEnumerable<DeviceManufacturers> GetDeviceManufacturers()
        {
            return _dbContext.DeviceManufacturers.ToArray();
        }

        public IEnumerable<DeviceType> GetDevicesBasedOnGroup(Guid groupID)
        {
            return _dbContext.DeviceTypes.Where(d => d.GroupID == groupID);
        }

        public IEnumerable<DeviceType> GetDevicesBasedOnManufacturer(Guid maunfID)
        {
            return _dbContext.DeviceTypes.Where(d => d.ManufacturerID == maunfID);
        }

        public async Task<Device> AddDevice(Models.Device.AddDeviceDto addDeviceDto)
        {
            var newDevice = new Device
            {
                ID = Guid.NewGuid(),
                OwnerID = _userService.GetID().Value,
                MacAdress = addDeviceDto.MacAdress,
                DeviceTypeID = addDeviceDto.DeviceTypeID
            };

            _dbContext.Devices.Add(newDevice);
            await _dbContext.SaveChangesAsync();
            return newDevice;
        }
    }
}

