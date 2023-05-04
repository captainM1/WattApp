using System;
using MongoDB.Driver;
using prosumerAppBack.DataAccess;
using prosumerAppBack.Models;

namespace prosumerAppBack.BusinessLogic
{
    public interface IPowerUsageRepository
    {
        public double GetForDevice(Guid deviceID);// provereno
        public double AveragePowerUsageProduction(Guid userID); // prosecna potrosnja svih uredjaja korisnika inace
        public double AveragePowerUsageConsumption(Guid userID);
        public double CurrentSumPowerUsageConsumption(Guid userID); // trenutna ukupna potrosnja svih uredjaja korisnika
        public double CurrentSumPowerUsageProduction(Guid userID);
        public double GetPowerUsageForDay(Guid deviceId, DateTime today);// provereno
        public PowerUsage GetPowerUsageFor7Days(Guid deviceId, int direction);// provereno
        public PowerUsage GetPowerUsageForAMonth(Guid deviceId, int direction);
        public double GetPowerUsageForAMonthSystemConsumer(int direction);
        public double GetPowerUsageForAMonthSystemProducer(int direction);
        public List<PowerUsage> GetPowerUsageSumByDeviceProducer(int direction); // za svaki uredjaj u sitemu vraca njegovu ukupnu potrosnju za prethodnih/sledecih mesec dana
        public List<PowerUsage> GetPowerUsageSumByDeviceConsumer(int direction);
        public PowerUsage GetPowerUsagesForEachDayProductionMonth(int direction); // za svaki dan prethodnih/sledecih mesec dana ukupna potrosnja svih uredjaja u danu
        public PowerUsage GetPowerUsagesForEachDayConsumptionMonth(int direction);
        public List<PowerUsage> GetPowerUsageForDevicesProduction(Guid userID, int direction);
        public List<PowerUsage> GetPowerUsageForDevicesConsumption(Guid userID, int direction);        
        public PowerUsage GetPowerUsageForDevicePast24Hours(Guid deviceID, int direction);       
        public PowerUsage GetPowerConsumedForADaySystem();
        public PowerUsage GetPowerProducedForADaySystem();
        public double GetCurrentPowerConsumption();
        public double GetCurrentPowerProduction();        
        public double CurrentSumPowerUsageSystemConsumer();
        public double CurrentSumPowerUsageSystemProducer();
        List<PowerUsage> GetPowerUsageForDevicesConsumptionFor7Days(Guid userID, int direction);
        List<PowerUsage> GetPowerUsageForDevicesProductionFor7Days(Guid userID, int direction);
        List<PowerUsage> GetPowerUsageForDevicesConsumptionFor24Hours(Guid userID, int direction);
        List<PowerUsage> GetPowerUsageForDevicesProductionFor24Hours(Guid userID, int direction);
        public IEnumerable<TimestampPowerPair> GetForDeviceByHour(Guid deviceID);//provereno i promenjeno da vraca do trenutnog_sata -1 a ne za ceo dan
        public PowerUsage GetDeviceWithMaxPowerUsage24Production(Guid userID);
        public PowerUsage GetDeviceWithMaxPowerUsage24Consumption(Guid userID);
        public PowerUsage GetDeviceWithMaxPowerUsagePreviousWeekProduction(Guid userID);
        public PowerUsage GetDeviceWithMaxPowerUsagePreviousMonthProduction(Guid userID, int direction);
        public PowerUsage GetDeviceWithMaxPowerUsageCurrentProduction(Guid userID);
        public PowerUsage GetDeviceWithMaxPowerUsagePreviousWeekConsumption(Guid userID);
        public PowerUsage GetDeviceWithMaxPowerUsagePreviousMonthConsumption(Guid userID, int direction);
        public PowerUsage GetDeviceWithMaxPowerUsageCurrentConsumption(Guid userID);
        public PowerUsage Get12hoursBefore12hoursAfter(Guid deviceID);
        public double SavedEnergySystemConsumer();
        public double SavedEnergySystemProducer();
        public double percentPowerUsageForPreviousHour(Guid deviceID);
        List<PowerUsage> GetPowerUsageForDevicePast24Hoursv2(Guid deviceId, int i);
        double GetHowMuchUserIsConsuming(Guid userId);
        public double deviceEnergySaved(Guid deviceID);
        public double savedEnergyForUserProducer(Guid userID);
        public double savedEnergyForUserConsumer(Guid userID);
        public PowerUsage GetPowerUsagesForEachDayProductionWeek(int direction);
        public PowerUsage GetPowerUsagesForEachDayConsumptionWeek(int direction);
        public PowerUsage GetPowerUsagesForEachDayProduction24h(int direction);
        public PowerUsage GetPowerUsagesForEachDayConsumption24h(int direction);
    }
}