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
    
    [HttpGet("power-usage/current-consumption/system")]
    public ActionResult<IEnumerable<PowerUsage>> GetForSystemConsumer()
    {        
        try
        {
            var powerUsages = _powerUsageService.CurrentSumPowerUsageSystemConsumer();

            return Ok(powerUsages);
        }
        catch (ArgumentNullException ex)
        {
            throw new ArgumentException(ex.Message);
        }
    }

    [HttpGet("power-usage/current-production/system")]
    public ActionResult<IEnumerable<PowerUsage>> CurrentSumPowerUsageSystemProducer()
    {
        try
        {
            var powerUsages = _powerUsageService.CurrentSumPowerUsageSystemProducer();

            return Ok(powerUsages);
        }
        catch (ArgumentNullException ex)
        {
            throw new ArgumentException(ex.Message);
        }
    }

    [HttpGet("power-usage/currentUsageUser/average-production/{userID}")]
    public ActionResult<double> GetForUserProduction(Guid userID)
    {
        try
        {
            var powerUsages = _powerUsageService.AverageSumPowerUsageProduction(userID);

            return Ok(powerUsages);
        }
        catch (ArgumentNullException ex)
        {
            throw new ArgumentException(ex.Message);
        }
    }

    [HttpGet("power-usage/currentUsageUser/average-consumtion/{userID}")]
    public ActionResult<double> GetForUserConsumption(Guid userID)
    {
        try
        {
            var powerUsages = _powerUsageService.AverageSumPowerUsageConsumtion(userID);

            return Ok(powerUsages);
        }
        catch (ArgumentNullException ex)
        {
            throw new ArgumentException(ex.Message);
        }
    }

    [HttpGet("power-usage/currentUsageUser/sum-consumtion/{userID}")]
    public ActionResult<double> GetForUserSumConsumption(Guid userID)
    {
        var powerUsages = _powerUsageService.CurrentSumPowerUsageConsumption(userID);
        return Ok(powerUsages);
    }

    [HttpGet("power-usage/currentUsageUser/sum-production/{userID}")]
    public ActionResult<double> GetForUserSumProduction(Guid userID)
    {
        var powerUsages = _powerUsageService.CurrentSumPowerUsageProduction(userID);
        return Ok(powerUsages);
    }

    [HttpGet("power-usage/previousMonth/consumption/system")]
    public ActionResult<double> GetSystemPowerUsageForPreviousMonthConsumption()
    {
        var powerUsages = _powerUsageService.GetPoweUsageForAMonthSystemConsumer(-1);
        return Ok(powerUsages);
    }

    [HttpGet("power-usage/nextMonth/consumption/system")]
    public ActionResult<double> GetSystemPowerUsageForNextMonthConsumption()
    {
        var powerUsages = _powerUsageService.GetPoweUsageForAMonthSystemConsumer(1);
        return Ok(powerUsages);
    }

    [HttpGet("power-usage/previousMonth/production/system")]
    public ActionResult<double> GetSystemPowerUsageForPreviousMonthProduction()
    {
        var powerUsages = _powerUsageService.GetPoweUsageForAMonthSystemProducer(-1);
        return Ok(powerUsages);
    }

    [HttpGet("power-usage/nextMonth/production/system")]
    public ActionResult<double> GetSystemPowerUsageForNextMonth()
    {
        var powerUsages = _powerUsageService.GetPoweUsageForAMonthSystemProducer(1);
        return Ok(powerUsages);
    }

    [HttpGet("power-usage/previousMonth/consumption/each-device")]
    public ActionResult<List<PowerUsage>> GetPowerUsagesOfEachDevicePreviousMonthConsumption()
    {
        var powerUsages = _powerUsageService.GetPowerUsageSumByDeviceConsumer(-1);
        return Ok(powerUsages);
    }

    [HttpGet("power-usage/previousMonth/production/each-device")]
    public ActionResult<List<PowerUsage>> GetPowerUsagesOfEachDevicePreviousMonthProduction()
    {
        var powerUsages = _powerUsageService.GetPowerUsageSumByDeviceProducer(-1);
        return Ok(powerUsages);
    }

    [HttpGet("power-usage/nextMonth/consumption/each-device")]
    public ActionResult<List<PowerUsage>> GetPowerUsagesOfEachDeviceNextMonthConsumption()
    {
        var powerUsages = _powerUsageService.GetPowerUsageSumByDeviceConsumer(1);
        return Ok(powerUsages);
    }

    [HttpGet("power-usage/nextMonth/production/each-device")]
    public ActionResult<List<PowerUsage>> GetPowerUsagesOfEachDeviceNextMonthProduction()
    {
        var powerUsages = _powerUsageService.GetPowerUsageSumByDeviceProducer(1);
        return Ok(powerUsages);
    }

