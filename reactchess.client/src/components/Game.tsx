import { useReducer, useState } from "react";

import {
    // ChessBoard,
    Action,
    RenderAction,
    // Cell,
    ChessGameState,
} from "../types/chessType";

import "./Game.css";
import Board from "./Board";
import MoveHistory from "./MoveHistory";

// comment those two for fresh board FEN
// const initialBoard: string[][] = [
//     ["r", "n", "b", "q", "k", "b", "n", "r"],
//     ["p", "p", "p", "p", "p", "p", "p", "p"],
//     [" ", " ", " ", " ", " ", " ", " ", " "],
//     [" ", " ", " ", " ", " ", " ", " ", " "],
//     [" ", " ", " ", " ", " ", " ", " ", " "],
//     [" ", " ", " ", " ", " ", " ", " ", " "],
//     ["P", "P", "P", "P", "P", "P", "P", "P"],
//     ["R", "N", "B", "Q", "K", "B", "N", "R"],
// ];
// const emptyBoard: string[][] = Array.from({ length: 8 }, () =>
//     Array(8).fill(" ")
// );

type Chessboard = string[][];

const parseFEN = (fen: string): ChessGameState => {
    const [
        piecePlacement,
        activeColor,
        castlingAvailability,
        enPassantTarget,
        halfmoveClock,
        fullmoveNumber,
    ] = fen.split(" ");

    const chessboard: Chessboard = Array.from({ length: 8 }, () =>
        Array(8).fill(" ")
    );

    const rows = piecePlacement.split("/");
    for (let rowIdx = 0; rowIdx < rows.length; rowIdx++) {
        let colIdx = 0;
        for (const char of rows[rowIdx]) {
            if (isNaN(Number(char))) {
                chessboard[rowIdx][colIdx] = char;
                colIdx += 1;
            } else {
                colIdx += Number(char);
            }
        }
    }

    return {
        chessboard,
        activeColor,
        castlingAvailability,
        enPassantTarget,
        halfmoveClock: Number(halfmoveClock),
        fullmoveNumber: Number(fullmoveNumber),
    };
};

const reduceHistory = (prevHistory: Action[], action: Action): Action[] => {
    switch (action.type) {
        case "MOVE_PIECE":
            return [...prevHistory, action];
        case "UNDO_PIECE":
            return prevHistory.slice(0, -1);
        case "CLEAR_BOARD":
            return [];
        default:
            return prevHistory;
    }
};

const Game: React.FC = () => {
    const MockFEN: string =
        "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR b KQkq e3 0 1";
    const state = parseFEN(MockFEN);

    const BoardCells: string[][] = state.chessboard;

    const [isWhiteTurn, setIsWhiteTurn] = useState(true);
    // other FEN related fields goes here
    const [message, setMessage] = useState("");
    const [history, updateHistory] = useReducer(reduceHistory, []);

    // get a state to take back the last move

    const isRenderAction = (action: Action): action is RenderAction => {
        return (
            action.type === "MOVE_PIECE" //||
            // action.type === "PAWN_PROMOTION" ||
            // action.type === "EN_PASSANT"
        );
    };
    const renderActions = history.filter(isRenderAction);

    const onClickResetBoard = () => {
        setMessage("");
        updateHistory({
            type: "CLEAR_BOARD",
        });
        // reset the board
    };

    return (
        <div className="main">
            <div className="left">
                <Board boardSetup={BoardCells} updateMoveList={updateHistory} />
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
                                : null;
                        }}
                    >
                        Resign
                    </button>
                    <button onClick={() => onClickResetBoard}>New game</button>
                </div>
                <div>
                    {/*
                        on clicking castle push the notation into history and 
                    */}
                    <button onClick={() => {}}>En Passant</button>
                    <button onClick={() => {}}>Promotion</button>
                    <button onClick={() => {}}>Short Castle</button>
                    <button onClick={() => {}}>Long Castle</button>
                    <button onClick={() => {}}>Add piece</button>
                </div>

                <MoveHistory
                    moveList={renderActions}
                    updateMoveList={updateHistory}
                />
            </div>
        </div>
    );
};

export default Game;
