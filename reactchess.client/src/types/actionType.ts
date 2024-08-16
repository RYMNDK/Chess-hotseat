import { Cell } from "./cell";
import {Chessboard} from "./chessType.ts";

// board actions
// moves that should be rendered in history
export type Action =
    | EmptyAction
    | RenderAction
    | SetBoardFromFEN;

export type RenderAction = MovePieceAction | CastleAction | EnPassantAction | PromotionAction;

export type MovePieceAction = MoveOtherAction;

export interface EmptyAction {
    type: "EMPTY_ACTION";
    payload: {
        reason: string;
    }
}

export interface MoveOtherAction {
    type: "MOVE_PIECE";
    payload: {
        from: Cell;
        target: Cell;
    };
}

export interface CastleAction {
    type: "CASTLE_ACTION";
    payload: {
        target: Cell;
    };
}
export interface EnPassantAction {
    type: "EN_PASSANT_ACTION";
    payload: {
        from: Cell;
        target: Cell;
    };
}

export interface PromotionAction {
    type: "PROMOTION_ACTION";
    payload: {
        from: Cell;
        target: Cell;
    };
}

// support undo, support clear board

export interface SetBoardFromFEN {
    type: "SET_BOARD_FROM_FEN";
    payload: {
        message: string,
        FEN: string
    };
}

// available move types
export type AvailableMoves = SetMovesRecalculateAll ;

export interface SetMovesRecalculateAll {
    type: "SET_MOVES_RECALCULATE_ALL"
    payload: {
        gameState: Chessboard;
    }
}
