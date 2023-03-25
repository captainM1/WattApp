using System;
using prosumerAppBack.Models;
using prosumerAppBack.Models.Device;

namespace prosumerAppBack.BusinessLogic
{
	public interface IDevicesRepossitory
	{
		Task<Device> GetDeviceByIdAsync(Guid id);
		Task<Device> GetAllDevices();
        Task<Boolean> UpdateDevice(Guid id,UpdateDeviceDto updateDeviceDto);
    }
}

