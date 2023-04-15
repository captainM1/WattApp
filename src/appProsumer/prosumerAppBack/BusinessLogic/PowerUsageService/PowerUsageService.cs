using System;
using System.Collections.Generic;
using System.Threading.Tasks;
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

    public double AverageSumPowerUsageProduction(Guid userID)
    {
        var powerUsages = _repository.AveragePowerUsageProduction(userID);
        if (powerUsages == 0)
        {
            throw new NotFoundException();
        }
        return powerUsages;
    }

    public double AverageSumPowerUsageConsumtion(Guid userID)
    {
        var powerUsages = _repository.AveragePowerUsageConsumption(userID);
        if (powerUsages == 0)
        {
            throw new NotFoundException();
        }
        return powerUsages;
    }

    public double CurrentSumPowerUsageProduction(Guid userID) 
    {
        var powerUsages = _repository.CurrentSumPowerUsageProduction(userID);
        if (powerUsages == 0)
        {
            throw new NotFoundException();
        }
        return powerUsages;
    }

    public double CurrentSumPowerUsageConsumption(Guid userID)
    {
        var powerUsages = _repository.CurrentSumPowerUsageConsumption(userID);
        if (powerUsages == 0)
        {
            throw new NotFoundException();
        }
        return powerUsages;
    }

    public double CurrentSumPowerUsageSystem()
    {
        var powerUsage = _repository.CurrentSumPowerUsageSystem();
        if (powerUsage == 0)
        {
            throw new NotFoundException();
        }
        return powerUsage;
    }

    public IEnumerable<TimestampPowerPair> GetForDeviceByHour(Guid deviceID)
    {
        var powerUsages = _repository.GetForDeviceByHour(deviceID);
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

    public PowerUsage GetPowerUsageForADaySystem()
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

    public PowerUsage GetPowerUsageFor12HoursUpDown(Guid deviceID)
    {
        var powerUsage = _repository.Get12hoursBefore12hoursAfter(deviceID);
        if(powerUsage == null)
        {
            throw new NotFoundException();
        }
        return powerUsage;
    }
}
