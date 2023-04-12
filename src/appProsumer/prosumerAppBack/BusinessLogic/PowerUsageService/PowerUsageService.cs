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

    public async Task<(Guid, double)> GetDeviceWithMaxPowerUsage24(Guid userID)
    {
        var devices = await _dataContext.Devices
            .Where(d => d.OwnerID == userID)
            .ToListAsync();

        if (devices.Count == 0)
        {
            throw new Exception("User has no devices");
        }

        var devicePowerUsage = await _powerUsage.GetPowerUsageForDevicePast24Hours(devices[0].ID, -1);
        var maxDeviceID = devices[0].ID;
        var maxPowerUsage = devicePowerUsage.Sum();

        for (int i = 1; i < devices.Count; i++)
        {
            devicePowerUsage = await _powerUsage.GetPowerUsageForDevicePast24Hours(devices[i].ID, -1);
            var powerUsageSum = devicePowerUsage.Sum();

            if (powerUsageSum > maxPowerUsage)
            {
                maxPowerUsage = powerUsageSum;
                maxDeviceID = devices[i].ID;
            }
        }

        return (maxDeviceID, maxPowerUsage);
    }

    public Dictionary<Guid, double> GetDevicePowerUsageMaxForUserLastWeek(Guid userID)
    {
        var end = DateTime.UtcNow;
        var start = end.AddDays(-7);

        var powerUsages = _context.Devices
            .Where(d => d.OwnerID == userID)
            .SelectMany(d => d.TimestampPowerPairs)
            .Where(tp => tp.Timestamp >= start && tp.Timestamp <= end)
            .ToList();

        var devicePowerUsageMax = powerUsages
            .GroupBy(tp => tp.DeviceID)
            .ToDictionary(g => g.Key, g => g.Sum(tp => tp.PowerUsage))
            .OrderByDescending(kv => kv.Value)
            .FirstOrDefault();

        return devicePowerUsageMax != null ? new Dictionary<Guid, double> { { devicePowerUsageMax.Key, devicePowerUsageMax.Value } } : new Dictionary<Guid, double>();
    }



}
