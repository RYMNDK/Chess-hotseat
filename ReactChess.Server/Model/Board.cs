namespace ReactChess.Server.Model;

public class Board
{
    public Guid Id { get; set; }
    public DateTime MoveNumber { get; set; }
    public string FEN { get; set; }
}