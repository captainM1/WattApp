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
    double CurrentSumPowerUsage(Guid userID);
    public PowerUsage GetPowerConsumedForADaySystem();
    public PowerUsage GetPowerProducedForADaySystem();
    public double GetCurrentPowerProduction();
    public double GetCurrentPowerConsumption();
    public double GetCurrentPowerUsageForDevice(Guid deviceID);
    public double CurrentSumPowerUsageSystem();

    public IEnumerable<TimestampPowerPair> GetForDeviceByHour(Guid deviceID);
}
