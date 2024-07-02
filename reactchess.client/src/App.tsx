import { useEffect, useState } from "react";
import Game from "./components/Game";
import * as signalR from "@microsoft/signalr";
import { ChessGameState } from "./types/chessType.ts";
import { genFEN } from "./services/FENService.ts";

function App() {
    const [FEN, setFEN] = useState<string>("8/8/8/8/8/8/8/8 w KQkq - 0 1");

    const [connection, setConnection] = useState<signalR.HubConnection | null>(
        null
    );

    const [gameMode, setGameMode] = useState<string>("");

    const [userName, setUserName] = useState<string>("Anonymous");
    const [connectionId, setConnectionId] = useState<string>("");
    const [color, setColor] = useState<string>("unknown");
    const [boardId, setBoardId] = useState<string>("");

    const ConnectAsPlayer = () => {
        setGameMode("twoplay");
        // const playerName = prompt("Please enter your username:");
        const playerName = "Raymond";
        setUserName(
            playerName && playerName.length > 0 ? playerName : "Anonymous"
        );
        const newConnection = new signalR.HubConnectionBuilder()
            .withUrl(`https://localhost:7164/gamehub?gameId=${playerName}`)
            .withAutomaticReconnect()
            .build();
        setConnection(newConnection);
    };

    const PlayHotseat = () => {
        setGameMode("hotseat");
        setFEN("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
    };

    useEffect(() => {
        // should use type, DTO and SendCore on serverside
        if (connection) {
            connection
                .start()
                .then(() => {
                    connection.on("ClientConnectionId", (connectionId) => {
                        console.log(`Your connectionId is ${connectionId}`);
                        setConnectionId(connectionId);
                    });

                    connection.on("RoomNotification", (message, data) => {
                        const playerColor =
                            data.blackConnectionId === connectionId
                                ? "black"
                                : "white";
                        setColor(playerColor);
                        setBoardId(data.boardId);
                    });

                    connection.on("UpdateBoard", (FEN) => {
                        setFEN(FEN);
                    });

                    connection.on("MessageFromRest", (message) => {
                        // should use type, DTO and SendCore on serverside
                        console.log("System message:", message);
                    });
                })
                .catch((e) => console.log("Connection failed: ", e));

            return () => {
                connection.stop().then(() => console.log("Connection stopped"));
            };
        }
    }, [connection]);

    const updateToHub = (gameState: ChessGameState) => {
        // add the action
        if (connection) {
            // send new fen to backend
            connection
                .invoke("UpdateBoardFEN", genFEN(gameState))
                .then((result: string) => {
                    setFEN(result);
                });
        } else {
            console.log("Error with hub connection");
        }
    };

    return (
        <>
            <h1>Chess with a friend</h1>
            <h1>Welcome {userName}</h1>
            {/* player color */}

            <button
                onClick={() => {
                    ConnectAsPlayer();
                }}
            >
                Connect as player
            </button>

            {/* <button
                onClick={() => {
                    ConnectAsSpectator();
                }}
            >
                Spectate
            </button> */}
            <button
                onClick={() => {
                    PlayHotseat();
                }}
            >
                New hot seat game
            </button>

            <Game
                BoardFEN={FEN}
                sendBoardToBackend={updateToHub}
                GameMode={gameMode}
            />
        </>
    );
}

export default App;
