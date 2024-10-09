import { useState, useEffect } from "react";
import RenderPiece from "./RenderPiece";
import "../Styles/Board.css";

import { Cell } from "../types/cell";
import { Chessboard, Hand } from "../types/chessType";
import { EmptyAction, RenderAction} from "../types/actionType";
import { boardHelper } from "../types/boardHelperType.ts";

import {getAction, getAvailableMoves, illegalMoveFilter} from "../services/actionService.ts";

interface BoardProps {
    gameState: Chessboard
    onBoardMove: (action: RenderAction ) => void;
    moveHelper: boardHelper
}
const Board: React.FC<BoardProps> = ({
    gameState,
    onBoardMove,
    moveHelper
}) => {
    const [hand, setHand] = useState<Hand>(null);
    const [moves, setMoves] = useState<Cell[]>([]);

    // clears the hand if the user clicks outside the board
    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            const boardElement = document.querySelector(".board");
            if (boardElement && !boardElement.contains(event.target as Node)) {
                setHand(null);
                setMoves([]);
            }
        };
        window.addEventListener("click", handleOutsideClick);
        return () => window.removeEventListener("click", handleOutsideClick);
    }, []);

    const onBoardClick = (target: Cell): void => {
        if (
            // pick up a piece
            !hand && target.getPieceFromBoard(gameState) !== " " &&
            target.isRightColor(gameState ,gameState.activeColor)
        ) {
            // all move -> available moves -> legal move
            setMoves(illegalMoveFilter(gameState, target, moveHelper, getAvailableMoves(gameState, target, moveHelper)));
            setHand(target);
        } else if (hand && moves.some(cell => cell.equals(target))) {
            const action: RenderAction|EmptyAction = getAction(gameState, hand, target);
            if (action.type !== "EMPTY_ACTION" ) {
                onBoardMove(action);
            }
            setHand(null);
            setMoves([]);
        } else {
            setHand(null);
            setMoves([]);
        }
    };

    return (
        <div className="board">
            {gameState.board.map((row: string[], rowIndex: number) => (
                <div key={rowIndex} className="chess-row">
                    {row.map((piece:string, colIndex: number) => (
                        <div
                            key={colIndex}
                            onClick={() =>
                                onBoardClick(
                                    new Cell(colIndex, rowIndex)
                                )
                            }
                            className={`chess-square ${
                                moves.some((cell: Cell) =>
                                    cell.equals(
                                        new Cell(colIndex, rowIndex)
                                    )
                                )
                                    ? "potential-move"
                                    : (rowIndex + colIndex) % 2 === 0
                                        ? "white"
                                        : "black"
                                }`}
                        >
                            <RenderPiece
                                location={new Cell(colIndex, rowIndex)}
                                piece={piece}
                                hand={hand}
                            />
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default Board;
