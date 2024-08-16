import { Cell } from "./cell";
import {boardHelper} from "./boardHelperType.ts";

export interface Chessboard {
    board: string[][];
    activeColor: "w"|"b";
    castlingAvailability: string;
    enPassantTarget: string;
    halfmoveClock: number;
    fullmoveNumber: number;
}

export interface GameData {
    gameState: Chessboard,
    message: string,
    status: string,
    helper: boardHelper | null
}

export type Hand = Cell | null;

export type Direction = {
    col: number;
    row: number;
};
