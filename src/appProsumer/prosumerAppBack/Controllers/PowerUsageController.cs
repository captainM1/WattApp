using System;
using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using prosumerAppBack.BusinessLogic;
using prosumerAppBack.BusinessLogic.PowerUsageService;
using prosumerAppBack.Models;
using prosumerAppBack.Models.Device;

namespace prosumerAppBack.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PowerUsageController : ControllerBase
{
    private readonly IPowerUsageService _powerUsageService;
    private readonly IPowerUsageRepository _powerUsage;

    public PowerUsageController(IPowerUsageService powerUsageService, IPowerUsageRepository powerUsage)
    {
        _powerUsageService = powerUsageService;
        _powerUsage = powerUsage;
    }
    
    [HttpGet("power-usage/today/{deviceID}")]
    public ActionResult<IEnumerable<PowerUsage>> GetPowerUsageForDay(Guid deviceID)
    {
        try
        {
            var powerUsages = _powerUsageService.GetPowerUsageForDay(deviceID, DateTime.Today);

            return Ok(powerUsages);
        }
        catch (ArgumentNullException ex)
        {
            throw new ArgumentException(ex.Message);
        }
    }
    
    [HttpGet("power-usage/7daysHistory/{deviceID}")]
    public ActionResult<IEnumerable<PowerUsage>> GetPowerUsageFor7DaysHistory(Guid deviceID)
    {        
        try
        {
            var powerUsages = _powerUsageService.GetPowerUsageFor7Days(deviceID, -1);

            return Ok(powerUsages);
        }
        catch (ArgumentNullException ex)
        {
            throw new ArgumentException(ex.Message);
        }
    }
    [HttpGet("power-usage/7daysFuture/{deviceID}")]
    public ActionResult<IEnumerable<PowerUsage>> GetPowerUsageFor7DaysFuture(Guid deviceID)
    {        
        try
        {
            var powerUsages = _powerUsageService.GetPowerUsageFor7Days(deviceID, 1);

            return Ok(powerUsages);
        }
        catch (ArgumentNullException ex)
        {
            throw new ArgumentException(ex.Message);
        }
    }
    [HttpGet("power-usage/current/{deviceID}")]
    public ActionResult<IEnumerable<PowerUsage>> GetForDevice(Guid deviceID)
    {        
        try
        {
            var powerUsages = _powerUsageService.GetForDevice(deviceID);

            return Ok(powerUsages);
        }
        catch (ArgumentNullException ex)
        {
            throw new ArgumentException(ex.Message);
        }
    }

    [HttpGet("power-usage/currentUsageUser/summary/{userID}")]
    public ActionResult<double> GetForUser(Guid userID)
    {        
        try
        {
            var powerUsages = _powerUsageService.CurrentSumPowerUsage(userID);

            return Ok(powerUsages);
        }
        catch (ArgumentNullException ex)
        {
            throw new ArgumentException(ex.Message);
        }
    }
}