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
	}
}