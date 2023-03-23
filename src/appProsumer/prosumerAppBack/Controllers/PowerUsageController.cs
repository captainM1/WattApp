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
}