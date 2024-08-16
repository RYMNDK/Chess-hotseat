using System.Collections.Concurrent;

namespace ReactChess.Server.Services;

public class GameService
{
    private ConcurrentDictionary<string, string> ActiveGames = new();
}