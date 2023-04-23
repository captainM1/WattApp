using System;
using MongoDB.Driver;
using prosumerAppBack.DataAccess;
using prosumerAppBack.Models;

namespace prosumerAppBack.BusinessLogic
{
	public interface IPowerUsageRepository
	{
		public double GetForDevice(Guid deviceID);
        public double AveragePowerUsageProduction(Guid userID); // prosecna potrosnja svih uredjaja korisnika inace
        public double AveragePowerUsageConsumption(Guid userID);
        public double CurrentSumPowerUsageConsumption(Guid userID); // trenutna ukupna potrosnja svih uredjaja korisnika
        public double CurrentSumPowerUsageProduction(Guid userID);
        public double GetPowerUsageForDay(Guid deviceId, DateTime today);
        
        public PowerUsage GetPowerUsageFor7Days(Guid deviceId, int direction);

        public double GetPowerUsageForAMonthSystemConsumer(int direction);
        public double GetPowerUsageForAMonthSystemProducer(int direction);
        public List<PowerUsage> GetPowerUsageSumByDeviceProducer(int direction); // za svaki uredjaj u sitemu vraca njegovu ukupnu potrosnju za prethodnih/sledecih mesec dana
        public List<PowerUsage> GetPowerUsageSumByDeviceConsumer(int direction);
    //    public PowerUsage GetPowerUsagesForEachDayProduction(int direction); // za svaki dan prethodnih/sledecih mesec dana ukupna potrosnja svih uredjaja u danu
    //    public PowerUsage GetPowerUsagesForEachDayConsumption(int direction);
        //public double GetAveragePowerUsageByUser(Guid userID);
     //   public Dictionary<Guid, List<double>> GetPowerUsageForDevices(Guid userId, int direction);
        public List<PowerUsage> GetPowerUsageForDevicesProduction(Guid userID, int direction);
        public List<PowerUsage> GetPowerUsageForDevicesConsumption(Guid userID, int direction);
        public List<double> GetPowerUsageForDevice(Guid deviceID, int direction);
        public Dictionary<DateTime, double> GetPowerUsageForDevicePast24Hours(Guid deviceID, int direction);
        public Task<bool> DeleteDevice(Guid deviceID);
        public PowerUsage GetPowerConsumedForADaySystem();
        public PowerUsage GetPowerProducedForADaySystem();
        public double GetCurrentPowerConsumption();
        public double GetCurrentPowerProduction();
        public double GetCurrentPowerUsageForDevice(Guid deviceID);
        public double CurrentSumPowerUsageSystemConsumer();
        public double CurrentSumPowerUsageSystemProducer();

        public IEnumerable<TimestampPowerPair> GetForDeviceByHour(Guid deviceID);

        public (Guid, double) GetDeviceWithMaxPowerUsage24(Guid userID);
        public (Guid, double) GetDeviceWithMaxPowerUsagePreviousWeek(Guid userID);
        public (Guid, double) GetDeviceWithMaxPowerUsagePreviousMonth(Guid userID);
        public (Guid, double) GetDeviceWithMaxPowerUsageCurrent(Guid userID);
        public PowerUsage Get12hoursBefore12hoursAfter(Guid deviceID);
}