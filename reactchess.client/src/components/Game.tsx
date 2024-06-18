import { act, useReducer, useState } from "react";

import {
    Action,
    RenderAction,
    MovePieceAction,
    ChessGameState,
    Chessboard,
    CastleAction,
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
    // if the castle availability is "" then set it to -
    return "todo:";
};

const reduceBoard = (prevState: Chessboard, action: Action): Chessboard => {
    const newState = prevState.map((row) => row.slice());
    switch (action.type) {
        case "MOVE_PIECE": {
            const piece: string =
                prevState[action.payload.from.getRow()][
                    action.payload.from.getCol()
                ];
            newState[action.payload.to.getRow()][action.payload.to.getCol()] =
                piece;
            newState[action.payload.from.getRow()][
                action.payload.from.getCol()
            ] = " ";
            break;
        }
        case "CASTLE_ACTION": {
            switch (action.payload.color) {
                case "w": {
                    newState[7][4] = " ";
                    switch (action.payload.side) {
                        case "k":
                            newState[7][5] = "R";
                            newState[7][6] = "K";
                            newState[7][7] = " ";
                            break;
                        case "q":
                            newState[7][0] = " ";
                            newState[7][1] = " ";
                            newState[7][2] = "K";
                            newState[7][3] = "R";
                            break;
                    }
                    break;
                }
                case "b": {
                    newState[0][4] = " ";
                    switch (action.payload.side) {
                        case "k":
                            newState[0][5] = "r";
                            newState[0][6] = "k";
                            newState[0][7] = " ";
                            break;
                        case "q":
                            newState[0][0] = " ";
                            newState[0][1] = " ";
                            newState[0][2] = "k";
                            newState[0][3] = "r";
                            break;
                    }
                    break;
                }
            }
            return newState;
        }
    }
    return newState;
};

const reduceHistory = (prevHistory: Action[], action: Action): Action[] => {
    switch (action.type) {
        case "MOVE_PIECE":
        case "CASTLE_ACTION":
            return [...prevHistory, action];
        case "UNDO_MOVE":
            if (prevHistory.length > 0) {
                return prevHistory.slice(0, -1);
            }
            break;
        case "CHECK_ACTION": {
            if (prevHistory.length > 0) {
                const lastAction: RenderAction = prevHistory[
                    prevHistory.length - 1
                ] as RenderAction;
                lastAction.payload.denote = "+";
                return prevHistory.slice(0, -1).concat(lastAction);
            }
            break;
        }
        case "CLEAR_BOARD":
            return [];
    }
    return prevHistory;
};

