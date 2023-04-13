using System;
using MongoDB.Driver;
using prosumerAppBack.DataAccess;
using prosumerAppBack.Models;

namespace prosumerAppBack.BusinessLogic
{
	public interface IPowerUsageRepository
	{
		public PowerUsage GetForDevice(Guid deviceID);
		public double CurrentSumPowerUsage(Guid userID);
        public double GetPowerUsageForDay(Guid deviceId, DateTime today);
        
        public PowerUsage GetPowerUsageFor7Days(Guid deviceId, int direction);

        public double GetPowerUsageForAMonthSystem(int direction);
        public Dictionary<Guid, double> GetPowerUsageSumByDevice(int direction);
        public Dictionary<DateTime, double> GetPowerUsagesForEachDay(int direction);
        public double GetAveragePowerUsageByUser(Guid userID);
        public Dictionary<Guid, List<double>> GetPowerUsageForDevices(Guid userId, int direction);
        public List<double> GetPowerUsageForDevice(Guid deviceID, int direction);
        public Dictionary<DateTime, double> GetPowerUsageForDevicePast24Hours(Guid deviceID, int direction);
        public Dictionary<DateTime, double> GetPowerUsageForDeviceNext24Hours(Guid deviceID);
        public Task<bool> DeleteDevice(Guid deviceID);
        Dictionary<DateTime, double> GetPowerUsageForADaySystem();
        public double GetCurrentPowerUsage();
        public double GetCurrentPowerUsageForDevice(Guid deviceID);
        public double CurrentSumPowerUsageSystem();
        
        public IEnumerable<TimestampPowerPair> GetForDeviceByHour(Guid deviceID);
	}
}