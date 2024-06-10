export class Cell {
    private row: number;
    private col: number;

    constructor(row: number, col: number) {
        this.row = row;
        this.col = col;
    }

    remove(board: ChessBoard): void {
        board[this.row][this.col] = " ";
    }

    assign(board: ChessBoard, piece: string): void {
        board[this.row][this.col] = piece;
    }

    piece(board: ChessBoard): string {
        return board[this.row][this.col];
    }

    equals(other: Cell | null): boolean {
        return other?.row === this.row && other?.col === this.col;
    }

    toString(): string {
        return `${this.row}|${this.col}`;
    }
}

export type ChessBoard = string[][];

export type Action = MovePieceAction | UndoPieceAction;
interface MovePieceAction {
    type: "MOVE_PIECE";
    payload: {
        piece: string;
        from: Cell;
        to: Cell;
    };
}
interface UndoPieceAction {
    type: "UNDO_PIECE";
}
