using System;
using Microsoft.AspNetCore.Mvc;
using prosumerAppBack.BusinessLogic;
using prosumerAppBack.BusinessLogic.DeviceService;
using prosumerAppBack.Models;
using prosumerAppBack.Models.Device;

namespace prosumerAppBack.Controllers
{
	[ApiController]
	[Route("api/[controller]")]
	public class DeviceController : ControllerBase
	{
		private readonly IDeviceRepository _deviceRepository;
		private readonly IDeviceService _deviceService;
		public DeviceController(IDeviceRepository deviceRepository, IDeviceService deviceService)
		{
			_deviceRepository = deviceRepository;
			_deviceService = deviceService;
		}

		[HttpGet("{id}")]
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

        [HttpPost("update{id}")]
        public async Task<IActionResult> UpdateDevice(Guid id,[FromBody] UpdateDeviceDto updateDeviceDto)
        {
            var check = await _deviceRepository.UpdateDevice(id, updateDeviceDto);

            if (check)
            {
                return BadRequest("Device not updated");
            }

            return Ok(new { message = "Device updated" });
        }
        [HttpPost("add-new")]
        public async Task<IActionResult> AddDevice([FromBody] Models.Device.AddDeviceDto addDeviceDto)
        {
	        var check = await _deviceRepository.AddDevice(addDeviceDto);
			if (check == null)
			{
				return BadRequest("Cannot add device");
			}

			return Ok(new { message = "Device added" });
		}
        [HttpGet("devices/{userID}")]
        public IActionResult GetDevicesForUser(Guid userID)
        {
	        var devices = _deviceService.GetDevicesForUser(userID);

	        if (devices == null)
	        {
		        return NotFound();
	        }

	        return Ok(devices);
        }
        [HttpGet("groups")]
        public IActionResult GetGroups()
        {
	        var groups = _deviceRepository.GetDeviceGroups();

	        if (groups == null)
	        {
		        return NotFound();
	        }

	        return Ok(groups);
        }
        [HttpGet("manufacturers")]
        public IActionResult GetManufacturers()
        {
	        var manufacturers = _deviceRepository.GetDeviceManufacturers();

	        if (manufacturers == null)
	        {
		        return NotFound();
	        }

	        return Ok(manufacturers);
        }
        
        [HttpGet("manufacturer/{manID}")]
        public IActionResult GetDeviceTypesManufacturer(Guid manID)
        {
	        var manufacturers = _deviceRepository.GetDevicesBasedOnManufacturer(manID);

	        if (manufacturers == null)
	        {
		        return NotFound();
	        }

	        return Ok(manufacturers);
        }
        
        [HttpGet("groups/{groupID}")]
        public IActionResult GetDeviceTypesGroup(Guid groupID)
        {
	        var groups = _deviceRepository.GetDevicesBasedOnGroup(groupID);

	        if (groups == null)
	        {
		        return NotFound();
	        }

	        return Ok(groups);
        }
	}
}

