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
        
        [HttpGet("devices/info/user/{id}")]
        public IActionResult GetDevicesInfoForUser(Guid id)
        {
            try
            {
                var devices = _deviceService.GetDeviceInfoForUser(id);
                return Ok(devices.Result);
            }
            catch (ArgumentNullException ex)
            {
                throw new ArgumentException(ex.Message);
            }
        }
        
        [HttpGet("devices/info/{id}")]
        public IActionResult GetDevicesInfo(Guid id)
        {
            try
            {
                var device = _deviceService.GetDeviceInfoForDevice(id);
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
        
	}
}

