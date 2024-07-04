using System.Collections.Concurrent;

namespace ReactChess.Server.Services;

public class MatchMakingService
{
    private readonly ConcurrentQueue<Guid> _waitingGameIds = new();
    private readonly ConcurrentDictionary<Guid, bool> _invalidGameList = new();

    public void Enqueue(Guid id) => _waitingGameIds.Enqueue(id);

    public void Invalidate(Guid id) => _invalidGameList.TryAdd(id, false);

    public List<Guid> GetWaitingGameIds() => _waitingGameIds.ToList();

    public Guid? GetNextWaitingRoomId()
    {
        Guid gameId;
        while (_waitingGameIds.TryDequeue(out gameId))
        {
            if (!_invalidGameList.ContainsKey(gameId))
            {
                return gameId;
            }
        }

        return null;
    }
}

