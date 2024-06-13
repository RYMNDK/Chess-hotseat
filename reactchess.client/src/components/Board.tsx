import { Action, Cell, Hand, Chessboard, Direction } from "../types/chessType";
import { useState } from "react";
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
                // can't hop over pieces
                if (board[next.getRow()][next.getCol()] !== " ") {
                    break;
                }
            } else {
                break;
            }
        }
    }
};

const getLegalMoves = (cell: Cell, board: Chessboard): Cell[] => {
    let availableCells: Cell[] = [];
    // const potential: Cell[] = [];

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

            // push in 2 castle squares (use canCastle function)

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
            // add the en passant square when eligible
            console.log(cell);

            if (cell.getPiece() == "p") {
                if (cell.getRow() === 1) {
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
            } else if (cell.getPiece() == "P") {
                if (cell.getRow() === 6) {
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

    // do a check for after move (cant move king to illegal squares)
    return availableCells;
};

// Take in board
interface BoardProps {
    board: Chessboard;
    updateBoard: React.Dispatch<Action>;
    updateHistory: React.Dispatch<Action>;
    // pass in other states
    // pass in undo
}
const Board: React.FC<BoardProps> = ({ board, updateBoard, updateHistory }) => {
    // const [board, updateBoard] = useReducer(reduceBoard, boardSetup); // initial should be set to initialSetup
    const [hand, setHand] = useState<Hand>(null);
    const [legalMoves, setLegalMoves] = useState<Cell[]>([]);
    // need to remove legal squares that are invalid AFTER piece move
    // add a cell for Algebraic -> Cell (for en passant)

    // add a state to resolve undo

    // handle board click
    const onBoardClick = (location: Cell): void => {
        // console.log(location);
        if (!hand && location.getPiece() !== " ") {
            // pass in en passant and castle available after
            setLegalMoves(getLegalMoves(location, board));
            setHand(location); // highlight the piece
        } else if (hand && !location.equals(hand)) {
            // move validation goes here
            // put down the piece on invalid move
            // update state after move (en passant/castle)
            handleMove({
                type: "MOVE_PIECE",
                payload: {
                    from: hand,
                    to: location,
                    denote: "",
                },
            });
            setHand(null);
            setLegalMoves([]);
        } else {
            setHand(null);
            setLegalMoves([]);
        }
    };

    const handleMove = async (action: Action): Promise<void> => {
        // add to move history, then update board
        await updateHistory(action);
        updateBoard(action);
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
                                legalMoves.some((cell: Cell) =>
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
