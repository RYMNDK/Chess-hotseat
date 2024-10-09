import { useEffect, useState } from "react";
import Board from "./Board";
import "../Styles/Game.css";

import { Cell } from "../types/cell";
import {
    Action,
    RenderAction,
} from "../types/actionType";

import { genFEN, parseFEN } from "../services/FENService.ts";
import { getCell } from "../services/gameService.ts";
import {resolveAction} from "../services/actionService.ts";

interface GameProp {
    gameMode: string;
    receivedAction: Action
}

const Game: React.FC<GameProp> = ({
    gameMode,
    receivedAction
}) => {

    const [gameState, setGameState] = useState(
        parseFEN("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"));
    // todo: ask about initial states?

    const [gameBoard, setBoard] = useState(gameState.board);
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
    const [halfMove, setHalfMove] = useState<number>(
        gameState.halfmoveClock
    );
    const [fullMove, setFullMove] = useState<number>(
        gameState.fullmoveNumber
    );

    // todo: action queue lock moves when its not your turn.
    // move validation backend
    const [action, setAction] = useState<Action>({
        type:"EMPTY_ACTION",
        payload: {reason: "initial state"}}
    );

    // todo: move history: a list of actions
    // const [history, updateHistory] = useReducer(reduceHistory, []);
    const [message, setMessage] = useState<string>("");

    // move a piece from board
    const onBoardMove = (action: RenderAction ) => {
        setAction(action);
    };

    // todo: refactor further, then optimize calculation

    const [moveHelper, setMoveHelper] = useState({
        moves: {}, // Initially no moves recorded
        wk: getCell("e1"), // Initial position for white king
        bk: getCell("e8")  // Initial position for black king
    });

    // other buttons

    // handle action from parent
    // todo: ask about concurrency
    useEffect(() => {
        setAction(receivedAction);
    }, [receivedAction]);

    // resolve action
    useEffect(() => {
        if (action.type !== "EMPTY_ACTION") {
            // resolve the action, similar to a reducer
            const newState = resolveAction(
                {
                    board: gameBoard,
                    activeColor: isWhiteTurn ? "w" : "b",
                    castlingAvailability: castleAvailable,
                    enPassantTarget: enPassant === null ? "-" : enPassant.toString(),
                    halfmoveClock: Number(halfMove),
                    fullmoveNumber: Number(fullMove),
                },
                action);

            setGameState(newState.gameState);
            setMessage(newState.message);

            // if the helper need to be updated
            if (newState.helper !== null) {
                setMoveHelper(newState.helper);
            }
            setAction({ type: "EMPTY_ACTION", payload: {reason: "resolved action"} });
        }
    }, [action]);

    // render board states
    useEffect(
        () => {
            // todo: pack this to a class
            // for backend
            // what are the components?

            setBoard(gameState.board);
            setIsWhiteTurn(gameState.activeColor === "w");
            setCastleAvailable(gameState.castlingAvailability);
            setEnPassant(
                gameState.enPassantTarget !== "-"
                    ? getCell(gameState.enPassantTarget)
                    : null
            );
            setHalfMove(gameState.halfmoveClock);
            setFullMove(gameState.fullmoveNumber);
        },
        [gameState]
    );

    const printAllAvailableMoves = () => {
            console.log("show available moves", moveHelper);
    }

    return (
        <div className="main">
            {/*board*/}
            <div className="left">
                <Board
                    gameState={gameState}
                    onBoardMove={onBoardMove}
                    moveHelper={moveHelper}
                />
            </div>
            {/*control buttons*/}
            <div className="right">
                <h1>
                    {isWhiteTurn ? "White " : "Black "}
                    to play
                </h1>
                <h2 className="GameAlerts">{message}</h2>
                {/* rest of the buttons */}
                <button onClick={() => printAllAvailableMoves()}>Show</button>

                {/*keep one */}
                <p>Current FEN: {genFEN({
                    board: gameBoard,
                    activeColor: isWhiteTurn ? "w" : "b",
                    castlingAvailability: castleAvailable,
                    enPassantTarget:
                        enPassant === null ? "-" : enPassant.toString(),
                    halfmoveClock: Number(halfMove),
                    fullmoveNumber: Number(fullMove)
                })}</p>
                <p>Current FEN: {genFEN(gameState)}</p>

                {/* <MoveHistory moveList={renderActions} /> */}
            </div>
        </div>
    );
};

export default Game;
