using System;
using prosumerAppBack.DataAccess;
using prosumerAppBack.Models;
using prosumerAppBack.Models.Device;

namespace prosumerAppBack.BusinessLogic
{
	public interface IDeviceRepository
	{
		Task<Device> GetDeviceByIdAsync(Guid id);
		Task<List<Device>> GetAllDevices();
        Task<Boolean> UpdateDevice(Guid id,UpdateDeviceDto updateDeviceDto);
        
        IEnumerable<Device> GetDevicesForUser(Guid userID);
        Task<Device> AddDevice(Models.Device.AddDeviceDto addDeviceDto);

        public IEnumerable<DeviceGroup> GetDeviceGroups();

        public IEnumerable<DeviceManufacturers> GetDeviceManufacturers();
        
        public IEnumerable<DeviceType> GetDevicesBasedOnGroup(Guid groupID);
        
        public IEnumerable<DeviceType> GetDevicesBasedOnManufacturer(Guid maunfID);

        public IEnumerable<DeviceType> GetDevicesBasedOnManufacturerAndGroup(Guid maunfID, Guid groupID);

        public IEnumerable<object> GetDevicesInfoForUser(Guid userID);

        public IEnumerable<ManufacturerDto> GetManufacturersBasedOnGroup(Guid groupID);
        public object GetDeviceInfoForUser(Guid userID, Guid deviceID);
	}
}

