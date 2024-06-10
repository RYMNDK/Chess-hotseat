import { useReducer, useState } from "react";

import Board from "./Board";
import "./Game.css";

// comment those two for fresh board FEN
const initialBoard: ChessBoard = [
    ["r", "n", "b", "q", "k", "b", "n", "r"],
    ["p", "p", "p", "p", "p", "p", "p", "p"],
    [" ", " ", " ", " ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " ", " ", " ", " "],
    ["P", "P", "P", "P", "P", "P", "P", "P"],
    ["R", "N", "B", "Q", "K", "B", "N", "R"],
];
const emptyBoard: ChessBoard = Array.from({ length: 8 }, () =>
    Array(8).fill(" ")
);

type Action = MovePieceAction;
interface MovePieceAction {
    type: "MOVE_PIECE";
}

const reduceHistory = (prevHistory: string[], action: Action): string[] => {
    return prevHistory;
};

const Game: React.FC = () => {
    const [isWhiteTurn, setIsWhiteTurn] = useState(true);
    const [message, setMessage] = useState("");
    const [history, updateHistory] = useReducer(reduceHistory, []);

    const MockFEN: string =
        "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

    return (
        <div className="main">
            <div className="left">
                <Board
                    boardSetup={initialBoard}
                    // use this to update the move history
                    updateMoves={() => setMessage("Check!")}
                />
            </div>
            <div className="right">
                <h1>{isWhiteTurn ? "White" : "Black"} to play</h1>
                <h2 className="GameAlerts" onClick={() => setMessage("")}>
                    {message}
                </h2>
                <div>
                    {/* optional, add a + in the move history*/}
                    <button
                        className="CheckButton"
                        onClick={() => setMessage("Check!")}
                    >
                        Check!
                    </button>
                    <button onClick={() => setIsWhiteTurn(!isWhiteTurn)}>
                        End turn
                    </button>
                    <button
                        onClick={() => {
                            confirm("Forfeit game?")
                                ? setMessage("I resign, good game! 🤝")
                                : // push end game onto move history
                                  // swap players
                                  null; // do not forfeit
                        }}
                    >
                        Resign
                    </button>
                </div>
                <div>
                    {/*
                        on clicking castle push the notation into history and 
                    */}
                    <button onClick={() => {}}>Short Castle</button>
                    <button onClick={() => {}}>Long Castle</button>
                </div>

                {/* <label>Move History</label>
            <ol>
            {moves.map((element, index) => (
                <li key={index}>{element}</li>
                ))}
                </ol> 
                                    <button>Undo</button>
                */}

                {/*
                    I want to start a new game without refreshing the page.
                */}
            </div>
        </div>
    );
};

export default Game;
