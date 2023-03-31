using System;
using MongoDB.Driver;
using prosumerAppBack.Models;

namespace prosumerAppBack.BusinessLogic
{
	public interface IPowerUsageRepository
	{
		public IEnumerable<PowerUsage> Get();

		public PowerUsage GetForDevice(Guid deviceID);
		public IEnumerable<PowerUsage> PreviousSevenDays();
        public IEnumerable<PowerUsage> NextSevenDays();
        public double CurrentSumPowerUsage(Guid userID);
        public double GetPowerUsageForDay(Guid deviceId, DateTime today);
        
        public PowerUsage GetPowerUsageFor7Days(Guid deviceId, int direction);

        public double CurrentPowerUsage(Guid userID);
	}
}