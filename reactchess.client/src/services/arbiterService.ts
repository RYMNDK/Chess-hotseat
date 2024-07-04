import {Cell} from "../types/cell.ts";
import {Chessboard, Direction} from "../types/chessType.ts";

export const getMoves = (cell: Cell, board: Chessboard): Cell[] => {
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
                    board.squares[cell.getRow() + 2][cell.getCol()] === " "
                ) {
                    availableCells.push(
                        new Cell(cell.getCol(), cell.getRow() + 2, " ")
                    );
                }
                if (board.squares[cell.getRow() + 1][cell.getCol() + 1] !== " ") {
                    availableCells.push(
                        new Cell(cell.getCol() + 1, cell.getRow() + 1, " ")
                    );
                }
                if (board.squares[cell.getRow() + 1][cell.getCol() - 1] !== " ") {
                    availableCells.push(
                        new Cell(cell.getCol() - 1, cell.getRow() + 1, " ")
                    );
                }
                if (board.squares[cell.getRow() + 1][cell.getCol()] === " ") {
                    availableCells.push(
                        new Cell(cell.getCol(), cell.getRow() + 1, " ")
                    );
                }
            } else if (cell.getPiece() === "P") {
                if (
                    cell.getRow() === 6 &&
                    board.squares[cell.getRow() - 2][cell.getCol()] === " "
                ) {
                    availableCells.push(
                        new Cell(cell.getCol(), cell.getRow() - 2, " ")
                    );
                }
                if (board.squares[cell.getRow() - 1][cell.getCol() + 1] !== " ") {
                    availableCells.push(
                        new Cell(cell.getCol() + 1, cell.getRow() - 1, " ")
                    );
                }
                if (board.squares[cell.getRow() - 1][cell.getCol() - 1] !== " ") {
                    availableCells.push(
                        new Cell(cell.getCol() - 1, cell.getRow() - 1, " ")
                    );
                }
                if (board.squares[cell.getRow() - 1][cell.getCol()] === " ") {
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
                if (board.squares[next.getRow()][next.getCol()] !== " ") {
                    break;
                }
            } else {
                break;
            }
        }
    }
};

export const checkEnPassant = (
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
            return board.squares[location.getRow() + 1][location.getCol() - 1] === "P";
        } else {
            return board.squares[location.getRow() + 1][location.getCol() + 1] === "P";
        }
    } else {
        if (side === "k") {
            return board.squares[location.getRow() - 1][location.getCol() - 1] === "p";
        } else {
            return board.squares[location.getRow() - 1][location.getCol() + 1] === "p";
        }
    }
};

