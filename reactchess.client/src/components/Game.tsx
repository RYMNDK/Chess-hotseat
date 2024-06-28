import { useReducer, useState, useEffect } from "react";

import { ChessGameState, Chessboard } from "../types/chessType";
import { Cell } from "../types/cell";
import {
    Action,
    RenderAction,
    MovePieceAction,
    CastleAction,
    EnPassantAction,
} from "../types/actionType";

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
    // if en passant is null then set it to -
    return "todo:";
};

const getNewPiece = (isWhiteTurn: boolean): string => {
    let piece;
    do {
        piece = prompt("Enter one of q, b, r, n:") || "";
    } while (!["q", "b", "r", "n"].includes(piece));
    return isWhiteTurn ? piece.toUpperCase() : piece.toLowerCase();
};

const reduceBoard = (prevState: Chessboard, action: Action): Chessboard => {
    const newState = prevState.map((row: string[]) => row.slice());
    switch (action.type) {
        case "MOVE_PIECE": {
            const piece: string =
                action.payload.denote !== ""
                    ? action.payload.denote[1]
                    : prevState[action.payload.from.getRow()][
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
            if (action.payload.isWhite) {
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
            } else {
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
            }
            break;
        }
        case "EN_PASSANT_ACTION": {
            if (action.payload.isWhite) {
                newState[action.payload.to.getRow()][
                    action.payload.to.getCol()
                ] = "P";
                newState[action.payload.to.getRow() + 1][
                    action.payload.to.getCol()
                ] = " ";
                newState[action.payload.from.getRow()][
                    action.payload.from.getCol()
                ] = " ";
            } else {
                newState[action.payload.to.getRow()][
                    action.payload.to.getCol()
                ] = "p";
                newState[action.payload.to.getRow() - 1][
                    action.payload.to.getCol()
                ] = " ";
                newState[action.payload.from.getRow()][
                    action.payload.from.getCol()
                ] = " ";
            }
            break;
        }
        case "SET_BOARD": {
            return action.payload;
        }
    }

    return newState;
};

const reduceHistory = (prevHistory: Action[], action: Action): Action[] => {
    switch (action.type) {
        case "MOVE_PIECE":
        case "CASTLE_ACTION":
        case "EN_PASSANT_ACTION":
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
                if (!lastAction.payload.denote.includes("+")) {
                    lastAction.payload.denote += "+";
                }
                return prevHistory.slice(0, -1).concat(lastAction);
            }
            break;
        }
        case "CLEAR_BOARD":
            return [];
    }
    return prevHistory;
};

const getCell = (location: string): Cell =>
    new Cell(
        location.charCodeAt(0) - "a".charCodeAt(0),
        8 - (location[1].charCodeAt(0) - "0".charCodeAt(0)),
        " "
    );

const checkEnPassant = (
    board: Chessboard,
    location: Cell,
    isWhiteTurn: boolean,
    side: string
): boolean => {
    if (
        (location.getCol() === 0 && side === "q") ||
        (location.getCol() === 7 && side === "k")
    ) {
        // out of bounds
        return false;
    }
    if (isWhiteTurn) {
        if (side === "k") {
            return board[location.getRow() + 1][location.getCol() - 1] === "P";
        } else {
            return board[location.getRow() + 1][location.getCol() + 1] === "P";
        }
    } else {
        if (side === "k") {
            return board[location.getRow() - 1][location.getCol() - 1] === "p";
        } else {
            return board[location.getRow() - 1][location.getCol() + 1] === "p";
        }
    }
};

interface GameProp {
    BoardFEN: string;
}

