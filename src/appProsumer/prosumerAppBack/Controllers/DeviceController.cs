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
		private readonly IDeviceRepository _deviceRepository;

		public DeviceController(IDeviceRepository deviceRepository)
		{
			_deviceRepository = deviceRepository;
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
				return BadRequest("Not devices foundd");
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

        [HttpPost("devices/add-new")]
        public async Task<IActionResult> AddDevice([FromBody] AddDeviceDto addDeviceDto)
        {
            var check = await _deviceRepository.AddDevice(addDeviceDto);

            if (check == null)
            {
                return BadRequest("Cannot add device");
            }

            return Ok(new { message = "Device added" });
        }

    }
}

