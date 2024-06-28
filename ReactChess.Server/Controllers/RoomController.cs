using Microsoft.AspNetCore.Mvc;
using ReactChess.Server.Services;

namespace ReactChess.Server.Controller
{
    [ApiController]
    [Route("api/[controller]")]
    public class RoomController(ILogger<RoomController> logger, MatchMakingService mms) : ControllerBase
    {

        // GET: api/room/<ChessController>
        [HttpGet("{id}")]
        public Guid Get(Guid id) => id;

        // POST api/room/NewGame
        [HttpPost("NewGame")]
        public Guid NewGame() => Guid.Empty;

        // get api/room/mms/waiting
        [HttpGet("mms/waiting")]
        public List<Guid> GetWaitingGames() => mms.GetWaitingGameIds();
        

    }
}
