using MongoDB.Driver;
using prosumerAppBack.BusinessLogic;
using prosumerAppBack.Models;

namespace prosumerAppBack.DataAccess;

public class PowerUsageRepository:IPowerUsageRepository
{
    private readonly IMongoCollection<PowerUsage> mongoCollection;

    
    public PowerUsageRepository(MongoDataContext mongoDataContext)
    {
        mongoCollection = mongoDataContext.PowerUsage;
    }

    public IEnumerable<PowerUsage> Get()
    {
        DateTime currentHourTimestamp = DateTime.Now.Date.AddHours(DateTime.Now.Hour);
        var filteredPowerUsageData = new List<PowerUsage>();
        foreach (var powerUsage in mongoCollection.AsQueryable())
        {
            var filteredTimestampPowerPairs = new List<TimestampPowerPair>();
            foreach (var timestampPowerPair in powerUsage.TimestampPowerPairs)
            {
                if (timestampPowerPair.Timestamp == currentHourTimestamp)
                {
                    filteredTimestampPowerPairs.Add(timestampPowerPair);
                }
            }

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
}