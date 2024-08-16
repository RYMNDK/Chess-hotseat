import {Chessboard} from "./chessType.ts";
import {getPiece} from "../services/gameService.ts";

export class Cell {
    private readonly row: number;
    private readonly col: number;

    public static readonly letters: string = "abcdefgh";

    // map the cell from table to array
    constructor(col: number, row: number) {
        this.col = col;
        this.row = row;
    }

    getRow(): number {
        return this.row;
    }
    getCol(): number {
        return this.col;
    }

    getPieceFromBoard(gameState: Chessboard): string {
        return gameState.board[this.row][this.col];
    }

    // return true if the other cell is empty or different color piece
    canMove(gameState: Chessboard, other: Cell): boolean {
        // if the other cell is not on the board then false.
        // todo: board bound check
        if (other.col < 0 || other.col > 7 || other.row < 0 || other.row > 7) {
            return false;
        }

        // moving onto your own piece is not allowed
        // todo: color review
        const isUpperCase = (char: string) => char >= "A" && char <= "Z";
        const isLowerCase = (char: string) => char >= "a" && char <= "z";

        const otherPiece = getPiece(gameState, other);
        const thisPiece = this.getPieceFromBoard(gameState);
        return (
            otherPiece === " " ||
            !(
                (isUpperCase(thisPiece) && isUpperCase(otherPiece) ||
                (isLowerCase(thisPiece) && isLowerCase(otherPiece))
            ))
        );
    }

    equals(other: Cell | null): boolean {
        return other?.row === this.row && other?.col === this.col;
    }

    // from a1 to h8
    toString(): string {
        return `${Cell.letters[this.col]}${8 - this.row}`;
    }

    // check if this piece is the right color as the active player
    isRightColor(gameState:Chessboard, activePlayer: ("w"|"b")): boolean {
        // todo: color review
        const thisPiece = this.getPieceFromBoard(gameState);
        return thisPiece >= "A" && thisPiece <= "Z"
            ? activePlayer === "w"
            : activePlayer === "b";
    }

    // edge case: Thinking about it.

}
