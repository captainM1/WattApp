using prosumerAppBack.Models.Device;

namespace prosumerAppBack.BusinessLogic.DeviceService;

public interface IDeviceService
{
    IEnumerable<Device> GetDevicesForUser(Guid userID);
    Task<Device> GetDeviceById(Guid id);
    Task<IEnumerable<Device>> GetAllDevices();
    Task<Boolean> UpdateDevice(Guid id, UpdateDeviceDto deviceUpdateDto);
    Task<Device> AddDevice(AddDeviceDto addDeviceDto);
}