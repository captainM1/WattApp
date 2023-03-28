using System;
using prosumerAppBack.Models;
using prosumerAppBack.Models.Device;

namespace prosumerAppBack.BusinessLogic
{
	public interface IDeviceRepository
	{
		Task<Boolean> UpdateDevice(Guid id,UpdateDeviceDto updateDeviceDto);
        
        IEnumerable<Device> GetDevicesForUser(Guid userID);
        
        Task<Device> GetDeviceByIdAsync(Guid id);
        Task<List<Device>> GetAllDevices();
        Task<Device> AddDevice(Models.Device.AddDeviceDto addDeviceDto);
    }
}

