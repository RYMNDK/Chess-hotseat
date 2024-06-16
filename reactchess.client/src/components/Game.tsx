import { useReducer, useState } from "react";

import {
    Action,
    RenderAction,
    ChessGameState,
    Chessboard,
} from "../types/chessType";

import "./Game.css";
import Board from "./Board";
import MoveHistory from "./MoveHistory";

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

const genFEN = (gameState: ChessGameState): string => {
    return "todo:";
};

const reduceBoard = (prevState: Chessboard, action: Action): Chessboard => {
    switch (action.type) {
        case "MOVE_PIECE": {
            const newState = prevState.map((row) => row.slice());

            const piece: string =
                prevState[action.payload.from.getRow()][
                    action.payload.from.getCol()
                ];
            newState[action.payload.to.getRow()][action.payload.to.getCol()] =
                piece;
            newState[action.payload.from.getRow()][
                action.payload.from.getCol()
            ] = " ";

            return newState;
        }

        default:
            return prevState;
    }
};

const reduceHistory = (prevHistory: Action[], action: Action): Action[] => {
    switch (action.type) {
        case "MOVE_PIECE":
            return [...prevHistory, action];
        case "UNDO_PIECE":
            // todo: remove the last entry in the action
            return prevHistory;
        case "CHECK_ACTION": {
            if (prevHistory.length > 0) {
                const lastAction: RenderAction = prevHistory[
                    prevHistory.length - 1
                ] as RenderAction;
                lastAction.payload.denote = "+";
                return prevHistory.slice(0, -1).concat(lastAction);
            } else {
                return prevHistory;
            }
        }
        case "CLEAR_BOARD":
            return [];
        default:
            return prevHistory;
    }
};

const Game: React.FC = () => {
    const MockFEN: string =
        "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
    
    const gameState: ChessGameState = parseFEN(MockFEN);

    const [board, updateBoard] = useReducer(reduceBoard, gameState.chessboard);
    const [isWhiteTurn, setIsWhiteTurn] = useState(
        gameState.activeColor == "w"
    );
    const [castleAvailable, setCastleAvailable] = useState(
        gameState.castlingAvailability
    );
    const [enPassant, setEnpassant] = useState(gameState.enPassantTarget);
    const [halfMove, setHalfMove] = useState(gameState.halfmoveClock);
    const [fullMove, setFullMove] = useState(gameState.fullmoveNumber);
    
    const [history, updateHistory] = useReducer(reduceHistory, []);
    const [message, setMessage] = useState("");

    // renderActions means an action that is in move history
    const renderActions = history.filter(
        (action: Action): action is RenderAction => {
            return action.type === "MOVE_PIECE";
        }
    );

    const onClickCheck = () => {
        setMessage("Check!");
        updateHistory({
            type: "CHECK_ACTION",
        });
    };

    const onClickResetBoard = () => {
        setMessage("");
        updateHistory({
            type: "CLEAR_BOARD",
        });
        
    };

    return (
        <div className="main">
            <div className="left">
                <Board
                    board={board}
                    updateBoard={updateBoard}
                    updateHistory={updateHistory}
                />
            </div>
            <div className="right">
                <h1>{isWhiteTurn ? "White" : "Black"} to play</h1>
                <h2 className="GameAlerts" onClick={() => setMessage("")}>
                    {message}
                </h2>
                <div>
                    <button
                        className="CheckButton"
                        onClick={() => onClickCheck()}
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
                    <button onClick={() => {}}>
                        En Passant at {enPassant}
                    </button>
                    <button onClick={() => {}}>Promotion</button>
                    <button onClick={() => {}}>
                        White Short Castle {castleAvailable.includes("K") ? "available" : "not available"}
                    </button>
                    <button onClick={() => {}}>
                        White Long Castle {castleAvailable.includes("Q") ? "available" : "not available"}
                    </button>
                    <button onClick={() => {}}>
                        Black Short Castle {castleAvailable.includes("k") ? "available" : "not available"}
                    </button>
                    <button onClick={() => {}}>
                        Black Long Castle {castleAvailable.includes("q") ? "available" : "not available"}
                    </button>
                    {/* manually add a piece on the board */}
                    <button onClick={() => {}}>Add piece</button>
                </div>

                <MoveHistory
                    moveList={renderActions}
                />
            </div>
        </div>
    );
};

export default Game;
