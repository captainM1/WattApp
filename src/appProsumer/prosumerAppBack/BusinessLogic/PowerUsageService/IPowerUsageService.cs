using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using prosumerAppBack.Models;

namespace prosumerAppBack.BusinessLogic.PowerUsageService;

public interface IPowerUsageService
{
    public double GetForDevice(Guid deviceID);
    double GetPowerUsageForDay(Guid deviceID, DateTime today);
    PowerUsage GetPowerUsageFor7Days(Guid deviceId, int direction);
    public double AverageSumPowerUsageProduction(Guid userID);
    public double AverageSumPowerUsageConsumtion(Guid userID);
    public double CurrentSumPowerUsageProduction(Guid userID);
    public double CurrentSumPowerUsageConsumption(Guid userID);
    public PowerUsage GetPowerConsumedForADaySystem();
    public PowerUsage GetPowerProducedForADaySystem();
    public double GetCurrentPowerProduction();
    public double GetCurrentPowerConsumption();
    public double CurrentSumPowerUsageSystemConsumer();
    public double CurrentSumPowerUsageSystemProducer();
    public double GetPoweUsageForAMonthSystemProducer(int direction);
    public double GetPoweUsageForAMonthSystemConsumer(int direction);
    public List<PowerUsage> GetPowerUsageSumByDeviceConsumer(int direction);
    public List<PowerUsage> GetPowerUsageSumByDeviceProducer(int direction);
//    public PowerUsage GetPowerUsagesForEachDayConsumtion(int direction);
//    public PowerUsage GetPowerUsagesForEachDayProduction(int direction);
    public IEnumerable<TimestampPowerPair> GetForDeviceByHour(Guid deviceID);
    public List<PowerUsage> GetPowerUsageForDevicesConsumption(Guid userID, int direction);
    public List<PowerUsage> GetPowerUsageForDevicesProduction(Guid userID, int direction);
    List<PowerUsage> GetPowerUsageForDevicesConsumptionFor7Days(Guid userID, int direction);
    List<PowerUsage> GetPowerUsageForDevicesProductionFor7Days(Guid userID, int direction);
    public PowerUsage GetPowerUsageFor12HoursUpDown(Guid deviceID);
    Dictionary<DateTime, double> GetPowerUsageForDevicePast24Hours(Guid deviceID, int direction);
    List<PowerUsage> GetPowerUsageForDevicesProductionFor24Hours(Guid userID, int direction);
    List<PowerUsage> GetPowerUsageForDevicesConsumptionFor24Hours(Guid userID, int direction);

    public (Guid maxDeviceID, double maxDeviceUsage) GetMaxUsagePast24Hours(Guid userID);
    public (Guid maxDeviceID, double maxDeviceUsage) GetMaxUsagePreviousWeek(Guid userID);
    public (Guid maxDeviceID, double maxDeviceUsage) GetMaxUsagePreviousMonth(Guid userID);
    public (Guid maxDeviceID, double maxDeviceUsage) GetMaxUsagePreviousCurrent(Guid userID);
}
