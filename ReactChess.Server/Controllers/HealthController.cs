using Microsoft.AspNetCore.Mvc;

namespace ReactChess.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HealthController : ControllerBase
    {

        private readonly ILogger<HealthController> _logger;

        public HealthController(ILogger<HealthController> logger)
        {
            _logger = logger;
        }

        [HttpGet]
        public string GetBackendStatus()
        {
            return "If you can see this it means backend is alive";
        }
    }
}
