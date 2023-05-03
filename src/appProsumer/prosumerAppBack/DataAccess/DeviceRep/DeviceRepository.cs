using Microsoft.AspNetCore.Mvc;
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
        
        public async Task<Boolean> UpdateDevice(Guid id, UpdateDeviceDto deviceUpdateDto)
        {
            var updatedDevice = await _dbContext.Devices.FirstOrDefaultAsync(d => d.ID == id);
            if (deviceUpdateDto == null)
            {
                return false;
            }
            updatedDevice.MacAdress = deviceUpdateDto.MacAdress;
            updatedDevice.IsOn = deviceUpdateDto.IsOn;
            updatedDevice.sharesDataWithDso = deviceUpdateDto.sharesDataWithDso;
            updatedDevice.dsoHasControl = deviceUpdateDto.dsoHasControl;
            updatedDevice.DeviceName = deviceUpdateDto.DeviceName;
            updatedDevice.MacAdress = deviceUpdateDto.MacAdress;

            _dbContext.Devices.Update(updatedDevice);
            await _dbContext.SaveChangesAsync();

            return true;
        }
        public List<Device> GetDevicesForUser(Guid userID)
        {
            return _dbContext.Devices.Where(d => d.OwnerID == userID).ToList();
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
                DeviceName = addDeviceDto.DeviceName,
                DeviceTypeID = addDeviceDto.DeviceTypeID,
                sharesDataWithDso = addDeviceDto.sharesDataWithDso,
                dsoHasControl = addDeviceDto.dsoHasControl
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
                .Include(d => d.DeviceType)
                .ThenInclude(dt => dt.Group)
                .Where(d => d.ID == deviceID)
                .Select(d => new DeviceInfo()
                {
                    deviceId = d.ID,
                    deviceTypeName = d.DeviceType.Name, 
                    macAdress = d.MacAdress,
                    manufacturerName = d.DeviceType.Manufacturer.Name,
                    groupName = d.DeviceType.Group.Name
                })
                .FirstOrDefaultAsync();   
        }

        public IEnumerable<DeviceInfoWithType> GetDeviceInfoForAllDevice()
        {
            return _dbContext.Devices
                .Include(d => d.DeviceType)
                .ThenInclude(dt => dt.Group)
                .Select(d => new DeviceInfoWithType()
                {
                    deviceTypeId = d.ID,
                    deviceTypeName = d.DeviceType.Name,
                    groupName = d.DeviceType.Group.Name
                })
                .ToList();
        }

        public async Task<DeviceRule> AddDeviceRule(Guid id, [FromBody] DeviceRuleDto deviceRuleDto)
        {
            var newRule = new DeviceRule
            {
                DeviceID = id,
                TurnOn = deviceRuleDto.TurnOn,
                TurnOnStatus = deviceRuleDto.TurnOnStatus,
                TurnOff = deviceRuleDto.TurnOff,
                TurnOffStatus = deviceRuleDto.TurnOffStatus,
                TurnOnEvery = deviceRuleDto.TurnOnEvery,
                TurnOnEveryStatus = deviceRuleDto.TurnOnEveryStatus,
            };

            _dbContext.DeviceRules.Add(newRule);
            await _dbContext.SaveChangesAsync();
            return newRule;
        }

        public async Task<DeviceRule> UpdateDeviceRule(Guid id, [FromBody] DeviceRuleDto deviceRuleDto)
        {
            var deviceRuleToBeUpdated = await _dbContext.DeviceRules.FirstOrDefaultAsync(d => d.DeviceID == id);
            if (deviceRuleToBeUpdated == null)
            {
                throw new NullReferenceException("Device id not found");
            }

            deviceRuleToBeUpdated.TurnOn = deviceRuleDto.TurnOn;
            deviceRuleToBeUpdated.TurnOnStatus = deviceRuleDto.TurnOnStatus;
            deviceRuleToBeUpdated.TurnOff = deviceRuleDto.TurnOff;
            deviceRuleToBeUpdated.TurnOffStatus = deviceRuleDto.TurnOffStatus;
            deviceRuleToBeUpdated.TurnOnEvery = deviceRuleDto.TurnOnEvery;
            deviceRuleToBeUpdated.TurnOnEveryStatus = deviceRuleDto.TurnOnEveryStatus;

            _dbContext.DeviceRules.Update(deviceRuleToBeUpdated);
            await _dbContext.SaveChangesAsync();

            return deviceRuleToBeUpdated;
        }

        public async Task<DeviceRequirement> AddDeviceRequirement(Guid id, [FromBody] DeviceRequirementDto deviceRequirementDto)
        {
            var newRequirement = new DeviceRequirement
            {
                DeviceID = id,
                ChargedUpTo = deviceRequirementDto.ChargedUpTo,
                ChargedUpToStatus = deviceRequirementDto.ChargedUpToStatus,
                ChargedUntil = deviceRequirementDto.ChargedUntil,
                ChargedUntilBattery = deviceRequirementDto.ChargedUntilBattery,
                ChargedUntilBatteryStatus = deviceRequirementDto.ChargedUntilBatteryStatus,
                ChargeEveryDay = deviceRequirementDto.ChargeEveryDay,
                ChargeEveryDayStatus = deviceRequirementDto.ChargeEveryDayStatus,
            };

            _dbContext.DeviceRequirements.Add(newRequirement);
            await _dbContext.SaveChangesAsync();
            return newRequirement;
        }

        public async Task<DeviceRequirement> UpdateDeviceRequirement(Guid id, [FromBody] DeviceRequirementDto deviceRequirementDto)
        {
            var deviceRequirementToBeUpdated = await _dbContext.DeviceRequirements.FirstOrDefaultAsync(d => d.DeviceID == id);
            if(deviceRequirementToBeUpdated == null)
            {
                throw new NullReferenceException("Device id not found");
            }

            deviceRequirementToBeUpdated.ChargedUpTo = deviceRequirementDto.ChargedUpTo;
            deviceRequirementToBeUpdated.ChargedUpToStatus = deviceRequirementDto.ChargedUpToStatus;
            deviceRequirementToBeUpdated.ChargedUntil = deviceRequirementDto.ChargedUntil;
            deviceRequirementToBeUpdated.ChargedUntilBattery = deviceRequirementDto.ChargedUntilBattery;
            deviceRequirementToBeUpdated.ChargedUntilBatteryStatus = deviceRequirementDto.ChargedUntilBatteryStatus;
            deviceRequirementToBeUpdated.ChargeEveryDay = deviceRequirementDto.ChargeEveryDay;
            deviceRequirementToBeUpdated.ChargeEveryDayStatus = deviceRequirementDto.ChargeEveryDayStatus;

            _dbContext.DeviceRequirements.Update(deviceRequirementToBeUpdated);
            await _dbContext.SaveChangesAsync();

            return deviceRequirementToBeUpdated;
        }

        public async Task<bool> DeleteDevice(Guid deviceID)
        {
            var device = _dbContext.Devices.FirstOrDefaultAsync(d => d.ID == deviceID);

            if (device.Result != null)
            {
                _dbContext.Devices.Remove(device.Result);
                await _dbContext.SaveChangesAsync();
                return true;
            }

            return false;
        }
    }

    public class DeviceInfo
    {
        public Guid deviceId { get; set; }
        public string deviceTypeName { get; set; }
        public string macAdress { get; set; }
        public string manufacturerName { get; set; }       
        public string groupName { get; set; }
    }

    public class DeviceInfoWithType
    {
        public Guid deviceTypeId { get; set; }
        public string deviceTypeName { get; set; }
        public string groupName { get; set; }
    }

    public class ManufacturerDto
    {
        public Guid ManufacturerID { get; set; }
        public string ManufacturerName { get; set; }
    }
}

