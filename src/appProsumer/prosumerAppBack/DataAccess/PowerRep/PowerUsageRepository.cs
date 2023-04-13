using Microsoft.EntityFrameworkCore;
using MongoDB.Bson;
using MongoDB.Driver;
using prosumerAppBack.BusinessLogic;
using prosumerAppBack.Models;
using prosumerAppBack.Models.Device;

namespace prosumerAppBack.DataAccess;

public class PowerUsageRepository : IPowerUsageRepository
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

        string deviceGroupName = _dataContext.DeviceGroups
            .Where(g => g.ID == _dataContext.DeviceTypes
                .Where(dt => dt.ID == deviceTypeID)
                .Select(dt => dt.GroupID)
                .FirstOrDefault())
            .Select(g => g.Name)
            .FirstOrDefault();

        if (deviceGroupName == "Consumer")
        {
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
        else if (deviceGroupName == "Producer")
        {
            
        }

        return 1;
    }


    public PowerUsage GetPowerUsageFor7Days(Guid deviceId, int direction)
    {
        Guid deviceTypeID = _dataContext.Devices
            .Where(d => d.ID == deviceId)
            .Select(d => d.DeviceTypeID)
            .FirstOrDefault();

        string deviceGroupName = _dataContext.DeviceGroups
            .Where(g => g.ID == _dataContext.DeviceTypes
                .Where(dt => dt.ID == deviceTypeID)
                .Select(dt => dt.GroupID)
                .FirstOrDefault())
            .Select(g => g.Name)
            .FirstOrDefault();

        if (deviceGroupName == "Consumer")
        {
            var powerUsage = new PowerUsage();
            powerUsage.TimestampPowerPairs = new List<TimestampPowerPair>();
            var today = DateTime.Today;

            for (int i = 1; i <= 7; i++)
            {
                var day = today.AddDays(i * direction);
                var powerUsageD = GetPowerUsageForDay(deviceId, day);
                var ts = new TimestampPowerPair();
                ts.PowerUsage = powerUsageD;
                ts.Timestamp = day;
                powerUsage.TimestampPowerPairs.Add(ts);

            }

            if (direction == -1)
                powerUsage.TimestampPowerPairs.Reverse();
            return powerUsage;
        }
        else if (deviceGroupName == "Producer")
        {

        }
        return null;
    }

    public double CurrentSumPowerUsage(Guid userID)
    {
        double sum = 0;
        DateTime currentHourTimestamp = DateTime.Now.Date.AddHours(DateTime.Now.Hour);

        IEnumerable<String> deviceTypeIds = _deviceRepository.GetDevicesForUser(userID).Select(d => d.DeviceTypeID.ToString().ToUpper());
        foreach(var deviceTypeId in deviceTypeIds)
        {
            string deviceGroupName = _dataContext.DeviceGroups
                        .Where(g => g.ID == _dataContext.DeviceTypes
                            .Where(dt => dt.ID.ToString().ToUpper() == deviceTypeId)
                            .Select(dt => dt.GroupID)
                            .FirstOrDefault())
                        .Select(g => g.Name)
                        .FirstOrDefault();
            if (deviceGroupName == "Consumer")
            {
                var powerUsageData = mongoCollection.AsQueryable()
                    .Where(p => deviceTypeIds.Contains(p.ID.ToString()))
                    .ToList()
                    .SelectMany(p => p.TimestampPowerPairs)
                    .Where(t => t.Timestamp == currentHourTimestamp);

                sum = powerUsageData.Sum(p => p.PowerUsage);
            }
        } 
        return sum;
    }



    public double CurrentSumPowerUsageSystem()
    {
        DateTime currentHourTimestamp = DateTime.Now.Date.AddHours(DateTime.Now.Hour);

        var powerUsageData = mongoCollection.AsQueryable()
            .ToList()
            .SelectMany(p => p.TimestampPowerPairs)
            .Where(t => t.Timestamp == currentHourTimestamp);

        double sum = powerUsageData.Sum(p => p.PowerUsage);

        return sum;
    }

    public IEnumerable<TimestampPowerPair> GetForDeviceByHour(Guid deviceID)
    {
        DateTime currentHourTimestamp = DateTime.Today;
        
        Guid deviceTypeID = _dataContext.Devices
            .Where(d => d.ID == deviceID)
            .Select(d => d.DeviceTypeID)
            .FirstOrDefault();

        
        var powerUsageData = mongoCollection.AsQueryable()
            .FirstOrDefault(p => p.ID.ToString() == deviceTypeID.ToString().ToUpper())
            ?.TimestampPowerPairs
            .Where(t => t.Timestamp.Date == currentHourTimestamp);

        return powerUsageData;
    }

    public double GetPowerUsageForAMonthSystem(int direction)
    {
        var startOfMonth = DateTime.Now.AddDays(-DateTime.Now.Day + 1).AddMonths(direction); // pocetak proslog meseca (npr 04.05.)
        var endOfMonth = startOfMonth.AddMonths(1); // (04. 06.)

        var deviceUsages = mongoCollection.AsQueryable().ToList();

        var powerUsages = deviceUsages
            .Sum(p => p.TimestampPowerPairs.Where(t => t.Timestamp >= startOfMonth && t.Timestamp <= endOfMonth).Sum(p => p.PowerUsage));

        return powerUsages;
    }

    public Dictionary<Guid, double> GetPowerUsageSumByDevice(int direction)
    {
        var startOfMonth = DateTime.Now.AddMonths(direction);
        var endOfMonth = startOfMonth.AddMonths(1);

        var powerUsages = mongoCollection.AsQueryable().ToList();

        var devicePowerUsages = powerUsages
            .GroupBy(pu => pu.ID)
            .Select(g => new
            {
                DeviceId = g.Key,
                TotalPowerUsage = g.Sum(pu => pu.TimestampPowerPairs.Where(tp => tp.Timestamp >= startOfMonth && tp.Timestamp <= endOfMonth).Sum(tp => tp.PowerUsage))
            })
            .ToList();

        var sums = new Dictionary<Guid, double>();

        foreach (var powerUsage in devicePowerUsages)
        {
            sums.Add(powerUsage.DeviceId, powerUsage.TotalPowerUsage);
        }

        return sums;
    }

    public Dictionary<DateTime, double> GetPowerUsagesForEachDay(int direction)
    {
        var startOfMonth = DateTime.Now.AddMonths(direction);
        var endOfMonth = startOfMonth.AddMonths(1);

        var deviceUsages = mongoCollection.AsQueryable().ToList();
        var powerUsages = deviceUsages
            .SelectMany(tp => tp.TimestampPowerPairs)
            .Where(tp => tp.Timestamp >= startOfMonth && tp.Timestamp <= endOfMonth)
            .ToList();

        var sums = new Dictionary<DateTime, double>();
        var currentDate = startOfMonth;

        while (currentDate <= endOfMonth)
        {
            var sum = powerUsages
                .Where(tp => tp.Timestamp.Date == currentDate.Date)
                .Sum(tp => tp.PowerUsage);

            sums.Add(currentDate, sum);
            currentDate = currentDate.AddDays(1);
        }

        return sums;
    }

    public double GetAveragePowerUsageByUser(Guid userID)
    {
        IEnumerable<String> deviceTypeIds = _deviceRepository.GetDevicesForUser(userID).Select(d => d.DeviceTypeID.ToString().ToUpper());

        var monthAgo = DateTime.UtcNow.AddMonths(-1);

        var powerUsageData = mongoCollection.AsQueryable()
                .Where(p => deviceTypeIds.Contains(p.ID.ToString()))
                .ToList()
                .SelectMany(p => p.TimestampPowerPairs)
                .Where(t => t.Timestamp >= monthAgo);

        double average = powerUsageData.Average(p => p.PowerUsage);

        return average;
    }

    public Dictionary<Guid, List<double>> GetPowerUsageForDevices(Guid userID, int direction)
    {
        IEnumerable<String> deviceTypeIds = _deviceRepository.GetDevicesForUser(userID).Select(d => d.DeviceTypeID.ToString().ToUpper());

        var monthAgo = DateTime.UtcNow.AddMonths(direction);

        var powerUsages = mongoCollection.AsQueryable()
                .Where(p => deviceTypeIds.Contains(p.ID.ToString()))
                .ToList();

        var result = new Dictionary<Guid, List<double>>();

        foreach (var device in powerUsages)
        {
            var powerUsageList = new List<double>();

            for (int i = 1; i < 31; i++)
            {
                var date = DateTime.UtcNow.AddDays(direction * i).Date;
                var powerUsage = powerUsages
                    .Where(p => p.ID == device.ID)
                    .SelectMany(p => p.TimestampPowerPairs)
                    .Where(tp => tp.Timestamp.Date == date)
                    .Sum(tp => tp.PowerUsage);
                powerUsageList.Add(powerUsage);
            }
            result.Add(device.ID, powerUsageList);
        }

        return result;

    }

    public List<double> GetPowerUsageForDevice(Guid deviceID, int direction)
    {
        var monthAgo = DateTime.UtcNow.AddMonths(direction);

        var powerUsagesDevices = mongoCollection.AsQueryable()
                .Where(p => deviceID.ToString().ToUpper().Contains(p.ID.ToString()))
                .ToList();

        foreach (var device in powerUsagesDevices)
        {
            Console.WriteLine("uredjai: " + device.ID);
        }

        if (powerUsagesDevices == null)
        {
            return null;
        }

        var result = new List<double>();

        for (int i = 1; i < 31; i++)
        {
            var date = DateTime.UtcNow.AddDays(i * direction).Date;
            var totalUsageForDay = powerUsagesDevices
                .SelectMany(tp => tp.TimestampPowerPairs)
                .Where(tp => tp.Timestamp.Date == date)
                .Sum(tp => tp.PowerUsage);
            result.Add(totalUsageForDay);


        }

        return result;
    }

    public Dictionary<DateTime, double> GetPowerUsageForDevicePast24Hours(Guid deviceID, int direction)
    {
        var end = DateTime.UtcNow;
        var start = end.AddDays(direction * -1);


        var powerUsages = mongoCollection.AsQueryable()
            .Where(p => deviceID.ToString().ToUpper().Contains(p.ID.ToString()))
            .ToList();

        var powerUsageDictionary = new Dictionary<DateTime, double>();

        for (int i = 0; i < 24; i++)
        {
            var hourStart = end.AddHours(direction * i * -1);
            var hourEnd = end.AddHours(direction * (i + 1) * -1);

            var powerUsage = powerUsages
                .SelectMany(p => p.TimestampPowerPairs)
                .Where(tp => tp.Timestamp >= hourStart && tp.Timestamp <= hourEnd)
                .Sum(tp => tp.PowerUsage);
            powerUsageDictionary.Add(hourStart, powerUsage);
        }

        return powerUsageDictionary;
    }

    public Dictionary<DateTime, double> GetPowerUsageForDeviceNext24Hours(Guid deviceID)
    {
        var end = DateTime.UtcNow;
        var start = end;

        var powerUsages = mongoCollection.AsQueryable()
            .Where(p => deviceID.ToString().ToUpper().Contains(p.ID.ToString()))
            .ToList();

        var powerUsageDictionary = new Dictionary<DateTime, double>();

        for (int i = 0; i < 24; i++)
        {
            var hourStart = start.AddHours(i);
            var hourEnd = hourStart.AddHours(1);
            var powerUsage = powerUsages
                .SelectMany(p => p.TimestampPowerPairs)
                .Where(tp => tp.Timestamp >= hourStart && tp.Timestamp < hourEnd)
                .Sum(tp => tp.PowerUsage);
            powerUsageDictionary.Add(hourStart, powerUsage);
        }

        return powerUsageDictionary;
    }

    public async Task<bool> DeleteDevice(Guid deviceID)
    {
        var device = await _dataContext.Devices.FirstOrDefaultAsync(d => d.ID == deviceID);

        if (device == null)
        {
            return false;
        }

        _dataContext.Devices.Remove(device);
        await _dataContext.SaveChangesAsync();

        return true;
    }

    public PowerUsage GetPowerUsageForADaySystem()
    {
        var startOf24Period = DateTime.Today;
        var endOf24Period = DateTime.Today.AddDays(1).AddHours(-1);               

        var powerUsage = new PowerUsage();
        powerUsage.TimestampPowerPairs = new List<TimestampPowerPair>();

        var powerUsages = mongoCollection.AsQueryable().ToList();
        var temp = powerUsages
            .SelectMany(t => t.TimestampPowerPairs)
            .Where(t => t.Timestamp >= startOf24Period && t.Timestamp <= endOf24Period)
            .ToList();

        var sums = new Dictionary<DateTime, double>();
        var currentDate = startOf24Period;

        while (currentDate <= endOf24Period)
        {
            var ts = new TimestampPowerPair();
            var sum = GetCurrentPowerUsage(currentDate);
            ts.Timestamp = currentDate;
            ts.PowerUsage = sum;
            powerUsage.TimestampPowerPairs.Add(ts);            
            currentDate = currentDate.AddHours(1);
        }

        return powerUsage;        
    }

    public double GetCurrentPowerUsage()
    {
        var startOfAnHour = DateTime.Now.AddHours(-1);
        var endOfAnHour = DateTime.Now;

        var deviceUsages = mongoCollection.AsQueryable().ToList();

        var powerUsages = deviceUsages
            .Sum(p => p.TimestampPowerPairs.Where(t => t.Timestamp >= startOfAnHour && t.Timestamp < endOfAnHour).Sum(p => p.PowerUsage));
       
        return powerUsages;
    }
    public double GetCurrentPowerUsage(DateTime date)
    {
        var startOfAnHour = date;
        var endOfAnHour = date.AddHours(1);

        var deviceUsages = mongoCollection.AsQueryable().ToList();

        var powerUsages = deviceUsages
            .Sum(p => p.TimestampPowerPairs.Where(t => t.Timestamp >= startOfAnHour && t.Timestamp < endOfAnHour).Sum(p => p.PowerUsage));

        return powerUsages;
    }

    public double GetCurrentPowerUsageForDevice(Guid deviceID)
    {
        var startOfAnHour = DateTime.Now.AddHours(-1);
        var endOfAnHour = DateTime.Now;

        Guid deviceTypeID = _dataContext.Devices
            .Where(d => d.ID == deviceID)
            .Select(d => d.DeviceTypeID)
            .FirstOrDefault();

        var powerUsages = mongoCollection.AsQueryable()
            .Where(p => deviceTypeID.ToString().ToUpper().Contains(p.ID.ToString()))
            .ToList();

        var temp = powerUsages
                .SelectMany(p => p.TimestampPowerPairs)
                .Where(tp => tp.Timestamp >= startOfAnHour && tp.Timestamp <= endOfAnHour)
                .Sum(tp => tp.PowerUsage);


        return temp;               
    }



}