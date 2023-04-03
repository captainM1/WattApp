using prosumerAppBack.Models;

namespace prosumerAppBack.BusinessLogic.PowerUsageService;

public interface IPowerUsageService
{
    IEnumerable<PowerUsage> Get();
    PowerUsage GetForDevice(Guid deviceID);
    IEnumerable<PowerUsage> PreviousSevenDays();
    IEnumerable<PowerUsage> NextSevenDays();
    double GetPowerUsageForDay(Guid deviceID, DateTime today);
    PowerUsage GetPowerUsageFor7Days(Guid deviceId, int direction);
    double CurrentSumPowerUsage(Guid userID);
}