const Game: React.FC<GameProp> = ({ BoardFEN }) => {
    const gameState: ChessGameState = parseFEN(BoardFEN);

    const [board, updateBoard] = useReducer(reduceBoard, gameState.chessboard);
    const [isWhiteTurn, setIsWhiteTurn] = useState<boolean>(
        gameState.activeColor === "w"
    );
    const [castleAvailable, setCastleAvailable] = useState(
        gameState.castlingAvailability
    );
    const [enPassant, setEnPassant] = useState<Cell | null>(
        gameState.enPassantTarget !== "-"
            ? getCell(gameState.enPassantTarget)
            : null
    );
    const [halfMove, setHalfMove] = useState<number>(gameState.halfmoveClock);
    const [fullMove, setFullMove] = useState<number>(gameState.fullmoveNumber);

    const [history, updateHistory] = useReducer(reduceHistory, []);
    const [message, setMessage] = useState<string>("");
    const [isFreePlace, setIsFreePlace] = useState<boolean>(false);
    const [showAdvanceControl, setShowAdvanceControl] =
        useState<boolean>(false);

    useEffect(() => {
        setGameState(BoardFEN);
    }, [BoardFEN]);

    // renderActions means an action that is in move history
    const renderActions = history.filter(
        (action: Action): action is RenderAction => {
            return (
                action.type === "MOVE_PIECE" ||
                action.type === "CASTLE_ACTION" ||
                action.type === "EN_PASSANT_ACTION"
            );
        }
    );

    const onBoardMove = async (action: MovePieceAction): Promise<void> => {
        const payload = action.payload;
        const piece: string = payload.from.getPiece();

        const didCapture = payload.to.getPiece() === " ";

        setEnPassant(null);
        switch (piece.toUpperCase()) {
            case "K":
                if (
                    castleAvailable.includes("k") &&
                    castleAvailable.includes("q") &&
                    payload.from.getPiece() === "k"
                ) {
                    setCastleAvailable(castleAvailable.replace("kq", ""));
                } else if (
                    castleAvailable.includes("K") &&
                    castleAvailable.includes("Q") &&
                    payload.from.getPiece() === "K"
                ) {
                    setCastleAvailable(castleAvailable.replace("KQ", ""));
                }
                break;
            case "R":
                if (
                    castleAvailable.includes("k") &&
                    payload.from.getCol() === 0 &&
                    payload.from.getPiece() === "r"
                ) {
                    setCastleAvailable(castleAvailable.replace("k", ""));
                } else if (
                    castleAvailable.includes("q") &&
                    payload.from.getCol() === 7 &&
                    payload.from.getPiece() === "r"
                ) {
                    setCastleAvailable(castleAvailable.replace("q", ""));
                } else if (
                    castleAvailable.includes("K") &&
                    payload.from.getCol() === 7 &&
                    payload.from.getPiece() === "R"
                ) {
                    setCastleAvailable(castleAvailable.replace("K", ""));
                } else if (
                    castleAvailable.includes("Q") &&
                    payload.from.getCol() === 0 &&
                    payload.from.getPiece() === "R"
                ) {
                    setCastleAvailable(castleAvailable.replace("Q", ""));
                }
                break;
            case "P":
                if (
                    payload.from.getRow() === 1 &&
                    payload.to.getRow() === 3 &&
                    payload.from.getPiece() === "p"
                ) {
                    setEnPassant(
                        new Cell(
                            payload.from.getCol(),
                            payload.from.getRow() + 1,
                            " "
                        )
                    );
                } else if (
                    payload.from.getRow() === 6 &&
                    payload.to.getRow() === 4 &&
                    payload.from.getPiece() === "P"
                ) {
                    setEnPassant(
                        new Cell(
                            payload.from.getCol(),
                            payload.from.getRow() - 1,
                            " "
                        )
                    );
                } else if (
                    payload.from.getRow() === 6 &&
                    payload.from.getPiece() === "p"
                ) {
                    payload.denote = `=${getNewPiece(isWhiteTurn)}`;
                } else if (
                    payload.from.getRow() === 1 &&
                    payload.from.getPiece() === "P"
                ) {
                    payload.denote = `=${getNewPiece(isWhiteTurn)}`;
                }
                break;
        }

        setMessage(
            `Last move: ${
                piece.toUpperCase() !== "P" ? piece.toUpperCase() : ""
            }${payload.from.toString()}${
                payload.to.getPiece() === " " ? "-" : "x"
            }${payload.to.toString()}${
                payload.denote !== "" ? payload.denote.toUpperCase() : ""
            }`
        );
        await updateHistory(action);
        updateBoard(action);

        setIsWhiteTurn(!isWhiteTurn);
        if (didCapture || piece.toUpperCase()) {
            setHalfMove(0);
        } else {
            setHalfMove(halfMove + 0.5);
        }
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

    const onClickCastle = (side: string): void => {
        setMessage(
            `${isWhiteTurn ? "white" : "black"} ${
                side.toLowerCase() === "q" ? "queen" : "king"
            } side castle`
        );

        if (isWhiteTurn) {
            setCastleAvailable(castleAvailable.replace("KQ", ""));
        } else {
            setCastleAvailable(castleAvailable.replace("kq", ""));
        }
        setEnPassant(null);

        const action: CastleAction = {
            type: "CASTLE_ACTION",
            payload: {
                isWhite: isWhiteTurn,
                side,
                denote: "",
            },
        };
        updateHistory(action);
        updateBoard(action);

        setIsWhiteTurn(!isWhiteTurn);
        setHalfMove(halfMove + 0.5);
        setFullMove(fullMove + 0.5);
    };

    const onClickEnPassant = (location: Cell, side: string): void => {
        setMessage(`En Passant on ${location.toString()}`);
        let from = null;

        if (isWhiteTurn) {
            if (side === "k") {
                from = new Cell(
                    location.getCol() - 1,
                    location.getRow() + 1,
                    "P"
                );
            } else {
                from = new Cell(
                    location.getCol() + 1,
                    location.getRow() + 1,
                    "P"
                );
            }
        } else {
            if (side === "k") {
                from = new Cell(
                    location.getCol() - 1,
                    location.getRow() - 1,
                    "p"
                );
            } else {
                from = new Cell(
                    location.getCol() + 1,
                    location.getRow() - 1,
                    "p"
                );
            }
        }

        const action: EnPassantAction = {
            type: "EN_PASSANT_ACTION",
            payload: {
                isWhite: isWhiteTurn,
                from,
                to: location,
                denote: "",
            },
        };

        setEnPassant(null);
        updateHistory(action);
        updateBoard(action);

        setIsWhiteTurn(!isWhiteTurn);
        setHalfMove(0);
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

        // new assign, assign the states
        setGameState(
            "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
        );
    };

    const onClickFreePlace = (): void => {
        if (!isFreePlace) {
            setIsFreePlace(true);
            setMessage("In free place moves will not be added to history.");
        } else {
            setIsFreePlace(false);
            setMessage("Leaving free place, please check turn player.");
        }
    };

    const setGameState = (FEN: string) => {
        const gameState = parseFEN(FEN);
        updateBoard({
            type: "SET_BOARD",
            payload: gameState.chessboard,
        });
        setIsWhiteTurn(gameState.activeColor === "w");
        setCastleAvailable(gameState.castlingAvailability);
        setEnPassant(
            gameState.enPassantTarget !== "-"
                ? getCell(gameState.enPassantTarget)
                : null
        );
        setHalfMove(gameState.halfmoveClock);
        setFullMove(gameState.fullmoveNumber);
    };

    return (
        <div className="main">
            <div className="left">
                <Board
                    board={board}
                    isWhiteTurn={isWhiteTurn}
                    onBoardMove={onBoardMove}
                />
            </div>
            <div className="right">
                {isFreePlace ? (
                    <h1>Free Place Mode</h1>
                ) : (
                    <h1>{isWhiteTurn ? "White" : "Black"} to play</h1>
                )}
                <h2 className="GameAlerts">{message}</h2>
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
                    <button onClick={() => onClickResetBoard()}>
                        New game
                    </button>
                </div>
                <div>
                    {castleAvailable.includes("K") && isWhiteTurn && (
                        <button onClick={() => onClickCastle("k")}>
                            White Short Castle
                        </button>
                    )}
                    {castleAvailable.includes("Q") && isWhiteTurn && (
                        <button onClick={() => onClickCastle("q")}>
                            White Long Castle
                        </button>
                    )}
                    {castleAvailable.includes("k") && !isWhiteTurn && (
                        <button onClick={() => onClickCastle("k")}>
                            Black Short Castle
                        </button>
                    )}
                    {castleAvailable.includes("q") && !isWhiteTurn && (
                        <button onClick={() => onClickCastle("q")}>
                            Black Long Castle
                        </button>
                    )}
                </div>
                <div>
                    <h3>En passant at {enPassant?.toString() ?? "-"}</h3>
                    {enPassant != null &&
                        checkEnPassant(board, enPassant, isWhiteTurn, "q") && (
                            <button
                                onClick={() => {
                                    onClickEnPassant(enPassant, "q");
                                }}
                            >
                                En Passant Queen Side
                            </button>
                        )}
                    {enPassant != null &&
                        checkEnPassant(board, enPassant, isWhiteTurn, "k") && (
                            <button
                                onClick={() => {
                                    onClickEnPassant(enPassant, "k");
                                }}
                            >
                                En Passant King Side
                            </button>
                        )}
                </div>
                <div>
                    <button
                        onClick={() => {
                            setShowAdvanceControl(!showAdvanceControl);
                        }}
                    >
                        {" "}
                        {!showAdvanceControl ? "Show" : "Hide"} Advanced
                        Controls
                    </button>
                    {showAdvanceControl && (
                        <div>
                            <button
                                onClick={() => {
                                    onClickFreePlace();
                                }}
                            >
                                Free place mode
                            </button>
                            <button onClick={() => {}}>Load FEN</button>
                            <button onClick={() => {}}>Export FEN</button>
                            <button onClick={() => {}}>Add piece</button>
                            <button onClick={() => {}}>Remove piece</button>
                            <button
                                onClick={() => setIsWhiteTurn(!isWhiteTurn)}
                            >
                                Swap player
                            </button>
                            <button onClick={() => {}}>
                                Add ... to history
                            </button>
                            <button
                                onClick={() => {
                                    onClickUndo();
                                }}
                            >
                                Delete last move
                            </button>
                        </div>
                    )}
                </div>

                <MoveHistory moveList={renderActions} />
            </div>
        </div>
    );
};

export default Game;
