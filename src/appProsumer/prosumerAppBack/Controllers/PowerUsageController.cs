using System;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using prosumerAppBack.BusinessLogic;
using prosumerAppBack.BusinessLogic.PowerUsageService;
using prosumerAppBack.Models;

namespace prosumerAppBack.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PowerUsageController : ControllerBase
{
    private readonly IPowerUsageService _repository;
    private readonly IPowerUsageRepository _powerUsage;

    public PowerUsageController(IPowerUsageService repository, IPowerUsageRepository powerUsage)
    {
        _repository = repository;
        _powerUsage = powerUsage;
    }

    /*[HttpGet("power-usage/last-week")]
    public ActionResult<IEnumerable<PowerUsage>> GetDeviceConsumptionLastWeek()
    {
        try
        {
            var powerUsages = _repository.PreviousSevenDays();
            return Ok(powerUsages);
        }
        catch (ArgumentNullException ex)
        {
            throw new ArgumentException(ex.Message);
        }
    }

    [HttpGet("power-usage/next-week")]
    public ActionResult<IEnumerable<PowerUsage>> GetDeviceConsumptionNextWeek()
    {
        try
        {
            var powerUsages = _repository.NextSevenDays();
            return Ok(powerUsages);
        }
        catch (ArgumentNullException ex)
        {
            throw new ArgumentException(ex.Message);
        }
    }*/

    [HttpGet("power-usage/today/{deviceID}")]
    public ActionResult<IEnumerable<PowerUsage>> GetPowerUsageForDay(Guid deviceID)
    {
        var powerUsages = _powerUsage.GetPowerUsageForDay(deviceID, DateTime.Today);
        return Ok(powerUsages);
    }

    [HttpGet("power-usage/7daysHistory/{deviceID}")]
    public ActionResult<IEnumerable<PowerUsage>> GetPowerUsageFor7DaysHistory(Guid deviceID)
    {
        var powerUsages = _powerUsage.GetPowerUsageFor7Days(deviceID, -1);
        return Ok(powerUsages);
    }
    [HttpGet("power-usage/7daysFuture/{deviceID}")]
    public ActionResult<IEnumerable<PowerUsage>> GetPowerUsageFor7DaysFuture(Guid deviceID)
    {
        var powerUsages = _powerUsage.GetPowerUsageFor7Days(deviceID, 1);
        return Ok(powerUsages);
    }
    [HttpGet("power-usage/current/{deviceID}")]
    public ActionResult<IEnumerable<PowerUsage>> GetForDevice(Guid deviceID)
    {
        var powerUsages = _powerUsage.GetForDevice(deviceID);
        return Ok(powerUsages);
    }

    [HttpGet("power-usage/currentUsageUser/summary/{userID}")]
    public ActionResult<double> GetForUser(Guid userID)
    {
        var powerUsages = _powerUsage.CurrentSumPowerUsage(userID);
        return Ok(powerUsages);
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

    [HttpGet("power-usage/delete-device/{deviceID}")]
    public async Task<IActionResult> DeleteDevice(Guid deviceID)
    {
        var action = await _powerUsage.DeleteDevice(deviceID);
        if(!action)
        {
            return BadRequest("device cannot be deleted");
        }

        return Ok(new {Message = "device deleted successfully" });
    }
}