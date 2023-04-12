using prosumerAppBack.Models;
using prosumerAppBack.Models.Device;
using SendGrid.Helpers.Errors.Model;

namespace prosumerAppBack.BusinessLogic.PowerUsageService;

public class PowerUsageService:IPowerUsageService
{
    private readonly IPowerUsageRepository _repository;

    public PowerUsageService(IPowerUsageRepository repository)
    {
        _repository = repository;
    }

    public double GetPowerUsageForDay(Guid deviceID, DateTime today)
    {
        var powerUsages = _repository.GetPowerUsageForDay(deviceID, today);
        if (powerUsages == null)
        {
            throw new NotFoundException();
        }
        return powerUsages;
    }

    public PowerUsage GetPowerUsageFor7Days(Guid deviceId, int direction)
    {
        var powerUsages = _repository.GetPowerUsageFor7Days(deviceId, direction);
        if (powerUsages == null)
        {
            throw new NotFoundException();
        }
        return powerUsages;
    }

    public double CurrentSumPowerUsage(Guid userID)
    {
        var powerUsages = _repository.CurrentSumPowerUsage(userID);
        if (powerUsages == null)
        {
            throw new NotFoundException();
        }
        return powerUsages;
    }

    public PowerUsage GetForDevice(Guid deviceID)
    {
        var powerUsages = _repository.GetForDevice(deviceID);
        if (powerUsages == null)
        {
            throw new NotFoundException();
        }
        return powerUsages;
    }

    public Dictionary<DateTime, double> GetPowerUsageForADaySystem()
    {
        var powerUsages = _repository.GetPowerUsageForADaySystem();
        if (powerUsages == null)
        {
            throw new NotFoundException();
        }
        return powerUsages;
    }

    public double GetCurrentPowerUsage()
    {
        var powerUsages = _repository.GetCurrentPowerUsage();
        if (powerUsages == null)
        {
            throw new NotFoundException();
        }
        return powerUsages;
    }

    public double GetCurrentPowerUsageForDevice(Guid deviceID)
    {
        var powerUsages = _repository.GetCurrentPowerUsageForDevice(deviceID);
        if (powerUsages == null)
        {
            throw new NotFoundException();
        }
        return powerUsages;
    }
}
