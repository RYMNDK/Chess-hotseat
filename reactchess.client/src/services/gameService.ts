import { Cell } from "../types/cell.ts";
import {Chessboard} from "../types/chessType.ts";

import {getAvailableMoves, illegalMoveFilter} from "./actionService.ts";
import {boardHelper} from "../types/boardHelperType.ts";

// todo: pack pieces into objects so we have board and piece on top of board
// todo: draws are not included
// todo: cache potential action and gamestate after move
// todo: advanced available moves calculation

// convert string to cell a1 to h8
export const getCell = (location: string): Cell =>
    new Cell(
        location.charCodeAt(0) - "a".charCodeAt(0),
        8 - (location[1].charCodeAt(0) - "0".charCodeAt(0))
    );

export const getPiece = (gameState: Chessboard, location: Cell): string => location.getPieceFromBoard(gameState);

// get new piece for pawn promotion
export const getNewPiece = (): string => {
    let piece;
    do {
        piece = prompt("Enter one of q, b, r, n:") || "";
    } while (!["q", "b", "r", "n"].includes(piece));
    return piece;
};

// get all available moves for all pieces of the board (a move could be still be illegal)
export const getAllMoves = (gameState:Chessboard): { [key: string]: Cell[] } => {
    const moves: { [key: string]: Cell[] } = { };

    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            if (gameState.board[row][col] !== " ") {
                const cell:Cell = new Cell(col, row);
                moves[cell.toString()] = getAvailableMoves(gameState, cell, {
                    moves: {},
                    wk: getCell("i9"),
                    bk: getCell("i9")
                });
            }
        }
    }

    return moves;
}

export const isCheck = (gameState: Chessboard, movesAvailable: boardHelper): boolean => {
    // turn is already swapped so check if current player's king is in check
    // todo: color review
    const turnPlayerKing = gameState.activeColor === "w" ? movesAvailable.wk: movesAvailable.bk;

    for (const square in movesAvailable.moves) {
        if (Object.prototype.hasOwnProperty.call(movesAvailable.moves, square)) {
            // console.log(`Key: ${square}, Piece: ${getCell(square).getPieceFromBoard(gameState)}, Value: ${movesAvailable.moves[square]}`);
            // todo: check only opposite color, double check (++)
            // short circuit until we add in double check.
            if (movesAvailable.moves[square].some((cell) => cell.equals(turnPlayerKing))) {
                // I HATE PAWNS. pawn does not capture forward but capture diagonal
                // we don't need to check that because invalid moves are already filtered
                return true;
            }
        }
    }
    return false;
}

export const isCheckMate = (gameState: Chessboard, movesAvailable: boardHelper) => {
    // todo: color review
    const turnPlayerKing = gameState.activeColor === "w" ? movesAvailable.wk: movesAvailable.bk;
    return (illegalMoveFilter(gameState, turnPlayerKing, movesAvailable, movesAvailable.moves[turnPlayerKing.toString()]).length === 0);
}

