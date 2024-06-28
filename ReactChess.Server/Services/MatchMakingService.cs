using System.Collections.Concurrent;

namespace ReactChess.Server.Services
{
    public class MatchMakingService
    {
        private readonly ConcurrentQueue<Guid> _waitingGameIds;

        public MatchMakingService()
        {
            _waitingGameIds = new ConcurrentQueue<Guid>();
        }

        public void Enqueue(Guid Id) => _waitingGameIds.Enqueue(Id);
        public bool TryDequeue(out Guid Id) => _waitingGameIds.TryDequeue(out Id);
        public bool IsQueueEmpty() => _waitingGameIds.IsEmpty;
        public List<Guid> GetWaitingGameIds() => _waitingGameIds.ToList();
    }
}
