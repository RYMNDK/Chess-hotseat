using ReactChess.Server.Model;
using ReactChess.Server.Domain;
using Microsoft.EntityFrameworkCore;


namespace ReactChess.Server.Services
{
    // concurrency considerations
    public class GameManagerService(ILogger<GameManagerService> logger, DataContext context, MatchMakingService matchMaker)
    {
        public async Task<Room> CreateNewRoom(string playerName, string playerConnectionId, Guid RoomId)
        {
            bool isWhite = (new Random().Next(2) == 0);

            Room room = new()
            {
                Id = RoomId,
                BoardId = Guid.NewGuid(),
                WhiteName = isWhite ? playerName : "",
                WhiteConnectionId = isWhite ? playerConnectionId : "",
                BlackName = !isWhite ? playerName : "",
                BlackConnectionId = !isWhite ? playerConnectionId : "",
                Status = Room.GameStatus.Waiting
            };

            await context.Rooms.AddAsync(room);
            context.SaveChanges();
            matchMaker.Enqueue(room.Id);

            return room;
        }

        public async Task<Room> JoinExistingRoom(string playerName, string playerConnectionId, Guid RoomId)
        {
            Room? room = await context.Rooms.FirstAsync(x => x.Id == RoomId);
            room ??= await CreateNewRoom(playerName, playerConnectionId, RoomId);

            if (room.WhiteConnectionId == "")
            {
                room.WhiteName = playerName;
                room.WhiteConnectionId = playerConnectionId;
            }
            else if (room.BlackConnectionId == "")
            {
                room.BlackName = playerName;
                room.BlackConnectionId = playerConnectionId;
            }
            room.Status = Room.GameStatus.InProgress;
            await context.SaveChangesAsync();

            return room;
        }

        /**
         * grab all waiting rooms and return the first one
         * or create a new one if none available
         * 
         * talk about concurrency
         */
        public async Task<Room> GetAvailableRoom(string playerName, string playerConnectionId)
        {
            Room gameRoom;

            if (matchMaker.IsQueueEmpty())
            {
                gameRoom = await CreateNewRoom(playerName, playerConnectionId, new Guid());
            }
            else
            {
                matchMaker.TryDequeue(out Guid RoomId);
                gameRoom = await JoinExistingRoom(playerName, playerConnectionId, RoomId);
            }
            return gameRoom;
        }

    }
}