const Game: React.FC = () => {
    const MockFEN: string =
        "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

    const gameState: ChessGameState = parseFEN(MockFEN);

    const [board, updateBoard] = useReducer(reduceBoard, gameState.chessboard);
    const [isWhiteTurn, setIsWhiteTurn] = useState(
        gameState.activeColor === "w"
    );
    const [castleAvailable, setCastleAvailable] = useState(
        gameState.castlingAvailability
    );
    const [enPassant, setEnPassant] = useState<string>(
        gameState.enPassantTarget
    );
    const [halfMove, setHalfMove] = useState<number>(gameState.halfmoveClock);
    const [fullMove, setFullMove] = useState<number>(gameState.fullmoveNumber);

    const [history, updateHistory] = useReducer(reduceHistory, []);
    const [message, setMessage] = useState("");
    const [isFreePlace, setIsFreePlace] = useState<boolean>(false);

    // renderActions means an action that is in move history
    const renderActions = history.filter(
        (action: Action): action is RenderAction => {
            return (
                action.type === "MOVE_PIECE" || action.type === "CASTLE_ACTION"
            );
        }
    );

    const onBoardMove = async (action: MovePieceAction): Promise<void> => {
        const payload = action.payload;
        const piece: string = payload.from.getPiece();
        const didCapture = payload.to.getPiece() === " ";
        setMessage(
            `Last move: ${
                piece.toUpperCase() !== "P" ? piece.toUpperCase() : ""
            }${payload.from.toString()}${
                payload.to.getPiece() === " " ? "-" : "x"
            }${payload.to.toString()}${payload.denote ?? ""}`
        );

        // todo: check for en passant
        setEnPassant("-");
        switch (piece.toUpperCase()) {
            case "K":
                if (
                    castleAvailable.includes("k") &&
                    castleAvailable.includes("q") &&
                    action.payload.from.getPiece() === "k"
                ) {
                    setCastleAvailable(castleAvailable.replace("kq", ""));
                } else if (
                    castleAvailable.includes("K") &&
                    castleAvailable.includes("Q") &&
                    action.payload.from.getPiece() === "K"
                ) {
                    setCastleAvailable(castleAvailable.replace("KQ", ""));
                }
                break;
            case "R":
                if (
                    castleAvailable.includes("k") &&
                    action.payload.from.getCol() === 0 &&
                    action.payload.from.getPiece() === "r"
                ) {
                    setCastleAvailable(castleAvailable.replace("k", ""));
                } else if (
                    castleAvailable.includes("q") &&
                    action.payload.from.getCol() === 7 &&
                    action.payload.from.getPiece() === "r"
                ) {
                    setCastleAvailable(castleAvailable.replace("q", ""));
                } else if (
                    castleAvailable.includes("K") &&
                    action.payload.from.getCol() === 7 &&
                    action.payload.from.getPiece() === "R"
                ) {
                    setCastleAvailable(castleAvailable.replace("K", ""));
                } else if (
                    castleAvailable.includes("Q") &&
                    action.payload.from.getCol() === 0 &&
                    action.payload.from.getPiece() === "R"
                ) {
                    setCastleAvailable(castleAvailable.replace("Q", ""));
                }
                break;
            case "P":
                // en passant
                break;
        }

        await updateHistory(action);
        updateBoard(action);

        setIsWhiteTurn(!isWhiteTurn);
        // todo: 50 turns of no capture/move pawn for half move
        setFullMove(fullMove + 0.5);
    };

    const onClickCheck = (): void => {
        if (message.indexOf("Check!") === -1) {
            setMessage(message + " Check!");
            updateHistory({
                type: "CHECK_ACTION",
            });
        }
    };

    const onClickCastle = (color: string, side: string): void => {
        setMessage(
            `${color === "w" ? "white" : "black"} ${
                side.toLowerCase() === "q" ? "queen" : "king"
            } side castle`
        );

        if (color === "w") {
            setCastleAvailable(castleAvailable.replace("KQ", ""));
        } else {
            setCastleAvailable(castleAvailable.replace("kq", ""));
        }

        const action: CastleAction = {
            type: "CASTLE_ACTION",
            payload: {
                color,
                side,
                denote: null,
            },
        };
        updateHistory(action);
        updateBoard(action);

        setIsWhiteTurn(!isWhiteTurn);
        setHalfMove(halfMove + 0.5);
        setFullMove(fullMove + 0.5);
    };

    const onClickUndo = (): void => {
        updateHistory({
            type: "UNDO_MOVE",
        });
        // undo the move on the board
    };

    const onClickResetBoard = (): void => {
        setMessage("");
        updateHistory({
            type: "CLEAR_BOARD",
        });
        // also reset the board
    };

    const onClickFreePlace = (): void => {
        if (!isFreePlace) {
            setIsFreePlace(true);
            setMessage("Click the button again to exit free place mode");
        } else {
            setIsFreePlace(false);
            setMessage("Leaving free place, please check turn player");
        }
    };

    return (
        <div className="main">
            <div className="left">
                <Board board={board} onBoardMove={onBoardMove} />
            </div>
            <div className="right">
                {isFreePlace ? (
                    <h1>Free Place Mode</h1>
                ) : (
                    <h1>{isWhiteTurn ? "White" : "Black"} to play</h1>
                )}
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
                    <button
                        onClick={() => {
                            confirm("Offer draw") ? setMessage("") : null;
                            // push a 1/2 - 1/2 in history
                        }}
                    >
                        Offer draw
                    </button>
                    <button
                        onClick={() => {
                            confirm("Forfeit game?")
                                ? setMessage("I resign, good game! 🤝")
                                : null;
                            // push a 1-0 or 0-1 in history
                        }}
                    >
                        Resign
                    </button>
                    <button onClick={() => onClickResetBoard}>New game</button>
                </div>
                <div>
                    {castleAvailable.includes("K") && isWhiteTurn && (
                        <button onClick={() => onClickCastle("w", "k")}>
                            White Short Castle
                        </button>
                    )}
                    {castleAvailable.includes("Q") && isWhiteTurn && (
                        <button onClick={() => onClickCastle("w", "q")}>
                            White Long Castle
                        </button>
                    )}
                    {castleAvailable.includes("k") && !isWhiteTurn && (
                        <button onClick={() => onClickCastle("b", "k")}>
                            Black Short Castle
                        </button>
                    )}
                    {castleAvailable.includes("q") && !isWhiteTurn && (
                        <button onClick={() => onClickCastle("b", "q")}>
                            Black Long Castle
                        </button>
                    )}
                </div>
                <div>
                    {/* check left side and right side, en passant will also end turn*/}
                    {enPassant != "-" && (
                        <button onClick={() => {}}>En Passant LEFT</button>
                    )}
                    {enPassant != "-" && (
                        <button onClick={() => {}}>En Passant RIGHT</button>
                    )}
                </div>
                <div>
                    <button onClick={() => {}}>Promotion</button>
                </div>
                <div>
                    {/* free place and reading FEN */}
                    <button
                        onClick={() => {
                            onClickFreePlace();
                        }}
                    >
                        Free place mode
                    </button>
                </div>
                <div>
                    {/* other advanced controls */}
                    <button onClick={() => {}}>Add piece</button>
                    <button onClick={() => {}}>Remove piece</button>
                    <button onClick={() => setIsWhiteTurn(!isWhiteTurn)}>
                        Swap player
                    </button>
                    <button onClick={() => {}}>Add ... to history</button>
                    <button
                        onClick={() => {
                            onClickUndo();
                        }}
                    >
                        Delete last move
                    </button>
                </div>

                <MoveHistory moveList={renderActions} />
            </div>
        </div>
    );
};

export default Game;
