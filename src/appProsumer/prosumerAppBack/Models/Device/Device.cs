using System;
namespace prosumerAppBack.Models.Device
{
	public class Device
	{
		public Guid ID { get; set; }
		public string? Name { get; set; }
		public string? OwnerId { get; set; }
		public string? Manufacturer { get; set; }
		public double Wattage { get; set; }
		public double UsageFrequency { get; set; }
		public string? MacAdress { get; set; }
		public bool Status { get; set; }
		public int DeviceAge { get; set; }
    }
}

