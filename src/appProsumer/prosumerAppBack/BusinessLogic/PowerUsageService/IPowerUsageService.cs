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
    double CurrentSumPowerUsage(Guid userID);
    PowerUsage GetPowerUsageForADaySystem();
    public double GetCurrentPowerUsage();
    public double GetCurrentPowerUsageForDevice(Guid deviceID);
    public double CurrentSumPowerUsageSystem();

    public IEnumerable<TimestampPowerPair> GetForDeviceByHour(Guid deviceID);

    public PowerUsage GetPowerUsageFor12HoursUpDown(Guid deviceID);
}
