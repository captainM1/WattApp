using System;
using System.Text.RegularExpressions;
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
		private readonly IUserService _userService;
        public DeviceController(IDeviceService deviceService, IUserService userService)
		{
			_deviceService = deviceService;
			_userService = userService;
		}

        [HttpPost("update/{id}")]
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
            try
            {
                var devices = _deviceService.GetDevicesForUser(userID);

                return Ok(devices);
            }
            catch (ArgumentNullException ex)
            {
                throw new ArgumentException(ex.Message);
            }
        }
        [HttpGet("devices/info")]
        public IActionResult GetDevicesInfoForUser()
        {
            try
            {
                var devices = _deviceService.GetDevicesInfoForUser(_userService.GetID().Value);

                return Ok(devices);
            }
            catch (ArgumentNullException ex)
            {
                throw new ArgumentException(ex.Message);
            }
        }
        
        [HttpGet("devices/info/user/{userID}")]
        public IActionResult GetDevicesInfoForUser(Guid userID)
        {
            try
            {
                var devices = _deviceService.GetDeviceInfoForUser(userID);
                return Ok(devices.Result);
            }
            catch (ArgumentNullException ex)
            {
                throw new ArgumentException(ex.Message);
            }
        }
        
        [HttpGet("devices/info/{deviceID}")]
        public IActionResult GetDevicesInfo(Guid deviceID)
        {
            try
            {
                var device = _deviceService.GetDeviceInfoForDevice(deviceID);
                return Ok(device.Result);
            }
            catch (ArgumentNullException ex)
            {
                throw new ArgumentException(ex.Message);
            }
            
        }
        
        [HttpGet("groups")]
        public IActionResult GetGroups()
        {
            try
            {
                var groups = _deviceService.GetDeviceGroups();

                return Ok(groups);
            }
            catch (ArgumentNullException ex)
            {
                throw new ArgumentException(ex.Message);
            }
        }
        [HttpGet("manufacturers")]
        public IActionResult GetManufacturers()
        {	        
            try
            {
                var manufacturers = _deviceService.GetDeviceManufacturers();

                return Ok(manufacturers);
            }
            catch (ArgumentNullException ex)
            {
                throw new ArgumentException(ex.Message);
            }
        }
        
        [HttpGet("manufacturers/{groupID}")]
        public IActionResult GetDeviceManufacturersBasedOnGroup(Guid groupID)
        {
            try
            {
                var manufacturers = _deviceService.GetManufacturersBasedOnGroup(groupID);

                return Ok(manufacturers);
            }
            catch (ArgumentNullException ex)
            {
                throw new ArgumentException(ex.Message);
            }
        }
        
        [HttpGet("manufacturer/{manID}")]
        public IActionResult GetDevicesBasedOnManufacturer(Guid manID)
        {
            try
            {
                var manufacturers = _deviceService.GetDevicesBasedOnManufacturer(manID);

                return Ok(manufacturers);
            }
            catch (ArgumentNullException ex)
            {
                throw new ArgumentException(ex.Message);
            }
        }
        
        [HttpGet("groups/{groupID}")]
        public IActionResult GetDeviceTypesGroup(Guid groupID)
        {
            try
            {
                var groups = _deviceService.GetDevicesBasedOnGroup(groupID);

                return Ok(groups);
            }
            catch (ArgumentNullException ex)
            {
                throw new ArgumentException(ex.Message);
            }
        }
        
        [HttpGet("{groupID}/{manufID}")]
        public IActionResult GetDeviceTypesGroup(Guid groupID,Guid manufID)
        {
            try
            {
                var list = _deviceService.GetDevicesBasedOnManufacturerAndGroup(manufID, groupID);

                return Ok(list);
            }
            catch (ArgumentNullException ex)
            {
                throw new ArgumentException(ex.Message);
            }
        }
        [HttpDelete("delete-device/{deviceID}")]
        public async Task<IActionResult> DeleteDevice(Guid deviceID)
        {
            var action = await _deviceService.DeleteDevice(deviceID);
            if(!action)
            {
                return BadRequest("device cannot be deleted");
            }

            return Ok(new {Message = "device deleted successfully" });
        }
        
        [HttpPost("add-rule/{id}")]
        public async Task<IActionResult> AddDeviceRule(Guid id, [FromBody] DeviceRuleDto deviceRuleDto)
        {
            try
            {
                var check = await _deviceService.AddDeviceRule(id, deviceRuleDto);

                return Ok(new { message = "Device rule added" });
            }
            catch (ArgumentNullException ex)
            {
                throw new ArgumentException(ex.Message);
            }
        }

        [HttpPost("update-rule/{id}")]
        public async Task<IActionResult> UpdateDeviceRule(Guid id, [FromBody] DeviceRuleDto deviceRuleDto)
        {
            try
            {
                var check = await _deviceService.UpdateDeviceRule(id, deviceRuleDto);

                return Ok(new { message = "Device rule updated" });
            }
            catch (ArgumentNullException ex)
            {
                throw new ArgumentException(ex.Message);
            }
        }

        [HttpPost("add-requirement/{id}")]
        public async Task<IActionResult> AddDeviceRequirement(Guid id, [FromBody] DeviceRequirementDto deviceRequirementDto)
        {
            try
            {
                var check = await _deviceService.AddDeviceRequirement(id, deviceRequirementDto);

                return Ok(new { message = "Device requirement added" });
            }
            catch (ArgumentNullException ex)
            {
                throw new ArgumentException(ex.Message);
            }
        }

        [HttpPost("update-requirement/{id}")]
        public async Task<IActionResult> UpdateDeviceRequirement(Guid id, [FromBody] DeviceRequirementDto deviceRequirementDto)
        {
            try
            {
                var check = await _deviceService.UpdateDeviceRequirement(id, deviceRequirementDto);

                return Ok(new { message = "Device requirement updated" });
            }
            catch (ArgumentNullException ex)
            {
                throw new ArgumentException(ex.Message);
            }
        }
	}
}

