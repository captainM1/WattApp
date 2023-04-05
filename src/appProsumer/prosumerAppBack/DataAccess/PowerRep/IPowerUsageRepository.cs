using System;
using MongoDB.Driver;
using prosumerAppBack.Models;

namespace prosumerAppBack.BusinessLogic
{
	public interface IPowerUsageRepository
	{
		public PowerUsage GetForDevice(Guid deviceID);
		public double CurrentSumPowerUsage(Guid userID);
        public double GetPowerUsageForDay(Guid deviceId, DateTime today);
        
        public PowerUsage GetPowerUsageFor7Days(Guid deviceId, int direction);

        public double CurrentPowerUsage(Guid userID);

        public double GetPowerUsageForAMonthSystem(int direction);
        public Dictionary<Guid, double> GetPowerUsageSumByDevice(int direction);
        public Dictionary<DateTime, double> GetPowerUsagesForEachDay(int direction);
        public double GetAveragePowerUsageByUser(Guid userID);
        public Dictionary<Guid, List<double>> GetPowerUsageForDevices(Guid userId, int direction);
        public List<double> GetPowerUsageForDevice(Guid deviceID, int direction);
    }
}