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

    public PowerUsage GetPowerUsageForAMonth(Guid deviceId, int direction)
    {
        var powerUsages = _repository.GetPowerUsageForAMonth(deviceId, direction);
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
    public List<PowerUsage> GetPowerUsageForDevicesConsumptionFor7Days(Guid userID, int direction)
    {
        var powerUsages = _repository.GetPowerUsageForDevicesConsumptionFor7Days(userID, direction);
        if (!powerUsages.Any())
        {
            throw new NotFoundException();
        }
        return powerUsages;
    }
    public List<PowerUsage> GetPowerUsageForDevicesProductionFor7Days(Guid userID, int direction)
    {
        var powerUsages = _repository.GetPowerUsageForDevicesProductionFor7Days(userID, direction);
        if (!powerUsages.Any())
        {
            throw new NotFoundException();
        }
        return powerUsages;
    }
    public List<PowerUsage> GetPowerUsageForDevicesConsumptionFor24Hours(Guid userID, int direction)
    {
        var powerUsages = _repository.GetPowerUsageForDevicesConsumptionFor24Hours(userID, direction);
        if (!powerUsages.Any())
        {
            throw new NotFoundException();
        }
        return powerUsages;
    }
    public List<PowerUsage> GetPowerUsageForDevicesProductionFor24Hours(Guid userID, int direction)
    {
        var powerUsages = _repository.GetPowerUsageForDevicesProductionFor24Hours(userID, direction);
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

    public PowerUsage GetPowerUsageFor12HoursUpDown(Guid deviceID)
    {
        var powerUsage = _repository.Get12hoursBefore12hoursAfter(deviceID);
        if(powerUsage == null)
        {
            throw new NotFoundException();
        }
        return powerUsage;
    }

    public PowerUsage GetMaxUsagePast24HoursConsumption(Guid userID)
    {
        PowerUsage result = _repository.GetDeviceWithMaxPowerUsage24Consumption(userID);
        return result;
    }

    public PowerUsage GetMaxUsagePast24HoursProduction(Guid userID)
    {
        PowerUsage result = _repository.GetDeviceWithMaxPowerUsage24Production(userID);
        return result;
    }

    public PowerUsage GetMaxUsagePreviousWeekConsumption(Guid userID)
    {
        PowerUsage result = _repository.GetDeviceWithMaxPowerUsagePreviousWeekConsumption(userID);
        return result;
    }

    public PowerUsage GetMaxUsagePreviousMonthConsumption(Guid userID)
    {
        PowerUsage result = _repository.GetDeviceWithMaxPowerUsagePreviousMonthConsumption(userID);
        return result;
    }

    public PowerUsage GetMaxUsagePreviousCurrentConsumption(Guid userID)
    {
        PowerUsage result = _repository.GetDeviceWithMaxPowerUsageCurrentConsumption(userID);
        return result;
    }

    public PowerUsage GetMaxUsagePreviousWeekProductoin(Guid userID)
    {
        PowerUsage result = _repository.GetDeviceWithMaxPowerUsagePreviousWeekProduction(userID);
        return result;
    }

    public PowerUsage GetMaxUsagePreviousMonthProduction(Guid userID)
    {
        PowerUsage result = _repository.GetDeviceWithMaxPowerUsagePreviousMonthProduction(userID);
        return result;
    }

    public PowerUsage GetMaxUsagePreviousCurrentProduction(Guid userID)
    {
        PowerUsage result = _repository.GetDeviceWithMaxPowerUsageCurrentProduction(userID);
        return result;
    }

    public object? GetPowerUsageForDevicePast24Hoursv2(Guid deviceId, int i)
    {
        var powerUsage = _repository.GetPowerUsageForDevicePast24Hoursv2(deviceId, i);
        if (powerUsage == null)
        {
            throw new NotFoundException();
        }
        return powerUsage;
    }

    public Dictionary<DateTime, double> GetPowerUsageForDevicePast24Hours(Guid deviceID, int direction)
    {
        var powerUsage = _repository.GetPowerUsageForDevicePast24Hours(deviceID, direction);
        if (powerUsage == null)
        {
            throw new NotFoundException();
        }
        return powerUsage;
    }
}
