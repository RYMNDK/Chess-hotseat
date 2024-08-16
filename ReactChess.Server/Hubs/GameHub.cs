using Microsoft.AspNetCore.SignalR;
using System.Collections.Concurrent;
using ReactChess.Server.Model;
using ReactChess.Server.Services;

namespace ReactChess.Server.Hubs;
public class GameHub(ILogger<GameHub> logger, GameManagerService gameManager) : Hub
{
    private static readonly ConcurrentDictionary<string, string?> ConnectionGroupMap = new();

    public override async Task OnConnectedAsync()
    {
        await Clients.Caller.SendAsync("ClientConnectionId", Context.ConnectionId);
        var userName = Context.GetHttpContext()?.Request.Query["username"].ToString().Trim();
        if (string.IsNullOrWhiteSpace(userName))
        {
            userName = "Anonymous";
        }

        logger.LogInformation("User {username} connected with ID: {connectionId}", userName, Context.ConnectionId);

        // Assign user to a room
        Room room = await gameManager.GetAvailableRoom(userName, Context.ConnectionId);
        await Groups.AddToGroupAsync(Context.ConnectionId, room.Id.ToString());
        ConnectionGroupMap.TryAdd(Context.ConnectionId, room.Id.ToString());

        switch (room.Status)
        {
            case Room.GameStatus.Waiting:
                await Clients.Caller.SendAsync("RoomNotification", "You get a new room, waiting for an opponent.", room);
                break;
            case Room.GameStatus.InProgress:
                await Clients.Caller.SendAsync("RoomNotification", "You joined a waiting room. Game will start soon", room);
                await Clients.OthersInGroup(room.Id.ToString()).SendAsync("RoomNotification", "Opponent found! Game will start soon.", room);

                // send them new board (as action)
                await Clients.Group(room.Id.ToString()).SendAsync("UpdateBoard",
                    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
                );
                break;
        }

        await base.OnConnectedAsync();
    }

    public async Task SendMessage(string message)
    {
        var connectionId = Context.ConnectionId;
        await Clients.All.SendAsync("ReceiveMessage", connectionId, message);
    }

    public async Task<string> UpdateBoardFEN(string message)
    {
        logger.LogInformation("message from frontend " + message);
        
        await Clients.OthersInGroup(ConnectionGroupMap[Context.ConnectionId]).SendAsync("UpdateBoard", message);
        
        return message;
    }
    
    // get action from the frontend, get the boardid based on connectionid, validate FEN and action
    // then return new FEN and action from the backend
    public async Task<string> OnReceivingAction(string message)
    {
        var cid = Context.ConnectionId;
        var bid = ConnectionGroupMap[cid];
        
        // send message to everyone
        await Clients.Group(bid).SendAsync("message", "Message from backend");
        await Clients.Caller.SendAsync("message", "Message from backend");
        
        return message;
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        logger.LogInformation("Connection Id: {ConnectionId} disconnected", Context.ConnectionId);
        ConnectionGroupMap.TryRemove(Context.ConnectionId, out string? groupName);
        if (groupName != null)
        {
            await gameManager.DropGame(Guid.Parse(groupName));
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, groupName);
            await Clients.OthersInGroup(groupName).SendAsync("RoomNotification", "Your opponent disconnected", null);

        }

        await base.OnDisconnectedAsync(exception);
    }

}
