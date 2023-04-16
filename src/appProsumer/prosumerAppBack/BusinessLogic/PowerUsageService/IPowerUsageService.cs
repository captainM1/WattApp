using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using prosumerAppBack.Models;

namespace prosumerAppBack.BusinessLogic.PowerUsageService;

public interface IPowerUsageService
{
    PowerUsage GetForDevice(Guid deviceID);
    double GetPowerUsageForDay(Guid deviceID, DateTime today);
    PowerUsage GetPowerUsageFor7Days(Guid deviceId, int direction);
    public double AverageSumPowerUsageProduction(Guid userID);
    public double AverageSumPowerUsageConsumtion(Guid userID);
    public double CurrentSumPowerUsageProduction(Guid userID);
    public double CurrentSumPowerUsageConsumption(Guid userID);
    PowerUsage GetPowerUsageForADaySystem();
    public double GetCurrentPowerUsage();
    public double GetCurrentPowerUsageForDevice(Guid deviceID);
    public double CurrentSumPowerUsageSystemConsumer();
    public double CurrentSumPowerUsageSystemProducer();
    public double GetPoweUsageForAMonthSystemProducer(int direction);
    public double GetPoweUsageForAMonthSystemConsumer(int direction);
    public IEnumerable<TimestampPowerPair> GetForDeviceByHour(Guid deviceID);

    public PowerUsage GetPowerUsageFor12HoursUpDown(Guid deviceID);
}