/*    [HttpGet("power-usage/previousMonth/consumption/every-day-usage")]
    public ActionResult<PowerUsage> GetPowerUsagesOfEachDayPrevMonthConsumption()
    {
        var powerUsages = _powerUsageService.GetPowerUsagesForEachDayConsumtion(-1);
        return Ok(powerUsages);
    }

    [HttpGet("power-usage/nextMonth/consumption/every-day-usage")]
    public ActionResult<PowerUsage> GetPowerUsagesOfEachDayNextMontConsumption()
    {
        var powerUsages = _powerUsageService.GetPowerUsagesForEachDayConsumtion(1);
        return Ok(powerUsages);
    }

    [HttpGet("power-usage/previousMonth/production/every-day-usage")]
    public ActionResult<PowerUsage> GetPowerUsagesOfEachDayPrevMonthProduction()
    {
        var powerUsages = _powerUsageService.GetPowerUsagesForEachDayProduction(-1);
        return Ok(powerUsages);
    }

    [HttpGet("power-usage/nextMonth/production/every-day-usage")]
    public ActionResult<PowerUsage> GetPowerUsagesOfEachDayNextMontProduction()
    {
        var powerUsages = _powerUsageService.GetPowerUsagesForEachDayProduction(1);
        return Ok(powerUsages);
    }
*/
    /* [HttpGet("power-usage/PreviousMonth/average-user-usage/{userID}")]
     public ActionResult<double> GetAvgPowerUsage(Guid userID)
     {
         double avgUsage = _powerUsage.GetAveragePowerUsageByUser(userID);
         return Ok(avgUsage);
     }*/

    [HttpGet("power-usage/PreviousMonth/consumption/user-every-day-device-usage/{userID}")]
    public ActionResult<List<PowerUsage>> GetPowerUsageEachDayOfEachDevicePrevMonthConsumption(Guid userID)
    {
        var powerUsages = _powerUsageService.GetPowerUsageForDevicesConsumption(userID, -1);
        return Ok(powerUsages);
    }

    [HttpGet("power-usage/nextMonth/consumtion/user-every-day-device-usage/{userID}")]
    public ActionResult<List<PowerUsage>> GetPowerUsageEachDayOfEachDeviceNextMonthConsumption(Guid userID)
    {
        var powerUsages = _powerUsageService.GetPowerUsageForDevicesConsumption(userID, 1);
        return Ok(powerUsages);
    }

    [HttpGet("power-usage/PreviousMonth/production/user-every-day-device-usage/{userID}")]
    public ActionResult<List<PowerUsage>> GetPowerUsageEachDayOfEachDevicePrevMonthProduction(Guid userID)
    {
        var powerUsages = _powerUsageService.GetPowerUsageForDevicesProduction(userID, -1);
        return Ok(powerUsages);
    }

    [HttpGet("power-usage/nextMonth/production/user-every-day-device-usage/{userID}")]
    public ActionResult<List<PowerUsage>> GetPowerUsageEachDayOfEachDeviceNextMonthProduction(Guid userID)
    {
        var powerUsages = _powerUsageService.GetPowerUsageForDevicesProduction(userID, 1);
        return Ok(powerUsages);
    }

  /*  [HttpGet("power-usage/PreviousMonth/device-usage/{deviceID}")]
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
*/
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

    [HttpGet("power-usage/currentDay/system")]
    public ActionResult<Dictionary<DateTime, double>> GetPowerUsageForAHourSystem()
    {
        var powerUsages = _powerUsage.GetPowerUsageForADaySystem();
        return Ok(powerUsages);
    }

    [HttpGet("power-usage/currentHour/system")]
    public ActionResult<Dictionary<DateTime, double>> GetCurrentPowerUsage()
    {
        var powerUsages = _powerUsage.GetCurrentPowerUsage();
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

    [HttpGet("power-usage/12hours/{deviceID}")]
    public ActionResult<PowerUsage> GetPowerUsage12(Guid deviceID)
    {
        var powerUsages = _powerUsageService.GetPowerUsageFor12HoursUpDown(deviceID);
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