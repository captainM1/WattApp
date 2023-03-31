using prosumerAppBack.Models;
using SendGrid.Helpers.Errors.Model;

namespace prosumerAppBack.BusinessLogic.PowerUsageService;

public class PowerUsageService:IPowerUsageService
{
    private readonly IPowerUsageRepository _repository;

    public PowerUsageService(IPowerUsageRepository repository)
    {
        _repository = repository;
    }

    public IEnumerable<PowerUsage> Get()
    {
        var powerUsages = _repository.Get();
        if (powerUsages == null)
        {
            throw new NotFoundException();
        }
        return powerUsages;
    }

    public IEnumerable<PowerUsage> NextSevenDays()
    {
        var powerUsages = _repository.NextSevenDays();
        if (powerUsages == null)
        {
            throw new NotFoundException();
        }
        return powerUsages;

    }

    public IEnumerable<PowerUsage> PreviousSevenDays()
    {
        var powerUsages = _repository.PreviousSevenDays();
        if (powerUsages == null)
        {
            throw new NotFoundException();
        }
        return powerUsages;
    }
}
