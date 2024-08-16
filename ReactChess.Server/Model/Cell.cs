namespace ReactChess.Server.Model;

public class Cell(int col, int row, string piece)
{
    public static readonly string letters = "abcdefgh";
    public static readonly Dictionary<string, string> renderMap = new Dictionary<string, string> { 
        { "R", "♖" },
        { "R", "♘" },
        { "B", "♗" },
        { "Q", "♕" },
        { "K", "♔" },
        { "P", "♙" },
        { "r", "♜" },
        { "n", "♞" },
        { "b", "♝" },
        { "q", "♛" },
        { "k", "♚" },
        { "p", "♟" }
    };
    
    public override string ToString() => $"{(renderMap.ContainsKey(piece)?renderMap[piece]:"")}{letters[col]}{8 - row}";
    
}