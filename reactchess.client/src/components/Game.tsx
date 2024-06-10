import { useReducer, useState } from "react";

import { ChessBoard, Action } from "../types/chessType";

import Board from "./Board";
import "./Game.css";
import MoveHistory from "./MoveHistory";

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

const reduceHistory = (prevHistory: string[], action: Action): string[] => {
    console.log("Update history");
    switch (action.type) {
        case "MOVE_PIECE":
            // modify the action
            return [...prevHistory, "a new move added"];
        default:
            return prevHistory;
    }
};

const Game: React.FC = () => {
    const [isWhiteTurn, setIsWhiteTurn] = useState(true);
    // other FEN related fields goes here
    const [message, setMessage] = useState("");
    const [history, updateHistory] = useReducer(reduceHistory, []);

    const MockFEN: string =
        "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

    const resetBoard = () => {
        setMessage("");
        // clear the board
        // clear move history
    };

    // parse FEN here, initialize FEN variables

    return (
        <div className="main">
            <div className="left">
                <Board
                    boardSetup={initialBoard}
                    updateMoveList={updateHistory}
                />
            </div>
            <div className="right">
                <h1>{isWhiteTurn ? "White" : "Black"} to play</h1>
                <h2 className="GameAlerts" onClick={() => setMessage("")}>
                    {message}
                </h2>
                <div>
                    {/* add a + in the move history*/}
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

                <MoveHistory
                    moveList={history}
                    updateMoveList={updateHistory}
                />

                <button onClick={resetBoard}>New game</button>
            </div>
        </div>
    );
};

export default Game;
