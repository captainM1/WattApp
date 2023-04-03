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
        
        public IEnumerable<object> GetDevicesInfoForUser(Guid userID)
        {
            return _dbContext.Devices
                .Where(d => d.OwnerID == userID)
                .Include(d => d.DeviceType)
                .Select(d => new 
                { 
                    d.ID,
                    d.MacAdress,
                    DeviceTypeName = d.DeviceType.Name, 
                    ManufacturerID = d.DeviceType.ManufacturerID,
                })
                .Select(joined => new 
                {
                    DeviceId = joined.ID,
                    joined.MacAdress,
                    joined.DeviceTypeName,
                    ManufacturerName = _dbContext.DeviceManufacturers.FirstOrDefault(m => m.ID == joined.ManufacturerID).Name
                })
                .ToArray();
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
            return _dbContext.DeviceTypes.Where(d => d.ManufacturerID == maunfID)
                .GroupBy(d => d.Wattage)
                .Select(g => g.First());
        }
        
        public IEnumerable<DeviceType> GetDevicesBasedOnManufacturerAndGroup(Guid maunfID, Guid groupID)
        {
            return _dbContext.DeviceTypes.Where(d => d.ManufacturerID == maunfID && d.GroupID == groupID);
        }

        public async Task<Device> AddDevice(AddDeviceDto addDeviceDto)
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

        public IEnumerable<ManufacturerDto> GetManufacturersBasedOnGroup(Guid groupID)
        {
            var manufacturers = _dbContext.DeviceTypes
                .Include(dt => dt.Manufacturer)
                .Where(dt => dt.GroupID == groupID)
                .Select(dt => new ManufacturerDto
                {
                    ManufacturerID = dt.Manufacturer.ID,
                    ManufacturerName = dt.Manufacturer.Name
                })
                .Distinct();

            return manufacturers;
        }

        public Task<List<DeviceInfo>> GetDeviceInfoForUser(Guid userID)
        {
            return _dbContext.Devices
                .Include(d => d.DeviceType)
                .ThenInclude(dt => dt.Manufacturer)
                .Where(d => d.OwnerID == userID)
                .Select(d => new DeviceInfo()
                {
                    deviceId = d.ID,
                    deviceTypeName = d.DeviceType.Name,
                    macAdress = d.MacAdress,
                    manufacturerName = d.DeviceType.Manufacturer.Name
                })
                .ToListAsync();
        }

        
        public Task<DeviceInfo> GetDeviceInfoForDevice(Guid deviceID)
        {
            return _dbContext.Devices
                .Include(d => d.DeviceType)
                .ThenInclude(dt => dt.Manufacturer)
                .Where(d => d.ID == deviceID)
                .Select(d => new DeviceInfo()
                {
                    deviceId = d.ID,
                    deviceTypeName = d.DeviceType.Name, 
                    macAdress = d.MacAdress,
                    manufacturerName = d.DeviceType.Manufacturer.Name
                })
                .FirstOrDefaultAsync();
        }
    }

    public class DeviceInfo
    {
        public Guid deviceId { get; set; }
        public string deviceTypeName { get; set; }
        public string macAdress { get; set; }
        public string manufacturerName { get; set; }
    }

    public class ManufacturerDto
    {
        public Guid ManufacturerID { get; set; }
        public string ManufacturerName { get; set; }
    }
}

