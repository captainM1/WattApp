using prosumerAppBack.Models;

namespace prosumerAppBack.BusinessLogic.PowerUsageService;

public interface IPowerUsageService
{
    IEnumerable<PowerUsage> Get();
    IEnumerable<PowerUsage> PreviousSevenDays();
    IEnumerable<PowerUsage> NextSevenDays();
}
