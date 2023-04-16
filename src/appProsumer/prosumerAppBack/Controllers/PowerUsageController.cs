using System;
using System.Collections.Generic;
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
    [HttpGet("power-usage/current/user/{userID}")]
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
    
    [HttpGet("power-usage/PreviousMonth/average-user-usage/{userID}")]
    public ActionResult<double> GetAvgPowerUsage(Guid userID)
    {
        double avgUsage = _powerUsage.GetAveragePowerUsageByUser(userID);
        return Ok(avgUsage);
    }

    [HttpGet("power-usage/PreviousMonth/user-every-day-device-usage/{userID}")]
    public ActionResult<Dictionary<Guid, List<double>>> GetPowerUsageEachDayOfEachDevicePrevMonth(Guid userID)
    {
        var powerUsages = _powerUsage.GetPowerUsageForDevices(userID, -1);
        return Ok(powerUsages);
    }

    [HttpGet("power-usage/nextMonth/user-every-day-device-usage/{userID}")]
    public ActionResult<Dictionary<Guid, List<double>>> GetPowerUsageEachDayOfEachDeviceNextMonth(Guid userID)
    {
        var powerUsages = _powerUsage.GetPowerUsageForDevices(userID, 1);
        return Ok(powerUsages);
    }

    [HttpGet("power-usage/PreviousMonth/device-usage/{userID}")]
    public ActionResult<List<double>> GetDeviceUsageForPreviousMonth(Guid userID)
    {
        var powerUsages = _powerUsage.GetPowerUsageForDevices(userID, -1);
        if(powerUsages == null)
        {
            return BadRequest("device does not exist");
        }
        return Ok(powerUsages);
    }

    [HttpGet("power-usage/NextMonth/device-usage/{userID}")]
    public ActionResult<List<double>> GetDeviceUsageForNextMonth(Guid userID)
    {
        var powerUsages = _powerUsage.GetPowerUsageForDevices(userID, 1);
        if (powerUsages == null)
        {
            return BadRequest("device does not exist");
        }
        return Ok(powerUsages);
    }
    
    
    [HttpGet("power-usage/current/device/{deviceID}")]
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

    [HttpGet("power-usage/7daysHistory/device/{deviceID}")]
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
    
    [HttpGet("power-usage/7daysFuture/device/{deviceID}")]
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

    [HttpGet("power-usage/Previous24h/device-usage_per_hour/{deviceID}")]
    public ActionResult<Dictionary<DateTime, double>> GetDeviceUsageForPrev24(Guid deviceID)
    {
        var powerUsages = _powerUsage.GetPowerUsageForDevicePast24Hours(deviceID, - 1);
        return Ok(powerUsages);
    }

    [HttpGet("power-usage/Next24h/device-usage_per_hour/{deviceID}")]
    public ActionResult<Dictionary<DateTime, double>> GetDeviceUsageForNext24(Guid deviceID)
    {
        var powerUsages = _powerUsage.GetPowerUsageForDeviceNext24Hours(deviceID);
        return Ok(powerUsages);
    }
    
    
    [HttpGet("power-usage/today/currentPowerUsage/{deviceID}")]
    public IActionResult GetDeviceDataHourToday(Guid deviceID)
    {
        var powerUsages = _powerUsage.GetForDeviceByHour(deviceID);
        return Ok(powerUsages);
    }
    
    [HttpGet("power-usage/current/system")]
    public ActionResult<IEnumerable<PowerUsage>> GetForSystem()
    {        
        try
        {
            var powerUsages = _powerUsageService.CurrentSumPowerUsageSystem();

            return Ok(powerUsages);
        }
        catch (ArgumentNullException ex)
        {
            throw new ArgumentException(ex.Message);
        }
    }
    
    [HttpGet("power-usage/previousMonth/system")]
    public ActionResult<double> GetSystemPowerUsageForPreviousMonth()
    {
        var powerUsages = _powerUsage.GetPowerUsageForAMonthSystem(-1);
        return Ok(powerUsages);
    }

    [HttpGet("power-usage/nextMonth/system")]
    public ActionResult<double> GetSystemPowerUsageForNextMonth()
    {
        var powerUsages = _powerUsage.GetPowerUsageForAMonthSystem(1);
        return Ok(powerUsages);
    }

    [HttpGet("power-usage/currentDay/system")]
    public ActionResult<Dictionary<DateTime, double>> GetPowerUsageForAHourSystem()
    {
        var powerUsages = _powerUsage.GetPowerUsageForADaySystem();
        return Ok(powerUsages);
    }

    [HttpGet("power-usage/previousMonth/each-device")]
    public ActionResult<List<double>> GetPowerUsagesOfEachDevicePreviousMonth()
    {
        var powerUsages = _powerUsage.GetPowerUsageSumByDevice(-1);
        return Ok(powerUsages);
    }

    [HttpGet("power-usage/nextMonth/each-device")]
    public ActionResult<List<double>> GetPowerUsagesOfEachDeviceNextMonth()
    {
        var powerUsages = _powerUsage.GetPowerUsageSumByDevice(1);
        return Ok(powerUsages);
    }

    [HttpGet("power-usage/previousMonth/every-day-usage")]
    public ActionResult<List<double>> GetPowerUsagesOfEachDayPrevMonth()
    {
        var powerUsages = _powerUsage.GetPowerUsagesForEachDay(-1);
        return Ok(powerUsages);
    }

    [HttpGet("power-usage/nextMonth/every-day-usage")]
    public ActionResult<List<double>> GetPowerUsagesOfEachDayNextMont()
    {
        var powerUsages = _powerUsage.GetPowerUsagesForEachDay(1);
        return Ok(powerUsages);
    }

    [HttpGet("power-usage/PreviousMonth/average-user-usage/{userID}")]
    public ActionResult<double> GetAvgPowerUsage(Guid userID)
    {
        double avgUsage = _powerUsage.GetAveragePowerUsageByUser(userID);
        return Ok(avgUsage);
    }

    [HttpGet("power-usage/PreviousMonth/user-every-day-device-usage/{userID}")]
    public ActionResult<Dictionary<Guid, List<double>>> GetPowerUsageEachDayOfEachDevicePrevMonth(Guid userID)
    {
        var powerUsages = _powerUsage.GetPowerUsageForDevices(userID, -1);
        return Ok(powerUsages);
    }

    [HttpGet("power-usage/nextMonth/user-every-day-device-usage/{userID}")]
    public ActionResult<Dictionary<Guid, List<double>>> GetPowerUsageEachDayOfEachDeviceNextMonth(Guid userID)
    {
        var powerUsages = _powerUsage.GetPowerUsageForDevices(userID, 1);
        return Ok(powerUsages);
    }

    [HttpGet("power-usage/PreviousMonth/device-usage/{deviceID}")]
    public ActionResult<List<double>> GetDeviceUsageForPreviousMonth(Guid deviceID)
    {
        var powerUsages = _powerUsage.GetPowerUsageForDevices(deviceID, -1);
        if(powerUsages == null)
        {
            return BadRequest("device does not exist");
        }
        return Ok(powerUsages);
    }

    [HttpGet("power-usage/NextMonth/device-usage/{deviceID}")]
    public ActionResult<List<double>> GetDeviceUsageForNextMonth(Guid deviceID)
    {
        var powerUsages = _powerUsage.GetPowerUsageForDevices(deviceID, 1);
        if (powerUsages == null)
        {
            return BadRequest("device does not exist");
        }
        return Ok(powerUsages);
    }

    [HttpGet("power-usage/Previous24h/device-usage_per_hour/{deviceID}")]
    public ActionResult<Dictionary<DateTime, double>> GetDeviceUsageForPrev24(Guid deviceID)
    {
        var powerUsages = _powerUsage.GetPowerUsageForDevicePast24Hours(deviceID, - 1);
        return Ok(powerUsages);
    }

    [HttpGet("power-usage/Next24h/device-usage_per_hour/{deviceID}")]
    public ActionResult<Dictionary<DateTime, double>> GetDeviceUsageForNext24(Guid deviceID)
    {
        var powerUsages = _powerUsage.GetPowerUsageForDeviceNext24Hours(deviceID);
        return Ok(powerUsages);
    }

    [HttpGet("power-usage/currentDay-consumption/system")]
    public ActionResult<Dictionary<DateTime, double>> GetPowerUsageForAHourSystem()
    {
        var powerUsages = _powerUsage.GetPowerConsumedForADaySystem();
        return Ok(powerUsages);
    }

    [HttpGet("power-usage/currentDay-production/system")]
    public ActionResult<Dictionary<DateTime, double>> GetPowerProducedForADaySystem()
    {
        var powerUsages = _powerUsage.GetPowerProducedForADaySystem();
        return Ok(powerUsages);
    }

    [HttpGet("power-usage/current-hour-production/system")]
    public ActionResult<Dictionary<DateTime, double>> GetCurrentPowerProduction()
    {
        var powerUsages = _powerUsageService.GetCurrentPowerProduction();
        return Ok(powerUsages);
    }

    [HttpGet("power-usage/current-hour-consumption/system")]
    public ActionResult<Dictionary<DateTime, double>> GetCurrentPowerConsumption()
    {
        var powerUsages = _powerUsageService.GetCurrentPowerConsumption();
        return Ok(powerUsages);
    }

    [HttpGet("power-usage/currentPowerUsage/{deviceID}")]
    public ActionResult<Dictionary<DateTime, double>> GetCurrentPowerUsageForDevice(Guid deviceID)
    {
        var powerUsages = _powerUsage.GetCurrentPowerUsageForDevice(deviceID);
        return Ok(powerUsages);
    }
    
    [HttpGet("power-usage/today/currentPowerUsage/{deviceID}")]
    public IActionResult GetDeviceDataHourToday(Guid deviceID)
    {
        var powerUsages = _powerUsage.GetForDeviceByHour(deviceID);
        return Ok(powerUsages);
    }
    
    /*[HttpGet("power-usage/most-consumes/last-24hours/{userID}")]
    public ActionResult<Dictionary<DateTime, double>> GetMostConsumerPast24hours(Guid userID)
    {
        var powerUsages = _powerUsageService.GetDeviceWithMaxPowerUsage24(userID);
        return Ok(powerUsages);
    }

    [HttpGet("power-usage/most-consumes/last-week/{userID}")]
    public ActionResult<Dictionary<DateTime, double>> GetMostConsumerLastWeek(Guid userID)
    {
        var powerUsages = _powerUsageService.GetDevicePowerUsageMaxForUserLastWeek(userID);
        return Ok(powerUsages);
    }

    [HttpGet("power-usage/most-consumes/last-month/{userID}")]
    public ActionResult<Dictionary<DateTime, double>> GetMostConsumerLastMonth(Guid userID)
    {
        var powerUsages = _powerUsageService.GetDevicePowerUsageForUserPreviousMonth(userID);
        return Ok(powerUsages);
    }*/
}