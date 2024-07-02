import { useState, useEffect } from "react";

import { Hand, Chessboard } from "../types/chessType";
import { Cell } from "../types/cell";
import { MovePieceAction } from "../types/actionType";

import "./Board.css";
import RenderPiece from "./RenderPiece";
import {getMoves} from "../services/arbiterService.ts";

interface BoardProps {
    board: Chessboard;
    isWhiteTurn: boolean;
    onBoardMove: (action: MovePieceAction) => Promise<void>;
}
const Board: React.FC<BoardProps> = ({ board, isWhiteTurn, onBoardMove }) => {
    const [hand, setHand] = useState<Hand>(null);
    const [moves, setMoves] = useState<Cell[]>([]);

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

    const onBoardClick = (location: Cell): void => {
        if (
            !hand &&
            location.getPiece() !== " " &&
            location.isRightColor(isWhiteTurn)
        ) {
            setMoves(getMoves(location, board));
            setHand(location);
        } else if (hand && !location.equals(hand)) {
            onBoardMove({
                type: "MOVE_PIECE",
                payload: {
                    from: hand,
                    to: location,
                    denote: "",
                },
            }).then( () => {
                setHand(null);
                setMoves([]);
            });
        } else {
            setHand(null);
            setMoves([]);
        }
    };

    return (
        <div className="board">
            {board.squares.map((row: string[], rowIndex: number) => (
                <div key={rowIndex} className="chess-row">
                    {row.map((piece: string, colIndex: number) => (
                        <div
                            key={colIndex}
                            onClick={() =>
                                onBoardClick(
                                    new Cell(colIndex, rowIndex, piece)
                                )
                            }
                            className={`chess-square ${
                                moves.some((cell: Cell) =>
                                    cell.equals(
                                        new Cell(colIndex, rowIndex, " ")
                                    )
                                )
                                    ? "potential-move"
                                    : (rowIndex + colIndex) % 2 === 0
                                    ? "white"
                                    : "black"
                            }`}
                        >
                            <RenderPiece
                                location={new Cell(colIndex, rowIndex, piece)}
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
