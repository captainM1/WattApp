using prosumerAppBack.DataAccess;
using prosumerAppBack.Models.Device;

namespace prosumerAppBack.BusinessLogic.DeviceService;

public class DeviceService:IDeviceService
{
    private readonly IDeviceRepository _repository;

    public DeviceService(IDeviceRepository repository)
    {
        _repository = repository;
    }
    public IEnumerable<Device> GetDevicesForUser(Guid userID)
    {
        return _repository.GetDevicesForUser(userID);
    }
}