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

    [HttpGet("power-usage")]
    public IActionResult GetAll()
    {
        var powerUsages = _powerUsage.Get(new ExpressionFilterDefinition<PowerUsage>(null));
        return Ok(powerUsages);
    }
}