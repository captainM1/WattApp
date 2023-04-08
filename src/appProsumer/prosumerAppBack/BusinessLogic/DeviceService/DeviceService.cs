using prosumerAppBack.DataAccess;
using prosumerAppBack.Models;
using prosumerAppBack.Models.Device;
using SendGrid.Helpers.Errors.Model;
using System.Text.RegularExpressions;

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

    public IEnumerable<object> GetDevicesInfoForUser(Guid userID)
    {
        var check = _repository.GetDevicesInfoForUser(userID);
        if (check == null)
        {
            throw new NotFoundException("User doesn't have any devices");
        }
        return check;
    }

    public IEnumerable<DeviceGroup> GetDeviceGroups()
    {
        var check = _repository.GetDeviceGroups();
        if (check == null)
        {
            throw new NotFoundException("No device group found");
        }
        return check;
    }

    public IEnumerable<DeviceManufacturers> GetDeviceManufacturers()
    {
        var check = _repository.GetDeviceManufacturers();
        if (check == null)
        {
            throw new NotFoundException("No device manufacturers found");
        }
        return check;
    }

    public IEnumerable<DeviceType> GetDevicesBasedOnGroup(Guid groupID)
    {
        var check = _repository.GetDevicesBasedOnGroup(groupID);
        if (check == null)
        {
            throw new NotFoundException("No devices of this group were found");
        }
        return check;
    }

    public IEnumerable<ManufacturerDto> GetManufacturersBasedOnGroup(Guid groupID)
    {
        var check = _repository.GetManufacturersBasedOnGroup(groupID);
        if (check == null)
        {
            throw new NotFoundException("No manufacturers of this device group were found");
        }
        return check;
    }

    public IEnumerable<DeviceType> GetDevicesBasedOnManufacturer(Guid maunfID)
    {
        var check = _repository.GetDevicesBasedOnManufacturer(maunfID);
        if (check == null)
        {
            throw new NotFoundException("No devices of this manufacturer were found");
        }
        return check;
    }

    public IEnumerable<DeviceType> GetDevicesBasedOnManufacturerAndGroup(Guid maunfID, Guid groupID)
    {
        var check = _repository.GetDevicesBasedOnManufacturerAndGroup(maunfID, groupID);
        if (check == null)
        {
            throw new NotFoundException("No devices of this manufacturer and device group were found");
        }
        return check;
    }

    public Task<List<DeviceInfo>> GetDeviceInfoForUser(Guid userID)
    {
        var check = _repository.GetDeviceInfoForUser(userID);
        if (check == null)
        {
            throw new NotFoundException("User has no devices.");
        }
        return check;
    }

    public Task<DeviceInfo> GetDeviceInfoForDevice(Guid deviceID)
    {
        var check = _repository.GetDeviceInfoForDevice(deviceID);
        if (check == null)
        {
            throw new NotFoundException("No device with given ID");
        }
        return check;
    }
    public async Task<bool> DeleteDevice(Guid deviceID)
    {
        try
        {
            return await _repository.DeleteDevice(deviceID);
        }
        catch(Exception ex)
        {
            throw new Exception("Failed to delete device: " + ex.Message);
        }
    }
}