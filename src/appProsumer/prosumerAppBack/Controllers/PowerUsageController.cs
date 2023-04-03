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
    public ActionResult<List<PowerUsage>> GetSystemPowerUsageForMonth()
    {
        var powerUsages = _powerUsage.GetPowerUsageForAMonthSystem();
        return Ok(powerUsages);
    }

    [HttpGet("power-usage/previousMonth/each-device")]
    public ActionResult<List<double>> GetPowerUsagesOfEachDevice()
    {
        var powerUsages = _powerUsage.GetPowerUsageSumByDevicePreviousMonth();
        return Ok(powerUsages);
    }

    [HttpGet("power-usage/previousMonth/every-day-usage")]
    public ActionResult<List<double>> GetPowerUsagesOfEachDay()
    {
        var powerUsages = _powerUsage.GetPowerUsagesForEachDayPreviousMonth();
        return Ok(powerUsages);
    }

    [HttpGet("power-usage/PreviousMonth/average-user-usage/{userID}")]
    public ActionResult<double> GetAvgPowerUsage(Guid userID)
    {
        double avgUsage = _powerUsage.GetAveragePowerUsageByUser(userID);
        return Ok(avgUsage);
    }

    [HttpGet("power-usage/PreviousMonth/user-every-day-device-usage/{userID}")]
    public ActionResult<Dictionary<Guid, List<double>>> GetPowerUsageEachDayOfEachDevice(Guid userID)
    {
        var powerUsages = _powerUsage.GetPowerUsageForDevicesInPreviousMonth(userID);
        return Ok(powerUsages);
    }
}