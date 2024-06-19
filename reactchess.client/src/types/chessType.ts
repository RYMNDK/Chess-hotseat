import { Cell } from "./cell";

export type Chessboard = string[][];

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
