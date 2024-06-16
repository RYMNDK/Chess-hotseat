using Microsoft.AspNetCore.Mvc;

namespace ReactChess.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ChessController : ControllerBase
    {
        [HttpGet]
        [Route("newgame")]
        public IActionResult GetNewGameFEN() => Ok("rnbqkbnr / pppppppp / 8 / 8 / 8 / 8 / PPPPPPPP / RNBQKBNR w KQkq - 0 1");

        [HttpGet]
        [Route("newboard")]
        public IActionResult GetEmptyBoardFEN() => Ok("8/8/8/8/8/8/8/8 w - - 0 1");

    }
}
