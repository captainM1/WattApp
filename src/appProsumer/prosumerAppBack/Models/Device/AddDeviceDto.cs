using System;
using System.ComponentModel.DataAnnotations;

namespace prosumerAppBack.Models.Device
{
	public class AddDeviceDto
	{
		[Required]
		public Guid DeviceTypeID { get; set; }
		[Required]
        public string? MacAdress { get; set; }
        public Boolean sharesDataWithDso { get; set; }
        public Boolean dsoHasControl { get; set; }
    }
}

