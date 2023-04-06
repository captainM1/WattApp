using Microsoft.AspNetCore.Mvc;
using prosumerAppBack.DataAccess;
using prosumerAppBack.Models.Device;

namespace prosumerAppBack.BusinessLogic.DeviceService;

public interface IDeviceService
{
    IEnumerable<Device> GetDevicesForUser(Guid userID);
    Task<Boolean> UpdateDevice(Guid id, UpdateDeviceDto deviceUpdateDto);
    Task<Device> AddDevice(AddDeviceDto addDeviceDto);
    IEnumerable<object> GetDevicesInfoForUser(Guid userID);
    IEnumerable<DeviceGroup> GetDeviceGroups();
    IEnumerable<DeviceManufacturers> GetDeviceManufacturers();
    IEnumerable<DeviceType> GetDevicesBasedOnGroup(Guid groupID);
    IEnumerable<ManufacturerDto> GetManufacturersBasedOnGroup(Guid groupID);
    IEnumerable<DeviceType> GetDevicesBasedOnManufacturer(Guid maunfID);
    IEnumerable<DeviceType> GetDevicesBasedOnManufacturerAndGroup(Guid maunfID, Guid groupID);
    Task<List<DeviceInfo>> GetDeviceInfoForUser(Guid userID);
    
    public Task<DeviceInfo> GetDeviceInfoForDevice(Guid deviceID);
    Task<DeviceRule> updateDeviceRule(Guid id, [FromBody] DeviceRule deviceRule);
    Task<DeviceRule> addDeviceRule(Guid id, [FromBody] DeviceRule deviceRule);
}