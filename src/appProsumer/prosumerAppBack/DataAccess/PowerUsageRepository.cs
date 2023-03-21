using MongoDB.Driver;
using prosumerAppBack.BusinessLogic;
using prosumerAppBack.Models;

namespace prosumerAppBack.DataAccess;

public class PowerUsageRepository:IPowerUsageRepository
{
    private readonly IMongoCollection<PowerUsage> _collection;

    public PowerUsageRepository(IMongoDatabase database)
    {
        _collection = database.GetCollection<PowerUsage>("powerusage");
    }

    public IEnumerable<PowerUsage> Get(FilterDefinition<PowerUsage> filter)
    {
        return _collection.Find(filter).ToList();
    }
}