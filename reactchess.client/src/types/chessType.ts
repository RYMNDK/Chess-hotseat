export class Cell {
    private row: number;
    private col: number;
    private piece: string;

    public static letters: string = "abcdefgh";

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
        return board[this.row][this.col];
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
            board[other.row][other.col] === " " ||
            !(
                (isUpperCase(this.piece) &&
                    isUpperCase(board[other.row][other.col])) ||
                (isLowerCase(this.piece) &&
                    isLowerCase(board[other.row][other.col]))
            )
        );

        // edge case: Thinking about it.
    }

    equals(other: Cell | null): boolean {
        return other?.row === this.row && other?.col === this.col;
    }

    // from A1 to H8
    toString(): string {
        return `${Cell.letters[this.col]}${8 - this.row}`;
    }
}

export type Action =
    | RenderAction
    | CheckAction
    | UndoMoveAction
    | ClearBoardAction;

// moves that should be rendered in history
export type RenderAction = MovePieceAction | CastleAction;

export interface MovePieceAction {
    type: "MOVE_PIECE";
    payload: {
        from: Cell;
        to: Cell;
        denote: string | null;
    };
}

export interface CastleAction {
    type: "CASTLE_ACTION";
    payload: {
        color: string;
        side: string;
        denote: string | null;
    };
}

interface UndoMoveAction {
    type: "UNDO_MOVE";
}
interface CheckAction {
    type: "CHECK_ACTION";
}
interface ClearBoardAction {
    type: "CLEAR_BOARD";
}
export type Hand = Cell | null;

export interface ChessGameState {
    chessboard: Chessboard;
    activeColor: string;
    castlingAvailability: string;
    enPassantTarget: string;
    halfmoveClock: number;
    fullmoveNumber: number;
}

export type Chessboard = string[][];

export type Direction = {
    col: number;
    row: number;
};
