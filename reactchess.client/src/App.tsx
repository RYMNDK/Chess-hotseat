import { useEffect, useState } from "react";
import Game from "./components/Game";
import * as signalR from "@microsoft/signalr";

function App() {
    const [FEN, setFEN] = useState<string>("8/8/8/8/8/8/8/8 w KQkq - 0 1");

    const [connection, setConnection] = useState<signalR.HubConnection | null>(
        null
    );

    const [userName, setUserName] = useState<string>("Anonymous");
    useEffect(() => {}, []);

    const ConnectAsPlayer = () => {
        // const playerName = prompt("Please enter your username:");
        const playerName = "Raymond";
        setUserName(
            playerName && playerName.length > 0 ? playerName : "Anonymous"
        );
        const newConnection = new signalR.HubConnectionBuilder()
            .withUrl("https://localhost:7164/gamehub")
            .withAutomaticReconnect()
            .build();
        setConnection(newConnection);
    };

    const PlayHotseat = () => {
        setFEN("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
    };

    useEffect(() => {
        if (connection) {
            connection
                .start()
                .then(() => {
                    connection.on("RoomNotification", (message, data) => {
                        console.log("Message:", message);
                        console.log("Data:", data);
                    });
                })
                .catch((e) => console.log("Connection failed: ", e));
        }
    }, [connection]);

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

            <Game BoardFEN={FEN} />
        </>
    );
}

export default App;
