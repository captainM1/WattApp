using System;
namespace prosumerAppBack.Models.Device
{
	public class AddDeviceDto
	{
		public Guid DeviceTypeID { get; set; }
        public string? MacAdress { get; set; }
	}
}

