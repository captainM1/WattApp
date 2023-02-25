using API.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TasksController:ControllerBase
{
    private readonly TaskDbContext _taskDbContext;
    public TasksController(TaskDbContext taskDbContext)
    {
        _taskDbContext = taskDbContext;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllTasks()
    {
        return Ok(await _taskDbContext.Tasks.ToListAsync());
    }
}