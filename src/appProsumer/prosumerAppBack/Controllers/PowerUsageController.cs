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

    public PowerUsageController(IPowerUsageService repository)
    {
        _repository = repository;
    }

    [HttpGet("power-usage")]
    public ActionResult<IEnumerable<PowerUsage>> GetAll()
    {
        try
        {
            var powerUsages = _repository.Get();
            return Ok(powerUsages);
        }
        catch (ArgumentNullException ex)
        {
            throw new ArgumentException(ex.Message);
        }
    }

    [HttpGet("power-usage/last-week")]
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
    [HttpGet("power-usage/current/{deviceID}")]
    public ActionResult<IEnumerable<PowerUsage>> GetForDevice(Guid deviceID)
    {
        var powerUsages = _powerUsage.GetForDevice(deviceID);
        return Ok(powerUsages);
    }
   /* [HttpGet("power-usage/currentUsageUser/{userID}")]
    public ActionResult<IEnumerable<PowerUsage>> GetForUser(Guid userID)
    {
        var powerUsages = _powerUsage.CurrentPowerUsage(userID);
        return Ok(new{powerUsages});
    }*/

    [HttpGet("power-usage/currentUsageUser/summary/{userID}")] // ukupna trenutna potrosnja korisnika 
    public ActionResult<double> GetForUser(Guid userID)
    {
        var powerUsages = _powerUsage.CurrentSumPowerUsage(userID);
        return Ok(powerUsages);
    }
}