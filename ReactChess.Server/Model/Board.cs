namespace ReactChess.Server.Model;

public class Board
{
    public Guid Id { get; set; }
    public int MoveNumber { get; set; }
    public string FEN { get; set; }
    public DateTime TimeStamp { get; set; }
    
    
}