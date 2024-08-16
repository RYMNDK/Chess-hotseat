using ReactChess.Server.Services;

namespace TestChessServer;

public class MatchMakingServiceTests
{
    private readonly MatchMakingService _service;

    public MatchMakingServiceTests()
    {
        _service = new MatchMakingService();
    }

    [Fact]
    public void Enqueue_ShouldAddGameIdToWaitingQueue()
    {
        // Arrange
        var gameId = Guid.NewGuid();

        // Act
        _service.Enqueue(gameId);
        var waitingGameIds = _service.GetWaitingGameIds();

        // Assert
        Assert.Contains(gameId, waitingGameIds);
    }

    [Fact]
    public void Invalidate_ShouldAddGameIdToInvalidList()
    {
        // Arrange
        var gameId = Guid.NewGuid();

        // Act
        _service.Invalidate(gameId);
        var waitingGameIds = _service.GetWaitingGameIds();
        var nextGameId = _service.GetNextWaitingRoomId();

        // Assert
        Assert.Null(nextGameId);
    }

    [Fact]
    public void GetWaitingGameIds_ShouldReturnAllEnqueuedIds()
    {
        // Arrange
        var gameId1 = Guid.NewGuid();
        var gameId2 = Guid.NewGuid();
        _service.Enqueue(gameId1);
        _service.Enqueue(gameId2);

        // Act
        var waitingGameIds = _service.GetWaitingGameIds();

        // Assert
        Assert.Contains(gameId1, waitingGameIds);
        Assert.Contains(gameId2, waitingGameIds);
    }

    [Fact]
    public void GetNextWaitingRoomId_ShouldReturnNextValidGameId()
    {
        // Arrange
        var validGameId = Guid.NewGuid();
        var invalidGameId = Guid.NewGuid();
        _service.Enqueue(validGameId);
        _service.Enqueue(invalidGameId);
        _service.Invalidate(invalidGameId);

        // Act
        var nextGameId = _service.GetNextWaitingRoomId();

        // Assert
        Assert.Equal(validGameId, nextGameId);
    }

    [Fact]
    public void GetNextWaitingRoomId_ShouldReturnNullIfNoValidGameId()
    {
        // Arrange
        var invalidGameId = Guid.NewGuid();
        _service.Enqueue(invalidGameId);
        _service.Invalidate(invalidGameId);

        // Act
        var nextGameId = _service.GetNextWaitingRoomId();

        // Assert
        Assert.Null(nextGameId);
    }
}
