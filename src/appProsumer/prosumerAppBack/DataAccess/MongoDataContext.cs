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
            var connectionString = configuration.GetConnectionString("MongoConnectionString");
            var client = new MongoClient(connectionString);
            _mongoDatabase = client.GetDatabase("ime baze");
        }

        public IMongoCollection<Device> Devices => _mongoDatabase.GetCollection<Device>("devices");
    }
}

