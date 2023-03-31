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
}