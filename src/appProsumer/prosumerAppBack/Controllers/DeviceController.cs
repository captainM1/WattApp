using System;
using Microsoft.AspNetCore.Mvc;
using prosumerAppBack.BusinessLogic;
using prosumerAppBack.BusinessLogic.DeviceService;
using prosumerAppBack.Models;
using prosumerAppBack.Models.Device;

namespace prosumerAppBack.Controllers
{
	[ApiController]
	public class DeviceController : ControllerBase
	{
        private readonly IDeviceService _deviceService;

        public DeviceController(IDeviceRepository deviceRepository, IDeviceService deviceService)
		{
			_deviceService = deviceService;
		}

		[HttpGet("devices/{id}")]
		public async Task<ActionResult<Device>> GetDevice(Guid id)
		{
            try
            {
                var device = await _deviceService.GetDeviceById(id);

                return Ok(device);
            }
            catch (ArgumentNullException ex)
            {
                throw new ArgumentException(ex.Message);
            }
        }

		[HttpGet("devices")]
		public async Task<IActionResult> GetAllDevices()
		{
            try
            {
                var devices = await _deviceService.GetAllDevices();
                if (devices == null)
                {
                    return BadRequest("Devices not found");
                }

                return Ok(devices);
            }
            catch (ArgumentNullException ex)
            {
                throw new ArgumentException(ex.Message);
            }
        }

        [HttpPost("devices/update{id}")]
        public async Task<IActionResult> UpdateDevice(Guid id,[FromBody] UpdateDeviceDto updateDeviceDto)
        {
            try
            {
                var check = await _deviceService.UpdateDevice(id, updateDeviceDto);

                return Ok(new { message = "Device updated" });
            }
            catch (ArgumentNullException ex)
            {
                throw new ArgumentException(ex.Message);
            }            
        }
        [HttpPost("devices/add-new")]
        public async Task<IActionResult> AddDevice([FromBody] AddDeviceDto addDeviceDto)
        {
            try
            {
                var check = await _deviceService.AddDevice(addDeviceDto);

                return Ok(new { message = "Device added" });
            }
            catch (ArgumentNullException ex)
            {
                throw new ArgumentException(ex.Message);
            }
        }
	}
}

