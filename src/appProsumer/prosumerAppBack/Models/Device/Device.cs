using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace prosumerAppBack.Models.Device
{
	public class Device
	{
		[Key]
		public Guid ID { get; set; }

		public int DeviceID { get; set; }
		public string? Name { get; set; }
		public string? Manufacturer { get; set; }
		public double Wattage { get; set; }
		public string? MacAdress { get; set; }
		
		public bool Status { get; set; }
		public int DeviceAge { get; set; }
		
		public virtual ICollection<DeviceOwners> DeviceOwners { get; set; }
    }
}

