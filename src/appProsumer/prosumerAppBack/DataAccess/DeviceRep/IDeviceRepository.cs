using System;
using Microsoft.AspNetCore.Mvc;
using prosumerAppBack.DataAccess;
using prosumerAppBack.Models;
using prosumerAppBack.Models.Device;

namespace prosumerAppBack.BusinessLogic
{
	public interface IDeviceRepository
	{
		Task<Boolean> UpdateDevice(Guid id,UpdateDeviceDto updateDeviceDto);    
        List<Device> GetDevicesForUser(Guid userID);
        Task<Device> AddDevice(Models.Device.AddDeviceDto addDeviceDto);
        public IEnumerable<DeviceGroup> GetDeviceGroups();
        public IEnumerable<DeviceManufacturers> GetDeviceManufacturers();     
        public IEnumerable<DeviceType> GetDevicesBasedOnGroup(Guid groupID);   
        public IEnumerable<DeviceType> GetDevicesBasedOnManufacturer(Guid maunfID);
        public IEnumerable<DeviceType> GetDevicesBasedOnManufacturerAndGroup(Guid maunfID, Guid groupID);
        public IEnumerable<object> GetDevicesInfoForUser(Guid userID);
        public IEnumerable<ManufacturerDto> GetManufacturersBasedOnGroup(Guid groupID);
        public Task<List<DeviceInfo>> GetDeviceInfoForUser(Guid userID);       
        public Task<DeviceInfo> GetDeviceInfoForDevice(Guid deviceID);
        IEnumerable<DeviceInfoWithType> GetDeviceInfoForAllDevice();
        Task<DeviceRule> UpdateDeviceRule(Guid id, [FromBody] DeviceRuleDto deviceRuleDto);
        Task<DeviceRule> AddDeviceRule(Guid id, [FromBody] DeviceRuleDto deviceRuleDto);
        Task<DeviceRequirement> UpdateDeviceRequirement(Guid id, [FromBody] DeviceRequirementDto deviceRequirementDto);
        Task<DeviceRequirement> AddDeviceRequirement(Guid id, [FromBody] DeviceRequirementDto deviceRequirementDto);        
        public Task<bool> DeleteDevice(Guid deviceID);
        Task<bool> UpdateDeviceState(DeviceStateDto deviceStateDto);
        public Boolean IsDeviceTurnedOn(Guid deviceID);
    }
}

