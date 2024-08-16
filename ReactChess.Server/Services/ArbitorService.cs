namespace ReactChess.Server.Services;

public class ArbiterService()
{
    private string fen;

    public async Task validate(string FEN, string Action)
    {
        fen = FEN;
    }
}