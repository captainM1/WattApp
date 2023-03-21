using Microsoft.EntityFrameworkCore;
using MongoDB.Driver;
using prosumerAppBack.Models;

namespace prosumerAppBack.DataAccess
{
	public class MongoDataContext
	{
		private readonly IMongoDatabase _mongoDatabase;

        public MongoDataContext()
        {
            var client = new MongoClient("mongodb://localhost:27017");
            _mongoDatabase = client.GetDatabase("data");
        }
        public IMongoCollection<PowerUsage> PowerUsage => _mongoDatabase.GetCollection<PowerUsage>("PowerUsage");
        public IMongoCollection<Device> Devices => _mongoDatabase.GetCollection<Device>("Devices");
    }
}

