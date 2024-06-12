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
    | UndoPieceAction
    | ClearBoardAction;

// moves that should be rendered in history
export type RenderAction = MovePieceAction;

interface MovePieceAction {
    type: "MOVE_PIECE";
    payload: {
        from: Cell;
        to: Cell;
        denote: string | null;
    };
}
interface UndoPieceAction {
    type: "UNDO_PIECE";
}
interface CheckAction {
    type: "CHECK_ACTION";
}
// checkmate, forfeit
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
