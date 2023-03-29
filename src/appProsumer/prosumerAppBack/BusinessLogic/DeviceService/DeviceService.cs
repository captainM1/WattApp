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
        return _repository.GetDevicesForUser(userID);
    }
    public async Task<Device> GetDeviceById(Guid id)
    {
        var device = await _repository.GetDeviceByIdAsync(id);
        if (device == null)
        {
            throw new NotFoundException("Customer not found");
        }
        return device;
    }
    public async Task<IEnumerable<Device>> GetAllDevices()
    {
        var devices = await _repository.GetAllDevices();
        if (devices == null)
        {
            throw new NotFoundException("No devices found");
        }

        return devices;
    }
    public async Task<Boolean> UpdateDevice(Guid id, UpdateDeviceDto deviceUpdateDto)
    {
        if(id == null)
        {
            throw new NotFoundException("device not found");
        }
        if (deviceUpdateDto == null)
        {
            throw new NotFoundException("device info required");
        }
        var check = await _repository.UpdateDevice(id, deviceUpdateDto);
        if (!check)
        {
            throw new NotFoundException("device not updated");
        }
        return await _repository.UpdateDevice(id, deviceUpdateDto);
    }
    public async Task<Device> AddDevice(AddDeviceDto addDeviceDto)
    {
        if (addDeviceDto == null)
        {
            throw new NotFoundException("device not updated");
        }
        var check = await _repository.AddDevice(addDeviceDto);
        if (check == null)
        {
            throw new NotFoundException("device not added");
        }
        return await _repository.AddDevice(addDeviceDto);
    }
}