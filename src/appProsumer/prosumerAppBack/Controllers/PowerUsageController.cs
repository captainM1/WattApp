using System;
using System.Collections.Generic;
using System.Data;
using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using prosumerAppBack.BusinessLogic;
using prosumerAppBack.BusinessLogic.PowerUsageService;
using prosumerAppBack.Models;
using prosumerAppBack.Models.Device;
namespace prosumerAppBack.Controllers;

[ApiController]
[Route("api/[controller]")]
//[Authorize(Roles = "Dispatcher,Admin,UnapprovedUser,RegularUser")]
public class PowerUsageController : ControllerBase
{
    private readonly IPowerUsageService _powerUsageService;
    private readonly IPowerUsageRepository _powerUsage;

    public PowerUsageController(IPowerUsageService powerUsageService, IPowerUsageRepository powerUsage)
    {
        _powerUsageService = powerUsageService;
        _powerUsage = powerUsage;
    }
  
    [HttpGet("power-usage/current/device/{deviceID}")]
    public ActionResult<double> GetForDevice(Guid deviceID)
    {        
        var powerUsages = _powerUsageService.GetForDevice(deviceID);

        if (powerUsages == -1)
            return BadRequest("Device does not exists");
        else if (powerUsages == 0)
            return BadRequest("Device is turned off");
        return Ok(powerUsages);
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

    [HttpGet("power-usage/MonthFuture/device/{deviceID}")]
    public ActionResult<IEnumerable<PowerUsage>> GetPowerUsageForAMonthFuture(Guid deviceID)
    {
            var powerUsages = _powerUsageService.GetPowerUsageForAMonth(deviceID, 1);

            return Ok(powerUsages);
    }

    [HttpGet("power-usage/MonthPast/device/{deviceID}")]
    public ActionResult<IEnumerable<PowerUsage>> GetPowerUsageForAMonthPast(Guid deviceID)
    {
        var powerUsages = _powerUsageService.GetPowerUsageForAMonth(deviceID, -1);

        return Ok(powerUsages);
    }

    [HttpGet("power-usage/Previous24h/device-usage_per_hour/{deviceID}")]
    public ActionResult<PowerUsage> GetDeviceUsageForPrev24(Guid deviceID)
    {
        var powerUsages = _powerUsageService.GetPowerUsageForDevicePast24Hours(deviceID, - 1);
        return Ok(powerUsages);
    }

    [HttpGet("power-usage/Next24h/device-usage_per_hour/{deviceID}")]
    public ActionResult<PowerUsage> GetDeviceUsageForNext24(Guid deviceID)
    {
        var powerUsages = _powerUsageService.GetPowerUsageForDevicePast24Hours(deviceID, 1);
        return Ok(powerUsages);
    }
    
    
    [HttpGet("power-usage/today/currentPowerUsage/{deviceID}")]
    public IActionResult GetDeviceDataHourToday(Guid deviceID)
    {
        var powerUsages = _powerUsageService.GetForDeviceByHour(deviceID);
        return Ok(powerUsages);
    }    

    [HttpGet("power-usage/current-consumption/system")]
    [Authorize(Roles = "Dispatcher,Admin")]
    public ActionResult<double> GetForSystemConsumer()
    {        
            var powerUsages = _powerUsageService.CurrentSumPowerUsageSystemConsumer();

            return Ok(powerUsages);
    }

    [HttpGet("power-usage/current-production/system")]
    [Authorize(Roles = "Dispatcher,Admin")]
    public ActionResult<double> CurrentSumPowerUsageSystemProducer()
    {
            var powerUsages = _powerUsageService.CurrentSumPowerUsageSystemProducer();

            return Ok(powerUsages);
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

    [HttpGet("power-usage/currentUsageUser/average-consumption/{userID}")]
    public ActionResult<double> GetForUserConsumption(Guid userID)
    {
            var powerUsages = _powerUsageService.AverageSumPowerUsageConsumtion(userID);

            return Ok(powerUsages);
    }

     [HttpGet("power-usage/currentUsageUser/consumption-summary/{userID}")]
     public ActionResult<double> GetForUserCurrentConsumption(Guid userID)
     {
         try
         {
             var powerUsages = _powerUsageService.CurrentSumPowerUsageConsumption(userID);

             return Ok(powerUsages);
         }
         catch (ArgumentNullException ex)
         {
             throw new ArgumentException(ex.Message);
         }
     }

    [HttpGet("power-usage/currentUsageUser/production-summary/{userID}")]
    public ActionResult<double> GetForUserCurrentProduction(Guid userID)
    {
        try
        {
            var powerUsages = _powerUsageService.CurrentSumPowerUsageProduction(userID);

            return Ok(powerUsages);
        }
        catch (ArgumentNullException ex)
        {
            throw new ArgumentException(ex.Message);
        }
    }

    [HttpGet("power-usage/previousMonth/production/system")]
    [Authorize(Roles = "Dispatcher,Admin")]
    public ActionResult<double> GetSystemPowerUsageForPreviousMonth()
    {
        var powerUsages = _powerUsageService.GetPoweUsageForAMonthSystemProducer(-1);
        return Ok(powerUsages);
    }

    [HttpGet("power-usage/nextMonth/production/system")]
    [Authorize(Roles = "Dispatcher,Admin")]
    public ActionResult<double> GetSystemPowerUsageForNextMonth()
    {
        var powerUsages = _powerUsageService.GetPoweUsageForAMonthSystemProducer(1);
        return Ok(powerUsages);
    }

    [HttpGet("power-usage/previousMonth/consumption/system")]
    [Authorize(Roles = "Dispatcher,Admin")]
    public ActionResult<double> GetSystemPowerConsumptionForPreviousMonth()
    {
        var powerUsages = _powerUsageService.GetPoweUsageForAMonthSystemConsumer(-1);
        return Ok(powerUsages);
    }

    [HttpGet("power-usage/nextMonth/consumption/system")]
    [Authorize(Roles = "Dispatcher,Admin")]
    public ActionResult<double> GetSystemPowerConsumptionForNextMonth()
    {
        var powerUsages = _powerUsageService.GetPoweUsageForAMonthSystemConsumer(1);
        return Ok(powerUsages);
    }

    [HttpGet("power-usage/previousMonth/consumption/each-device")]
    public ActionResult<List<PowerUsage>> GetPowerUsagesOfEachDevicePreviousMonthConsumption()
    {
        var powerUsages = _powerUsageService.GetPowerUsageSumByDeviceConsumer(-1);
        return Ok(powerUsages);
    }

    [HttpGet("power-usage/nextMonth/consumption/each-device")]
    public ActionResult<List<PowerUsage>> GetPowerUsagesOfEachDeviceNextMonthConsumption()
    {
        var powerUsages = _powerUsageService.GetPowerUsageSumByDeviceConsumer(1);
        return Ok(powerUsages);
    }

    [HttpGet("power-usage/previousMonth/production/each-device")]
    public ActionResult<List<PowerUsage>> GetPowerUsagesOfEachDevicePreviousMonthProduction()
    {
        var powerUsages = _powerUsageService.GetPowerUsageSumByDeviceProducer(-1);
        return Ok(powerUsages);
    }    

    [HttpGet("power-usage/nextMonth/production/each-device")]
    public ActionResult<List<PowerUsage>> GetPowerUsagesOfEachDeviceNextMonthProduction()
    {
        var powerUsages = _powerUsageService.GetPowerUsageSumByDeviceProducer(1);
        return Ok(powerUsages);
    }

    [HttpGet("power-usage/previousMonth/consumption/every-day-usage/system")]
    public ActionResult<PowerUsage> GetPowerUsagesOfEachDayPrevMonthConsumption()
    {
        var powerUsages = _powerUsageService.GetPowerUsagesForEachDayConsumtionMonth(-1);
        return Ok(powerUsages);
    }

    [HttpGet("power-usage/nextMonth/consumption/every-day-usage/system")]
    public ActionResult<PowerUsage> GetPowerUsagesOfEachDayNextMontConsumption()
    {
        var powerUsages = _powerUsageService.GetPowerUsagesForEachDayConsumtionMonth(1);
        return Ok(powerUsages);
    }

    [HttpGet("power-usage/previousMonth/production/every-day-usage/system")]
    public ActionResult<PowerUsage> GetPowerUsagesOfEachDayPrevMonthProduction()
    {
        var powerUsages = _powerUsageService.GetPowerUsagesForEachDayProductionMonth(-1);
        return Ok(powerUsages);
    }

    [HttpGet("power-usage/nextMonth/production/every-day-usage/system")]
    public ActionResult<PowerUsage> GetPowerUsagesOfEachDayNextMontProduction()
    {
        var powerUsages = _powerUsageService.GetPowerUsagesForEachDayProductionMonth(1);
        return Ok(powerUsages);
    }

    [HttpGet("power-usage/nextWeek/consumption/every-day-usage/system")]
    public ActionResult<PowerUsage> GetPowerUsagesOfEachDayWeekConsumption()
    {
        var powerUsages = _powerUsageService.GetPowerUsagesForEachDayConsumptionWeek(1);
        return Ok(powerUsages);
    }

    [HttpGet("power-usage/previousWeek/consumption/every-day-usage/system")]
    public ActionResult<PowerUsage> GetPowerUsagesOfEachDaypreviousWeekConsumptionMonth()
    {
        var powerUsages = _powerUsageService.GetPowerUsagesForEachDayConsumptionWeek(-1);
        return Ok(powerUsages);
    }

    [HttpGet("power-usage/previousWeek/production/every-day-usage/system")]
    public ActionResult<PowerUsage> GetPowerUsagesOfEachDapreviousWeekConsumption()
    {
        var powerUsages = _powerUsageService.GetPowerUsagesForEachDayProductionWeek(-1);
        return Ok(powerUsages);
    }

    [HttpGet("power-usage/nextWeek/production/every-day-usage/system")]
    public ActionResult<PowerUsage> GetPowerUsagesOfEachDayNextWeekConsumption()
    {
        var powerUsages = _powerUsageService.GetPowerUsagesForEachDayProductionWeek(1);
        return Ok(powerUsages);
    }

    [HttpGet("power-usage/next24h/consumption/every-hour-usage/system")]
    public ActionResult<PowerUsage> GetPowerUsagesOf24h()
    {
        var powerUsages = _powerUsageService.GetPowerUsagesForEachDayConsumption24h(1);
        return Ok(powerUsages);
    }

    [HttpGet("power-usage/previous24h/consumption/every-hour-usage/system")]
    public ActionResult<PowerUsage> GetPowerUsagesOfEachDayprevious24h()
    {
        var powerUsages = _powerUsageService.GetPowerUsagesForEachDayConsumption24h(-1);
        return Ok(powerUsages);
    }

    [HttpGet("power-usage/previous24h/production/every-hour-usage/system")]
    public ActionResult<PowerUsage> GetPowerUsagesOfEachDaprevious24h()
    {
        var powerUsages = _powerUsageService.GetPowerUsagesForEachDayProduction24h(-1);
        return Ok(powerUsages);
    }

    [HttpGet("power-usage/next24h/production/every-hour-usage/system")]
    public ActionResult<PowerUsage> GetPowerUsagesOfEachDay24h()
    {
        var powerUsages = _powerUsageService.GetPowerUsagesForEachDayProduction24h(1);
        return Ok(powerUsages);
    }

    [HttpGet("power-usage/previousMonth/consumption/user-every-day-device-usage/{userID}")]
    public ActionResult<List<PowerUsage>> GetPowerUsageEachDayOfEachDevicePrevMonthConsumption(Guid userID)
    {
        var powerUsages = _powerUsageService.GetPowerUsageForDevicesConsumption(userID, -1);
        return Ok(powerUsages);
    }

    [HttpGet("power-usage/nextMonth/consumption/user-every-day-device-usage/{userID}")]
    public ActionResult<List<PowerUsage>> GetPowerUsageEachDayOfEachDeviceNextMonthConsumption(Guid userID)
    {
        var powerUsages = _powerUsageService.GetPowerUsageForDevicesConsumption(userID, 1);
        return Ok(powerUsages);
    }

    [HttpGet("power-usage/previousMonth/production/user-every-day-device-usage/{userID}")]
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

    [HttpGet("power-usage/previous7Days/consumption/user-every-day-device-usage/{userID}")]
    public ActionResult<List<PowerUsage>> GetPowerUsageForDevicesConsumptionForPrevious7Days(Guid userID)
    {
        var powerUsages = _powerUsageService.GetPowerUsageForDevicesConsumptionFor7Days(userID, -1);
        return Ok(powerUsages);
    }

    [HttpGet("power-usage/next7Days/consumption/user-every-day-device-usage/{userID}")]
    public ActionResult<List<PowerUsage>> GetPowerUsageForDevicesConsumptionForNext7Days(Guid userID)
    {
        var powerUsages = _powerUsageService.GetPowerUsageForDevicesConsumptionFor7Days(userID, 1);
        return Ok(powerUsages);
    }

    [HttpGet("power-usage/previous7Days/production/user-every-day-device-usage/{userID}")]
    public ActionResult<List<PowerUsage>> GetPowerUsageForDevicesProductionForPrevious7Days(Guid userID)
    {
        var powerUsages = _powerUsageService.GetPowerUsageForDevicesProductionFor7Days(userID, -1);
        return Ok(powerUsages);
    }

    [HttpGet("power-usage/next7Days/production/user-every-day-device-usage/{userID}")]
    public ActionResult<List<PowerUsage>> GetPowerUsageForDevicesProductionForNext7Days(Guid userID)
    {
        var powerUsages = _powerUsageService.GetPowerUsageForDevicesProductionFor7Days(userID, 1);
        return Ok(powerUsages);
    }

    [HttpGet("power-usage/previous24Hours/consumption/user-every-day-device-usage/{userID}")]
    public ActionResult<List<PowerUsage>> GetPowerUsageForDevicesConsumptionForPrevious24Hours(Guid userID)
    {
        var powerUsages = _powerUsageService.GetPowerUsageForDevicesConsumptionFor24Hours(userID, -1);
        return Ok(powerUsages);
    }

    [HttpGet("power-usage/next24Hours/consumption/user-every-day-device-usage/{userID}")]
    public ActionResult<List<PowerUsage>> GetPowerUsageForDevicesConsumptionForNext24Hours(Guid userID)
    {
        var powerUsages = _powerUsageService.GetPowerUsageForDevicesConsumptionFor24Hours(userID, 1);
        return Ok(powerUsages);
    }

    [HttpGet("power-usage/previous24Hours/production/user-every-day-device-usage/{userID}")]
    public ActionResult<List<PowerUsage>> GetPowerUsageForDevicesProductionForPrevious24Hours(Guid userID)
    {
        var powerUsages = _powerUsageService.GetPowerUsageForDevicesProductionFor24Hours(userID, -1);
        return Ok(powerUsages);
    }

    [HttpGet("power-usage/next24Hours/production/user-every-day-device-usage/{userID}")]
    public ActionResult<List<PowerUsage>> GetPowerUsageForDevicesProductionForNext24Hours(Guid userID)
    {
        var powerUsages = _powerUsageService.GetPowerUsageForDevicesProductionFor24Hours(userID, 1);
        return Ok(powerUsages);
    }

    [HttpGet("power-usage/currentDay/consumption/system")]
    public ActionResult<PowerUsage> GetPowerUsageForAHourSystemConsumed()
    {
        var powerUsages = _powerUsage.GetPowerConsumedForADaySystem();
        return Ok(powerUsages);
    }

    [HttpGet("power-usage/currentDay/production/system")]
    public ActionResult<PowerUsage> GetPowerUsageForAHourSystemProduced()
    {
        var powerUsages = _powerUsage.GetPowerProducedForADaySystem();
        return Ok(powerUsages);
    }

    [HttpGet("power-usage/12hours/{deviceID}")]
    public ActionResult<PowerUsage> GetPowerUsage12(Guid deviceID)
    {
        var powerUsages = _powerUsageService.GetPowerUsageFor12HoursUpDown(deviceID);
        return Ok(powerUsages);
    }

    // ------------------------------------------------------------------------------------

    [HttpGet("power-usage/most-consumes/last-24hours/{userID}")]
    public ActionResult<Dictionary<DateTime, double>> GetMostConsumerPast24hoursConsumption(Guid userID)
    {
        var powerUsages = _powerUsageService.GetMaxUsagePast24HoursConsumption(userID);
        return Ok(powerUsages);
    }

    [HttpGet("power-usage/most-produces/last-24hours/{userID}")]
    public ActionResult<Dictionary<DateTime, double>> GetMostConsumerPast24hoursPriduction(Guid userID)
    {
        var powerUsages = _powerUsageService.GetMaxUsagePast24HoursProduction(userID);
        return Ok(powerUsages);
    }

    [HttpGet("power-usage/most-consumes/last-week/{userID}")]
    public ActionResult<Dictionary<DateTime, double>> GetMostConsumerLastWeekConsumption(Guid userID)
    {
        var powerUsages = _powerUsageService.GetMaxUsagePreviousWeekConsumption(userID);
        return Ok(powerUsages);
    }

    [HttpGet("power-usage/most-produces/last-week/{userID}")]
    public ActionResult<Dictionary<DateTime, double>> GetMostConsumerLastWeekProduction(Guid userID)
    {
        var powerUsages = _powerUsageService.GetMaxUsagePreviousWeekProductoin(userID);
        return Ok(powerUsages);
    }

    [HttpGet("power-usage/most-consumes/last-month/{userID}")]
    public ActionResult<PowerUsage> GetMostConsumerLastMonthConsumption(Guid userID)
    {
        var powerUsages = _powerUsageService.GetMaxUsagePreviousMonthConsumption(userID, -1);
        return Ok(powerUsages);
    }

    [HttpGet("power-usage/most-produces/last-month/{userID}")]
    public ActionResult<PowerUsage> GetMostConsumerLastMonthPRoduction(Guid userID)
    {
        var powerUsages = _powerUsageService.GetMaxUsagePreviousMonthProduction(userID, -1);
        return Ok(powerUsages);
    }

    [HttpGet("power-usage/most-consumes/current/{userID}")]
    public ActionResult<PowerUsage> GetMostConsumerCurrentConsumption(Guid userID)
    {
        var powerUsages = _powerUsageService.GetMaxUsagePreviousCurrentConsumption(userID);
        return Ok(powerUsages);
    }

    [HttpGet("power-usage/most-produces/current/{userID}")]
    public ActionResult<PowerUsage> GetMostConsumerCurrentProduction(Guid userID)
    {
        var powerUsages = _powerUsageService.GetMaxUsagePreviousCurrentProduction(userID);
        return Ok(powerUsages);
    }

    [HttpGet("power-usage/current/user-unused-consumption/{userId}")]
    public ActionResult<double> GetHowMuchUserIsConsuming(Guid userId)
    {
        var powerUsages = _powerUsageService.GetHowMuchUserIsConsuming(userId);
        return Ok(powerUsages);
    }

    [HttpGet("power-usage/saved-energy/previous-hour/{deviceID}")]
    public ActionResult<PowerUsage> deviceEnergySavedP(Guid deviceID)
    {
        var powerUsages = _powerUsageService.deviceEnergySaved(deviceID);
        return Ok(powerUsages);
    }

    [HttpGet("power-usage/saved-energy/producer/system/")]
    public ActionResult<double> SavedEnergySystemProducer()
    {
        var powerUsage = _powerUsageService.SavedEnergySystemProducer();
        return Ok(powerUsage);
    }

    [HttpGet("power-usage/saved-energy/consumer/system/")]
    public ActionResult<double> SavedEnergySystemConsumer()
    {
        var powerUsage = _powerUsageService.SavedEnergySystemConsumer();
        return Ok(powerUsage);
    }

    [HttpGet("power-usage/device-system-usage-percent/{deviceID}")]
    public ActionResult<double> DeviceSystemUsagePercent(Guid deviceID)
    {
        var powerUsage = _powerUsageService.DeviceSystemPowerUsage(deviceID);
        return Ok(powerUsage);
    }
    
    [HttpGet("power-usage/user-usage-saved-energy-month/production/{userID}")]
    public ActionResult<double> savedEnergyForUserProducer(Guid userID)
    {
        var powerUsage = _powerUsageService.savedEnergyForUserProducer(userID);
        return Ok(powerUsage);
    }

    [HttpGet("power-usage/user-usage-saved-energy-month/consumer/{userID}")]
    public ActionResult<double> savedEnergyForUserConsumer(Guid userID)
    {
        var powerUsage = _powerUsageService.savedEnergyForUserConsumer(userID);
        return Ok(powerUsage);
    }

    [HttpGet("power-usage/percentage-difference-for-previous-week/consumption/{userId}")]
    public ActionResult<double> percentPowerUsageDifferenceForPreviousWeekConsumption(Guid userId)
    {
        var powerUsage = _powerUsageService.percentPowerUsageDifferenceForPreviousWeekConsumption(userId);
        return Ok(powerUsage);
    }

    [HttpGet("power-usage/percentage-difference-for-previous-week/production/{userId}")]
    public ActionResult<double> percentPowerUsageDifferenceForPreviousWeekProduction(Guid userId)
    {
        var powerUsage = _powerUsageService.percentPowerUsageDifferenceForPreviousWeekProduction(userId);
        return Ok(powerUsage);
    }

    [HttpGet("power-usage/electricityBill/LastMonth/{userID}")]
    public ActionResult<double> electricityBill1(Guid userID, double electricityRate)
    {
        var powerUsage = _powerUsageService.electricityBillLastMonth(userID, electricityRate);
        return Ok(powerUsage);
    }

    [HttpGet("power-usage/electricityBill/LastTwoMonth/{userID}")]
    public ActionResult<double> electricityBill2(Guid userID, double electricityRate)
    {
        var powerUsage = _powerUsageService.electricityBill2MonthsAgo(userID, electricityRate);
        return Ok(powerUsage);
    }

    [HttpGet("power-usage/electricityEarnings/LastMonth/{userID}")]
    public ActionResult<double> electricityEarnings1(Guid userID, double electricityRate)
    {
        var powerUsage = _powerUsageService.electricityEarningsLastMonth(userID, electricityRate);
        return Ok(powerUsage);
    }

    [HttpGet("power-usage/electricityEarnings/LastTwoMonth/{userID}")]
    public ActionResult<double> electricityEarnings2(Guid userID, double electricityRate)
    {
        var powerUsage = _powerUsageService.electricityEarnings2MonthsAgo(userID, electricityRate);
        return Ok(powerUsage);
    }
}
