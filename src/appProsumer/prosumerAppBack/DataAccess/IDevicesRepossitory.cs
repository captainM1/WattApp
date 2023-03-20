using System;
using prosumerAppBack.Models;

namespace prosumerAppBack.BusinessLogic
{
	public interface IDevicesRepossitory
	{
		Task<Device> GetDeviceByIdAsync(Guid id);
		Task<Device> GetAllDevices();
	}
}

