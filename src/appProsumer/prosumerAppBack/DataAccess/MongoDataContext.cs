using System;
using MongoDB.Driver;
using prosumerAppBack.Models;

namespace prosumerAppBack.DataAccess
{
	public class MongoDataContext
	{
		private readonly IMongoDatabase _mongoDatabase;

        public MongoDataContext(IConfiguration configuration)
        {
            var connectionString = configuration.GetConnectionString("mongodb://localhost:27017");
            var client = new MongoClient(connectionString);
            _mongoDatabase = client.GetDatabase("data");    
        }

        public IMongoCollection<Device> Devices => _mongoDatabase.GetCollection<Device>("powerusage");
    }
}

