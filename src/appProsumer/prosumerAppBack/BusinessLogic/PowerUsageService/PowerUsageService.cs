using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.IdentityModel.Tokens;
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

    public double CurrentSumPowerUsageSystemConsumer()
    {
        var powerUsage = _repository.CurrentSumPowerUsageSystemConsumer();
        if (powerUsage == 0)
        {
            throw new NotFoundException();
        }
        return powerUsage;
    }

    public double CurrentSumPowerUsageSystemProducer()
    {
        var powerUsage = _repository.CurrentSumPowerUsageSystemProducer();
        if (powerUsage == 0)
        {
            throw new NotFoundException();
        }
        return powerUsage;
    }

    public double GetPoweUsageForAMonthSystemProducer(int direction)
    {
        var powerUsage = _repository.GetPowerUsageForAMonthSystemProducer(direction);
        if (powerUsage == 0)
        {
            throw new NotFoundException();
        }
        return powerUsage;
    }

    public double GetPoweUsageForAMonthSystemConsumer(int direction)
    {
        var powerUsage = _repository.GetPowerUsageForAMonthSystemConsumer(direction);
        if (powerUsage == 0)
        {
            throw new NotFoundException();
        }
        return powerUsage;
    }

    public List<PowerUsage> GetPowerUsageSumByDeviceProducer(int direction)
    {
        var powerUsage = _repository.GetPowerUsageSumByDeviceProducer(direction);
        if (powerUsage == null)
        {
            throw new NotFoundException();
        }
        return powerUsage;
    }

    public List<PowerUsage> GetPowerUsageSumByDeviceConsumer(int direction)
    {
        var powerUsage = _repository.GetPowerUsageSumByDeviceConsumer(direction);
        if (powerUsage == null)
        {
            throw new NotFoundException();
        }
        return powerUsage;
    }

    /*    public PowerUsage GetPowerUsagesForEachDayProduction(int direction)
        {
            var powerUsage = _repository.GetPowerUsagesForEachDayProduction(direction);
            if (powerUsage == null)
            {
                throw new NotFoundException();
            }
            return powerUsage;
        }

        public PowerUsage GetPowerUsagesForEachDayConsumtion(int direction)
        {
            var powerUsage = _repository.GetPowerUsagesForEachDayConsumption(direction);
            if (powerUsage == null)
            {
                throw new NotFoundException();
            }
            return powerUsage;
        }
    */

    public List<PowerUsage> GetPowerUsageForDevicesProduction(Guid userID, int direction)
    {
        var powerUsages = _repository.GetPowerUsageForDevicesProduction(userID, direction);
        if (!powerUsages.Any())
        {
            throw new NotFoundException();
        }
        return powerUsages;
    }

    public List<PowerUsage> GetPowerUsageForDevicesConsumption(Guid userID, int direction)
    {
        var powerUsages = _repository.GetPowerUsageForDevicesConsumption(userID, direction);
        if (!powerUsages.Any())
        {
            throw new NotFoundException();
        }
        return powerUsages;
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

    public double GetForDevice(Guid deviceID)
    {
        var powerUsages = _repository.GetForDevice(deviceID);
        if (powerUsages == null)
        {
            throw new NotFoundException();
        }
        return powerUsages;
    }

    public PowerUsage GetPowerProducedForADaySystem()
    {
        var powerUsages = _repository.GetPowerProducedForADaySystem();
        if (powerUsages == null)
        {
            throw new NotFoundException();
        }
        return powerUsages;
    }
    public PowerUsage GetPowerConsumedForADaySystem()
    {
        var powerUsages = _repository.GetPowerConsumedForADaySystem();
        if (powerUsages == null)
        {
            throw new NotFoundException();
        }
        return powerUsages;
    }

    public double GetCurrentPowerConsumption()
    {
        var powerUsages = _repository.GetCurrentPowerConsumption();
        if (powerUsages == null)
        {
            throw new NotFoundException();
        }
        return powerUsages;
    }
    public double GetCurrentPowerProduction()
    {
        var powerUsages = _repository.GetCurrentPowerProduction();
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

    public (Guid maxDeviceID, double maxDeviceUsage) GetMaxUsagePast24Hours(Guid userID)
    {
        (Guid maxID, double maxUsage) tuple = _repository.GetDeviceWithMaxPowerUsage24(userID);
        return tuple;
    }

    public (Guid maxDeviceID, double maxDeviceUsage) GetMaxUsagePreviousWeek(Guid userID)
    {
        (Guid maxID, double maxUsage) tuple = _repository.GetDeviceWithMaxPowerUsagePreviousWeek(userID);
        return tuple;
    }

    public (Guid maxDeviceID, double maxDeviceUsage) GetMaxUsagePreviousMonth(Guid userID)
    {
        (Guid maxID, double maxUsage) tuple = _repository.GetDeviceWithMaxPowerUsagePreviousMonth(userID);
        return tuple;
    }

    public (Guid maxDeviceID, double maxDeviceUsage) GetMaxUsagePreviousCurrent(Guid userID)
    {
        (Guid maxID, double maxUsage) tuple = _repository.GetDeviceWithMaxPowerUsageCurrent(userID);
        return tuple;
    }
}
