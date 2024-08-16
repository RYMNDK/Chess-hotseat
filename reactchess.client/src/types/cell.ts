import { Chessboard } from "./chessType";

export class Cell {
    private readonly row: number;
    private readonly col: number;
    private piece: string;

    public static readonly letters: string = "abcdefgh";

    // map the cell from table to array
    constructor(col: number, row: number, piece: string) {
        this.col = col;
        this.row = row;
        this.piece = piece;
    }

    getRow(): number {
        return this.row;
    }
    getCol(): number {
        return this.col;
    }
    removePiece(): void {
        this.piece = " ";
    }
    assignPiece(piece: string): void {
        this.piece = piece;
    }

    getPiece(): string {
        return this.piece;
    }

    getPieceFromBoard(board: Chessboard): string {
        return board.squares[this.row][this.col];
    }

    canMove(other: Cell, board: Chessboard): boolean {
        // if the other cell is not on the board then false.
        if (other.col < 0 || other.col > 7 || other.row < 0 || other.row > 7) {
            return false;
        }

        // moving onto your own piece is not allowed
        const isUpperCase = (char: string) => char >= "A" && char <= "Z";
        const isLowerCase = (char: string) => char >= "a" && char <= "z";

        return (
            board.squares[other.row][other.col] === " " ||
            !(
                (isUpperCase(this.piece) &&
                    isUpperCase(board.squares[other.row][other.col])) ||
                (isLowerCase(this.piece) &&
                    isLowerCase(board.squares[other.row][other.col]))
            )
        );
    }

    equals(other: Cell | null): boolean {
        return other?.row === this.row && other?.col === this.col;
    }

    // from A1 to H8
    toString(): string {
        return `${Cell.letters[this.col]}${8 - this.row}`;
    }

    // consider moving this to elsewhere
    isRightColor(isWhiteTurn: boolean): boolean {
        return this.piece >= "A" && this.piece <= "Z"
            ? isWhiteTurn
            : !isWhiteTurn;
    }

    // edge case: Thinking about it.
}
