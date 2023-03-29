using System;
using System.ComponentModel.DataAnnotations;

namespace prosumerAppBack.Models.Device
{
	public class AddDeviceDto
	{
		[Required]
		public string? Name { get; set; }
		[Required]
        public string? Manufacturer { get; set; }
		[Required]
        public double Wattage { get; set; }
		[Required]
        public string? MacAdress { get; set; }
	}
}

