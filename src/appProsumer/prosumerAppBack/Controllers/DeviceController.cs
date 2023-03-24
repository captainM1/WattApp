using System;
using Microsoft.AspNetCore.Mvc;
using prosumerAppBack.BusinessLogic;
using prosumerAppBack.Models;
using prosumerAppBack.Models.Device;

namespace prosumerAppBack.Controllers
{
	[ApiController]
	public class DeviceController : ControllerBase
	{
		private readonly IDevicesRepossitory _deviceRepository;

		public DeviceController(IDevicesRepossitory devicesRepossitory)
		{
			_deviceRepository = devicesRepossitory;
		}

		[HttpGet("devices/{id}")]
		public async Task<ActionResult<Device>> GetDevice(Guid id)
		{
			var device = await _deviceRepository.GetDeviceByIdAsync(id);
			if(device == null)
			{
				return BadRequest("Device not found");
			}

			return Ok(device);
		}

		[HttpGet("devices")]
		public async Task<IActionResult> GetAllDevices()
		{
			var devices = await _deviceRepository.GetAllDevices();
			if(devices == null)
			{
				return BadRequest("Not found");
			}

			return Ok(devices);
		}

        [HttpPost("devices/add-new")]
        public async Task<IActionResult> AddDevice([FromBody] Models.Device.AddDeviceDto addDeviceDto)
        {
            var check = await _deviceRepository.AddDevice(addDeviceDto);

            if (check)
            {
                return BadRequest("Cannot add device");
            }

            return Ok(new { message = "Device added" });
        }
    }
}

