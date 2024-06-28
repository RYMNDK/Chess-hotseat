namespace ReactChess.Server.Model
{
    public class Room
    {
        public Guid Id { get; set; }
        public Guid BoardId {get; set;}
        public String WhiteConnectionId { get; set; } = string.Empty;
        public String WhiteName { get; set; } = string.Empty;
        public String BlackConnectionId { get; set; } = string.Empty;
        public String BlackName { get; set; } = string.Empty;

        public enum GameStatus { Waiting, InProgress, Finished}
        public GameStatus Status { get; set; } 
    }
}
