using System;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
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
        private readonly IDeviceService _deviceService;
		private readonly IDeviceService _deviceService;
		private readonly IUserService _userService;
        public DeviceController(IDeviceService deviceService, IDeviceService deviceService, IUserService userService)
		{
			_deviceService = deviceService;
			_deviceService = deviceService;
			_userService = userService;
		}

		[HttpGet("{id}")]
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

        [HttpPost("update{id}")]
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
        [HttpGet("devices/info")]
        public IActionResult GetDevicesInfoForUser()
        {
	        var devices = _deviceRepository.GetDevicesInfoForUser(_userService.GetID().Value);
			
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
        
        [HttpGet("manufacturers/{groupID}")]
        public IActionResult GetDeviceManufacturersBasedOnGroup(Guid groupID)
        {
	        var manufacturers = _deviceRepository.GetManufacturersBasedOnGroup(groupID);

	        if (manufacturers == null)
	        {
		        return NotFound();
	        }

	        return Ok(manufacturers);
        }
        
        [HttpGet("manufacturer/{manID}")]
        public IActionResult GetDevicesBasedOnManufacturer(Guid manID)
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
        
        [HttpGet("{groupID}/{manufID}")]
        public IActionResult GetDeviceTypesGroup(Guid groupID,Guid manufID)
        {
	        var list = _deviceRepository.GetDevicesBasedOnManufacturerAndGroup(manufID, groupID);

	        if (list == null)
	        {
		        return NotFound();
	        }

	        return Ok(list);
        }
        
	}
}

