import { useState, useEffect } from "react";

import { Hand, Direction, Chessboard } from "../types/chessType";
import { Cell } from "../types/cell";
import { MovePieceAction } from "../types/actionType";

import "./Board.css";
import RenderPiece from "./RenderPiece";

const moveInDirections = (
    directions: { [key: string]: Direction },
    cell: Cell,
    board: Chessboard,
    availableCells: Cell[]
) => {
    for (const direction in directions) {
        const { col: dCol, row: dRow } = directions[direction];
        for (let i = 1; i <= 7; i++) {
            const next = new Cell(
                cell.getCol() + i * dCol,
                cell.getRow() + i * dRow,
                " "
            );

            if (cell.canMove(next, board)) {
                availableCells.push(next);
                if (board[next.getRow()][next.getCol()] !== " ") {
                    break;
                }
            } else {
                break;
            }
        }
    }
};

const getMoves = (cell: Cell, board: Chessboard): Cell[] => {
    let availableCells: Cell[] = [];

    switch (cell.getPiece().toUpperCase()) {
        case "K":
            availableCells.push(
                new Cell(cell.getCol() + 1, cell.getRow() + 1, " ")
            );
            availableCells.push(
                new Cell(cell.getCol() + 1, cell.getRow(), " ")
            );
            availableCells.push(
                new Cell(cell.getCol() + 1, cell.getRow() - 1, " ")
            );
            availableCells.push(
                new Cell(cell.getCol(), cell.getRow() - 1, " ")
            );
            availableCells.push(
                new Cell(cell.getCol(), cell.getRow() + 1, " ")
            );
            availableCells.push(
                new Cell(cell.getCol() - 1, cell.getRow() + 1, " ")
            );
            availableCells.push(
                new Cell(cell.getCol() - 1, cell.getRow(), " ")
            );
            availableCells.push(
                new Cell(cell.getCol() - 1, cell.getRow() - 1, " ")
            );

            // put castle logic here

            availableCells = availableCells.filter((other) =>
                cell.canMove(other, board)
            );
            break;
        case "N":
            availableCells.push(
                new Cell(cell.getCol() + 1, cell.getRow() + 2, " ")
            );
            availableCells.push(
                new Cell(cell.getCol() + 2, cell.getRow() + 1, " ")
            );
            availableCells.push(
                new Cell(cell.getCol() + 1, cell.getRow() - 2, " ")
            );
            availableCells.push(
                new Cell(cell.getCol() + 2, cell.getRow() - 1, " ")
            );
            availableCells.push(
                new Cell(cell.getCol() - 1, cell.getRow() + 2, " ")
            );
            availableCells.push(
                new Cell(cell.getCol() - 2, cell.getRow() + 1, " ")
            );
            availableCells.push(
                new Cell(cell.getCol() - 1, cell.getRow() - 2, " ")
            );
            availableCells.push(
                new Cell(cell.getCol() - 2, cell.getRow() - 1, " ")
            );

            availableCells = availableCells.filter((other) =>
                cell.canMove(other, board)
            );
            break;
        case "R": {
            const directions: { [key: string]: Direction } = {
                U: { col: 0, row: -1 },
                D: { col: 0, row: 1 },
                L: { col: 1, row: 0 },
                R: { col: -1, row: 0 },
            };

            moveInDirections(directions, cell, board, availableCells);

            break;
        }
        case "B": {
            const directions: { [key: string]: Direction } = {
                UL: { col: -1, row: -1 },
                UR: { col: 1, row: -1 },
                DL: { col: -1, row: 1 },
                DR: { col: 1, row: 1 },
            };

            moveInDirections(directions, cell, board, availableCells);
            break;
        }
        case "Q": {
            const directions: { [key: string]: Direction } = {
                U: { col: 0, row: -1 },
                D: { col: 0, row: 1 },
                L: { col: 1, row: 0 },
                R: { col: -1, row: 0 },
                UL: { col: -1, row: -1 },
                UR: { col: 1, row: -1 },
                DL: { col: -1, row: 1 },
                DR: { col: 1, row: 1 },
            };

            moveInDirections(directions, cell, board, availableCells);
            break;
        }
        default: {
            // en passant here
            if (cell.getPiece() === "p") {
                if (
                    cell.getRow() === 1 &&
                    board[cell.getRow() + 2][cell.getCol()] === " "
                ) {
                    availableCells.push(
                        new Cell(cell.getCol(), cell.getRow() + 2, " ")
                    );
                }
                if (board[cell.getRow() + 1][cell.getCol() + 1] !== " ") {
                    availableCells.push(
                        new Cell(cell.getCol() + 1, cell.getRow() + 1, " ")
                    );
                }
                if (board[cell.getRow() + 1][cell.getCol() - 1] !== " ") {
                    availableCells.push(
                        new Cell(cell.getCol() - 1, cell.getRow() + 1, " ")
                    );
                }
                if (board[cell.getRow() + 1][cell.getCol()] === " ") {
                    availableCells.push(
                        new Cell(cell.getCol(), cell.getRow() + 1, " ")
                    );
                }
            } else if (cell.getPiece() === "P") {
                if (
                    cell.getRow() === 6 &&
                    board[cell.getRow() - 2][cell.getCol()] === " "
                ) {
                    availableCells.push(
                        new Cell(cell.getCol(), cell.getRow() - 2, " ")
                    );
                }
                if (board[cell.getRow() - 1][cell.getCol() + 1] !== " ") {
                    availableCells.push(
                        new Cell(cell.getCol() + 1, cell.getRow() - 1, " ")
                    );
                }
                if (board[cell.getRow() - 1][cell.getCol() - 1] !== " ") {
                    availableCells.push(
                        new Cell(cell.getCol() - 1, cell.getRow() - 1, " ")
                    );
                }
                if (board[cell.getRow() - 1][cell.getCol()] === " ") {
                    availableCells.push(
                        new Cell(cell.getCol(), cell.getRow() - 1, " ")
                    );
                }
            }
            availableCells = availableCells.filter((other) =>
                cell.canMove(other, board)
            );
        }
    }

    return availableCells;
};

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

        return () => {
            window.removeEventListener("click", handleOutsideClick);
        };
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
            });
            setHand(null);
            setMoves([]);
        } else {
            setHand(null);
            setMoves([]);
        }
    };

    return (
        <div className="board">
            {board.map((row: string[], rowIndex: number) => (
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
