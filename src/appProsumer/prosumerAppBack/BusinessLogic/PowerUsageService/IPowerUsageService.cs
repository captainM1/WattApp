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


    public async Task<(Guid, double)> GetDeviceWithMaxPowerUsage24(Guid userID);
    public Dictionary<Guid, double> GetDevicePowerUsageMaxForUserLastWeek(Guid userID);
    public Dictionary<Guid, double> GetDevicePowerUsageForUserPreviousMonth(Guid userID);
}
