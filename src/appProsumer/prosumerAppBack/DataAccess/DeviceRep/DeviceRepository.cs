using MongoDB.Driver;
using prosumerAppBack.Models;

namespace prosumerAppBack.DataAccess
{
	public class DeviceRepository
	{
		private readonly MongoDataContext _mongoDataContext;

        public DeviceRepository(MongoDataContext mongoDataContext)
        {
            _mongoDataContext = mongoDataContext;
        }

        public async Task<Device> GetDeviceByIdAsync(Guid id)
        {
            var device = await _mongoDataContext.Devices.Find(d => d.ID == id).FirstOrDefaultAsync();
            if(device == null)
            {
                return null;
            }

            return device;
        }

        public async Task<List<Device>> GetAllDevices()
        {
            var devices = await _mongoDataContext.Devices.Find(_ => true).ToListAsync();
            if(devices == null)
            {
                return null;
            }

            return devices;
        }
    }
}

