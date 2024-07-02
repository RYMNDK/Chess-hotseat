using ReactChess.Server.Model;
using ReactChess.Server.Domain;
using Microsoft.EntityFrameworkCore;


namespace ReactChess.Server.Services;

public class GameManagerService(ILogger<GameManagerService> logger, DataContext context, MatchMakingService matchMaker)
{
    private async Task<Room> CreateNewRoom(string playerName, string playerConnectionId, Guid roomId)
    {
        bool isWhite = new Random().Next(2) == 0;

        Room room = new()
        {
            Id = roomId,
            BoardId = Guid.NewGuid(),
            WhiteName = isWhite ? playerName : "",
            WhiteConnectionId = isWhite ? playerConnectionId : "",
            BlackName = !isWhite ? playerName : "",
            BlackConnectionId = !isWhite ? playerConnectionId : "",
            Status = Room.GameStatus.Waiting
        };

        await context.Rooms.AddAsync(room);
        await context.SaveChangesAsync();
        matchMaker.Enqueue(room.Id);

        return room;
    }

    private async Task<Room> JoinExistingRoom(string playerName, string playerConnectionId, Guid roomId)
    {
        Room room = await context.Rooms.FirstOrDefaultAsync(x => x.Id == roomId) 
            ?? await CreateNewRoom(playerName, playerConnectionId, roomId);

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
     */
    public async Task<Room> GetAvailableRoom(string playerName, string playerConnectionId)
    {
        Guid? roomId = matchMaker.GetNextWaitingRoomId();
        
        if (roomId == null)
        {
             return await CreateNewRoom(playerName, playerConnectionId, new Guid());
        }

        return await JoinExistingRoom(playerName, playerConnectionId, roomId.Value);
    }

    // player disconnect before a match is found
    public async Task DropGame(Guid roomId)
    {
        matchMaker.Invalidate(roomId);
        Room? room = await context.Rooms.FirstOrDefaultAsync(x => x.Id == roomId);
        if (room != null)
        {
            room.Status = Room.GameStatus.Finished;
        }
        await context.SaveChangesAsync();
    }

    public async Task<Board> CreateBoard(Guid boardId)
    {
        Board newGameBoard = new()
        {
            Id = boardId,
            FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
            MoveNumber = DateTime.Now
        };

        return newGameBoard;
    }

}

