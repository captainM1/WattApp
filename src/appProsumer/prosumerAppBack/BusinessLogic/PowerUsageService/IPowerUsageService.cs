using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using prosumerAppBack.Models;

namespace prosumerAppBack.BusinessLogic.PowerUsageService;

public interface IPowerUsageService
{
    public double GetForDevice(Guid deviceID);
    double GetPowerUsageForDay(Guid deviceID, DateTime today);
    public PowerUsage GetPowerUsageFor7Days(Guid deviceId, int direction);
    public PowerUsage GetPowerUsageForAMonth(Guid deviceId, int direction);
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
    PowerUsage GetPowerUsageForDevicePast24Hours(Guid deviceID, int direction);
    List<PowerUsage> GetPowerUsageForDevicesProductionFor24Hours(Guid userID, int direction);
    List<PowerUsage> GetPowerUsageForDevicesConsumptionFor24Hours(Guid userID, int direction);

    public PowerUsage GetMaxUsagePast24HoursConsumption(Guid userID);
    public PowerUsage GetMaxUsagePast24HoursProduction(Guid userID);
    public PowerUsage GetMaxUsagePreviousWeekConsumption(Guid userID);
    public PowerUsage GetMaxUsagePreviousMonthConsumption(Guid userID);
    public PowerUsage GetMaxUsagePreviousCurrentConsumption(Guid userID);
    public PowerUsage GetMaxUsagePreviousWeekProductoin(Guid userID);
    public PowerUsage GetMaxUsagePreviousMonthProduction(Guid userID);
    public PowerUsage GetMaxUsagePreviousCurrentProduction(Guid userID);
    public double SavedEnergySystemProducer();
    public double SavedEnergySystemConsumer();
    public double DeviceSystemPowerUsage(Guid deviceID);
    object? GetPowerUsageForDevicePast24Hoursv2(Guid deviceId, int i);
}
