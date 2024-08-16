namespace ReactChess.Server.Controllers;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class BaseController(ILogger logger): ControllerBase
{
    
}