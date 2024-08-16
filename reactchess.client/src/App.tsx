import { useState } from "react";
import Game from "./components/Game";
import { Action } from "./types/actionType.ts";

function App() {
    const [gameMode, setGameMode] = useState<string>("");

    const [action, setAction] = useState<Action>(
        { type: "EMPTY_ACTION",
            payload: {
                reason: "initial state"
    }});

    const PlayHotseat = () => {
        // do nothing when there is game going on
        setGameMode("hotseat");
        setAction({ type: "SET_BOARD_FROM_FEN",
            payload: {
                FEN: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
                message: "Game start: HF GL"
            } });
    };

    return (
        <>
            <h1>Chess with a friend</h1>
            {/* player color */}

            {/*<button*/}
            {/*    onClick={() => {*/}
            {/*        ConnectAsPlayer();*/}
            {/*    }}*/}
            {/*>*/}
            {/*    Connect as player*/}
            {/*</button>*/}

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

            {gameMode &&
                <Game
                gameMode={gameMode}
                receivedAction={action}
            />}
        </>
    );
}

export default App;
