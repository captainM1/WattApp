using prosumerAppBack.DataAccess;
using prosumerAppBack.Models.Device;
using SendGrid.Helpers.Errors.Model;

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
        var devices = _repository.GetDevicesForUser(userID);
        if (devices == null)
        {
            throw new NotFoundException();
        }
        return devices;
    }
    public async Task<Device> GetDeviceById(Guid id)
    {
        var device = await _repository.GetDeviceByIdAsync(id);
        if (device == null)
        {
            throw new NullReferenceException("Customer not found");
        }
        return device;
    }
    public async Task<IEnumerable<Device>> GetAllDevices()
    {
        var devices = await _repository.GetAllDevices();
        if (devices == null)
        {
            throw new NullReferenceException("No devices found");
        }

        return devices;
    }
    public async Task<Boolean> UpdateDevice(Guid id, UpdateDeviceDto deviceUpdateDto)
    {
        if(id == null)
        {
            throw new NullReferenceException("device not found");
        }
        if (deviceUpdateDto == null)
        {
            throw new NullReferenceException("device info required");
        }
        var check = await _repository.UpdateDevice(id, deviceUpdateDto);
        if (!check)
        {
            throw new NotFoundException("device not updated");
        }
        return check;
    }
    public async Task<Device> AddDevice(AddDeviceDto addDeviceDto)
    {
        if (addDeviceDto == null)
        {
            throw new NullReferenceException("device info required");
        }
        var check = await _repository.AddDevice(addDeviceDto);
        if (check == null)
        {
            throw new NotFoundException("device not added");
        }
        return check;
    }
}