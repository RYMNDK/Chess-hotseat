using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using ReactChess.Server.Hubs;
using ReactChess.Server.Services;

namespace ReactChess.Server.Controllers;

// http endpoint is for debugging with swagger
// use base controller 

public class RoomBaseController (
    ILogger<RoomBaseController> logger,
    IHubContext<GameHub> gameHub,
    MatchMakingService mms) : BaseController(logger)
{

    // GET: api/room/<ChessController>
    [HttpGet("{id:guid}")]
    public Guid Get(Guid id) => id;

    // POST api/room/NewGame
    [HttpPost("NewGame")]
    public Guid NewGame() => Guid.Empty;

    // Get api/room/mms/waiting, Do not consider invalid games
    [HttpGet("mms/waiting")]
    public List<Guid> GetWaitingGames() => mms.GetWaitingGameIds();

    [HttpPost("/message")]
    public Task MessageAll(String message) => gameHub.Clients.All.SendAsync("MessageFromRest", message);
}