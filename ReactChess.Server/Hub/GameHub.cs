using Microsoft.AspNetCore.SignalR;
using ReactChess.Server.Model;
using ReactChess.Server.Services;
using System.Collections.Concurrent;

namespace ReactChess.Server.Hubs
{
    public class GameHub(ILogger<GameHub> _logger, GameManagerService _gameManager) : Hub
    {
        private static readonly ConcurrentDictionary<string, string> _ConnectionGroupMap = new ConcurrentDictionary<string, string>();

        public override async Task OnConnectedAsync()
        {
            var userName = Context.GetHttpContext()?.Request.Query["username"].ToString().Trim();
            if (string.IsNullOrWhiteSpace(userName))
            {
                userName = "Anonymous";
            }

            _logger.LogInformation("User {username} connected with ID: {connectionId}", userName, Context.ConnectionId);


            // Assign user to a room
            Room room = await _gameManager.GetAvailableRoom(userName, Context.ConnectionId);
            await Groups.AddToGroupAsync(Context.ConnectionId, room.Id.ToString());
            _ConnectionGroupMap.TryAdd(Context.ConnectionId, room.Id.ToString());

            if (room.Status == Room.GameStatus.Waiting) 
            { 
                await Clients.Caller.SendAsync("RoomNotification", "You are connected, waiting for an opponent.", room);
            } else if (room.Status == Room.GameStatus.InProgress)
            {
                await Clients.OthersInGroup(room.Id.ToString()).SendAsync("RoomNotification", room);
            }

            await base.OnConnectedAsync();
        }

        //public async Task JoinGroup(string groupName)
        //{
        //    await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
        //    await Clients.Group(groupName).SendAsync("RoomNotification", $"{Context.ConnectionId} has joined the group {groupName}.");
        //}
        //public async Task LeaveGroup(string groupName)
        //{
        //    await Groups.RemoveFromGroupAsync(Context.ConnectionId, groupName);
        //    await Clients.Group(groupName).SendAsync("RoomNotification", $"{Context.ConnectionId} has left the group {groupName}.");
        //}
        //public async Task SendMessageToGroup(string groupName, string message)
        //{
        //    await Clients.Group(groupName).SendAsync("RoomNotification", Context.ConnectionId, message);
        //}



        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            _ConnectionGroupMap.TryRemove(Context.ConnectionId, out string? groupName);
            // remove it from matchmaking queue
            _logger.LogInformation($"Connection Id: {Context.ConnectionId} disconnected");
            await Clients.OthersInGroup(groupName!).SendAsync("RoomNotification", "Your opponent disconnected");
            await base.OnDisconnectedAsync(exception);
        }

        //public async Task SendMessage(ChatMessage message)
        //{
        //    _logger.LogInformation(message.UserName + ", " + message.Message);
        //    await Clients.All.SendAsync("RoomNotification", message);
        //}

    }
    //public class ChatMessage
    //{
    //    public string UserName { get; set; }
    //    public string Message { get; set; }
    //}
}