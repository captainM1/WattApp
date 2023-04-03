using MongoDB.Driver;
using prosumerAppBack.BusinessLogic;
using prosumerAppBack.Models;
using prosumerAppBack.Models.Device;

namespace prosumerAppBack.DataAccess;

public class PowerUsageRepository:IPowerUsageRepository
{
    private readonly IMongoCollection<PowerUsage> mongoCollection;
    private readonly DataContext _dataContext;
    private readonly IDeviceRepository _deviceRepository;
    
    public PowerUsageRepository(MongoDataContext mongoDataContext, DataContext dataContext, IDeviceRepository deviceRepository)
    {
        mongoCollection = mongoDataContext.PowerUsage;
        _dataContext = dataContext;
        _deviceRepository = deviceRepository;
    }
    public PowerUsage GetForDevice(Guid deviceID)
    {
        
        Guid deviceTypeID = _dataContext.Devices
            .Where(d => d.ID == deviceID)
            .Select(d => d.DeviceTypeID)
            .FirstOrDefault();
        
        DateTime currentHourTimestamp = DateTime.Now.Date.AddHours(DateTime.Now.Hour);
        PowerUsage filteredPowerUsageData = null;
        foreach (var powerUsage in mongoCollection.AsQueryable())
        {
            if (powerUsage.ID == deviceTypeID)
            {
                var filteredTimestampPowerPairs = powerUsage.TimestampPowerPairs.Where(p => p.Timestamp == currentHourTimestamp).ToList();
                if (filteredTimestampPowerPairs.Count > 0)
                {
                    filteredPowerUsageData = new PowerUsage
                    {
                        ID = powerUsage.ID,
                        TimestampPowerPairs = filteredTimestampPowerPairs
                    };
                }
                break;
            }
        }
        return filteredPowerUsageData;
    }

    public double CurrentPowerUsage(Guid userID)
    {
        var devices = _deviceRepository.GetDevicesForUser(userID);
        
        double sum = 0;
        foreach (var VARIABLE in devices)
        {
            sum += GetForDevice(VARIABLE.ID).TimestampPowerPairs[0].PowerUsage;
        }

        return sum / devices.Count();
    }

    public double GetPowerUsageForDay(Guid deviceID, DateTime today)
    {
        Guid deviceTypeID = _dataContext.Devices
            .Where(d => d.ID == deviceID)
            .Select(d => d.DeviceTypeID)
            .FirstOrDefault();

        var powerUsageData = mongoCollection
            .AsQueryable()
            .FirstOrDefault(p => p.ID.ToString() == deviceTypeID.ToString().ToUpper());

        if (powerUsageData == null)
        {
            return 0;
        }
    
        double totalPowerUsage = powerUsageData.TimestampPowerPairs
            .Where(pair => pair.Timestamp.Date == today)
            .Sum(pair => pair.PowerUsage);

        return totalPowerUsage;
    }


    public PowerUsage GetPowerUsageFor7Days(Guid deviceId, int direction)
    {
        var powerUsage = new PowerUsage();
        powerUsage.TimestampPowerPairs = new List<TimestampPowerPair>();
        var today = DateTime.Today;

        for (int i = 0; i < 7; i++)
        {
            var day = today.AddDays(i * direction);
            var powerUsageD = GetPowerUsageForDay(deviceId, day);
            var ts = new TimestampPowerPair();
            ts.PowerUsage = powerUsageD;
            ts.Timestamp = day;
            powerUsage.TimestampPowerPairs.Add(ts);

        }

        return powerUsage;
    }

    public double CurrentSumPowerUsage(Guid userID)
    {
        DateTime currentHourTimestamp = DateTime.Now.Date.AddHours(DateTime.Now.Hour);

        IEnumerable<String> deviceTypeIds = _deviceRepository.GetDevicesForUser(userID).Select(d => d.DeviceTypeID.ToString().ToUpper());

        var powerUsageData = mongoCollection.AsQueryable()
                .Where(p => deviceTypeIds.Contains(p.ID.ToString()))
                .ToList()
                .SelectMany(p => p.TimestampPowerPairs)
                .Where(t => t.Timestamp == currentHourTimestamp);

        double sum = powerUsageData.Sum(p => p.PowerUsage);

        return sum;
    }

    public List<PowerUsage> GetPowerUsageForAMonthSystem()
    {
        var startOfMonth = DateTime.Now.AddDays(-DateTime.Now.Day + 1).AddMonths(-1);
        var endOfMonth = startOfMonth.AddMonths(1);

        var powerUsages = mongoCollection.AsQueryable()
            .Where(pu => pu.TimestampPowerPairs.Any(tp => tp.Timestamp >= startOfMonth && tp.Timestamp <= endOfMonth))
            .ToList();

        return powerUsages;
    }

    public List<double> GetPowerUsageSumByDevicePreviousMonth()
    {
        var startOfMonth = DateTime.Now.AddDays(-DateTime.Now.Day + 1).AddMonths(-1);
        var endOfMonth = startOfMonth.AddMonths(1);

        var powerUsages = mongoCollection.AsQueryable()
            .Where(pu => pu.TimestampPowerPairs.Any(tp => tp.Timestamp >= startOfMonth && tp.Timestamp <= endOfMonth))
            .ToList();

        var sums = new List<double>();

        foreach (var powerUsage in powerUsages)
        {
            var sum = powerUsage.TimestampPowerPairs
                .Sum(tp => tp.PowerUsage);

            sums.Add(sum);
        }

        return sums;
    }
}