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

        [HttpPost("devices/update{id}")]
        public async Task<IActionResult> UpdateDevice(Guid id,[FromBody] UpdateDeviceDto updateDeviceDto)
        {
            var check = await _deviceRepository.UpdateDevice(id, updateDeviceDto);

            if (check)
            {
                return BadRequest("Device not updated");
            }

            return Ok(new { message = "Device updated" });
        }
    }
}

