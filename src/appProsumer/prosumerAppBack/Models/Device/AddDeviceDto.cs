using System;
namespace prosumerAppBack.Models.Device
{
	public class AddDeviceDto
	{
		public string? Name { get; set; }
        public string? Manufacturer { get; set; }
        public double Wattage { get; set; }
        public string? MacAdress { get; set; }
	}
}

