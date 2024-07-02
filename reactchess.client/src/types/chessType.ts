import { Cell } from "./cell";

export interface Chessboard {
    squares: string[][]; // 8x8 array with pieces represented as strings
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

export type Direction = {
    col: number;
    row: number;
};
