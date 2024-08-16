namespace ReactChess.Server.Model;

public class GameState
{
    public enum Color
    {
        white,
        black
    }

    private string _Fen { get; }

    private string[][] BoardState { get; set; }
    private Color ActivePlayer { get; set; }
    private string CastleRights { get; set; }
    private string EnPassant { get; set; }
    private int HalfmoveClock { get; set; }
    private int FullmoveNumber { get; set; }
    

    public GameState(string Fen)
    {
        this._Fen = Fen;
        
        // parse the FEN here
    }

    // check the updated state against the FEN from frontend
    public string Equals(string other)
    {
        string FEN;

        return _Fen;
    }

    // check if a FEN is valid

}