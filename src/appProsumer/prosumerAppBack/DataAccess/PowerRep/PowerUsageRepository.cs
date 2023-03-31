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

    public IEnumerable<PowerUsage> Get()
    {
        DateTime currentHourTimestamp = DateTime.Now.Date.AddHours(DateTime.Now.Hour);
        var filteredPowerUsageData = new List<PowerUsage>();
        foreach (var powerUsage in mongoCollection.AsQueryable())
        {
            var filteredTimestampPowerPairs = powerUsage.TimestampPowerPairs.Where(p => p.Timestamp == currentHourTimestamp).ToList();
            if (filteredTimestampPowerPairs.Count > 0)
            {
                filteredPowerUsageData.Add(new PowerUsage
                {
                    Id = powerUsage.Id,
                    TimestampPowerPairs = filteredTimestampPowerPairs
                });
            }
        }
        return filteredPowerUsageData;
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
            if (powerUsage.Id == deviceTypeID)
            {
                var filteredTimestampPowerPairs = powerUsage.TimestampPowerPairs.Where(p => p.Timestamp == currentHourTimestamp).ToList();
                if (filteredTimestampPowerPairs.Count > 0)
                {
                    filteredPowerUsageData = new PowerUsage
                    {
                        Id = powerUsage.Id,
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

    public IEnumerable<PowerUsage> PreviousSevenDays()
    {
        DateTime endDate = DateTime.Now.Date.AddDays(-1); 
        DateTime startDate = endDate.AddDays(-6); 

        List<PowerUsage> previousSevenDaysUsage = new List<PowerUsage>();

        for (DateTime date = startDate; date <= endDate; date = date.AddDays(1))
        {
            var oneDayPowerPairs = new List<TimestampPowerPair>();
            foreach (var powerUsage in mongoCollection.AsQueryable())
            {
                foreach (var pair in powerUsage.TimestampPowerPairs)
                {
                    if (pair.Timestamp == date.Date)
                    {
                        oneDayPowerPairs.Add(pair);
                    }
                }

                previousSevenDaysUsage.Add(new PowerUsage
                {
                    Id = powerUsage.Id,
                    TimestampPowerPairs = oneDayPowerPairs
                });
            }
        }

        return previousSevenDaysUsage;
    }

    public IEnumerable<PowerUsage> NextSevenDays()
    {
        DateTime endDate = DateTime.Now.Date.AddDays(1);
        DateTime startDate = endDate.AddDays(6);

        List<PowerUsage> nextSevenDaysUsage = new List<PowerUsage>();

        for (DateTime date = startDate; date <= endDate; date = date.AddDays(1))
        {
            var oneDayPowerPairs = new List<TimestampPowerPair>();
            foreach (var powerUsage in mongoCollection.AsQueryable())
            {
                foreach (var pair in powerUsage.TimestampPowerPairs)
                {
                    if (pair.Timestamp == date.Date)
                    {
                        oneDayPowerPairs.Add(pair);
                    }
                }

                nextSevenDaysUsage.Add(new PowerUsage
                {
                    Id = powerUsage.Id,
                    TimestampPowerPairs = oneDayPowerPairs
                });
            }
        }

        return nextSevenDaysUsage;
    }
    
    public double GetPowerUsageForDay(Guid deviceID, DateTime today)
    {
        Guid deviceTypeID = _dataContext.Devices
            .Where(d => d.ID == deviceID)
            .Select(d => d.DeviceTypeID)
            .FirstOrDefault();

        Guid novi = new Guid(deviceTypeID.ToString("N").ToUpper());


        PowerUsage powerUsage = null;
        
        foreach (var v in mongoCollection.AsQueryable())
        {
            if (novi == v.Id)
                powerUsage = v;
        }

        if (powerUsage == null)
        {
            return 0;
        }
        
        double totalPowerUsage = powerUsage.TimestampPowerPairs
            .Where(pair => pair.Timestamp.Date == today)
            .Average(pair => pair.PowerUsage);

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
        IEnumerable<Device> devices = _deviceRepository.GetDevicesForUser(userID);
        double sum = 0;

        DateTime currentHourTimestamp = DateTime.Now.Date.AddHours(DateTime.Now.Hour);

        foreach (var powerUsage in mongoCollection.AsQueryable())
        {
            foreach (Device device in devices)
            {
                if (powerUsage.Id == device.ID)
                {
                    var pairs = powerUsage.TimestampPowerPairs.Where(t => t.Timestamp == currentHourTimestamp).ToList();

                    foreach (var pair in pairs)
                    {
                        sum += pair.PowerUsage;
                    }
                }
            }
        }

        return sum;
    }
}