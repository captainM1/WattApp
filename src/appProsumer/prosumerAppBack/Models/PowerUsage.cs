using System;
using MongoDB.Bson.Serialization.Attributes;

namespace prosumerAppBack.Models
{
	public class PowerUsage
    {
        [BsonId]
        public Guid Id { get; set; }
        public string DeviceName { get; set; }
        public List<TimestampPowerPair> TimestampPowerPairs { get; set; }
    }
}

