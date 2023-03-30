using System;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using prosumerAppBack.BusinessLogic;
using prosumerAppBack.Models;

namespace prosumerAppBack.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PowerUsageController : ControllerBase
{
    private readonly IPowerUsageRepository _powerUsage;

    public PowerUsageController(IPowerUsageRepository powerUsage)
    {
        _powerUsage = powerUsage;
    }

    [HttpGet("power-usage")]
    public ActionResult<IEnumerable<PowerUsage>> GetAll()
    {
        var powerUsages = _powerUsage.Get();
        return Ok(powerUsages);
    }

    [HttpGet("power-usage/last-week")]
    public ActionResult<IEnumerable<PowerUsage>> GetDeviceConsumptionLastWeek()
    {
        var powerUsages = _powerUsage.PreviousSevenDays();
        return Ok(powerUsages);
    }

    [HttpGet("power-usage/next-week")]
    public ActionResult<IEnumerable<PowerUsage>> GetDeviceConsumptionNextWeek()
    {
        var powerUsages = _powerUsage.NextSevenDays();
        return Ok(powerUsages);
    }

    [HttpGet("power-usage/today/{deviceID}")]
    public ActionResult<IEnumerable<PowerUsage>> GetPowerUsageForDay(Guid deviceID)
    {
        var powerUsages = _powerUsage.GetPowerUsageForDay(deviceID,DateTime.Today);
        return Ok(powerUsages);
    }
    
    [HttpGet("power-usage/7daysHistory/{deviceID}")]
    public ActionResult<IEnumerable<PowerUsage>> GetPowerUsageFor7DaysHistory(Guid deviceID)
    {
        var powerUsages = _powerUsage.GetPowerUsageFor7Days(deviceID,1);
        return Ok(powerUsages);
    }
    [HttpGet("power-usage/7daysFuture/{deviceID}")]
    public ActionResult<IEnumerable<PowerUsage>> GetPowerUsageFor7DaysFuture(Guid deviceID)
    {
        var powerUsages = _powerUsage.GetPowerUsageFor7Days(deviceID,-1);
        return Ok(powerUsages);
    }
}