namespace ReactChess.Server.Model
{
    public class Board
    {
        public Guid Id { get; set; }
        public int TurnNumber { get; set; }
        public string FEN { get; set; }
        public string LastMove { get; set; }
    }
}
