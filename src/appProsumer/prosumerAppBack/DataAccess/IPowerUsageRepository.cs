using System;
using MongoDB.Driver;
using prosumerAppBack.Models;

namespace prosumerAppBack.BusinessLogic
{
	public interface IPowerUsageRepository
	{
		public IEnumerable<PowerUsage> Get(FilterDefinition<PowerUsage> filter);
	}
}