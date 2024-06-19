import { Cell } from "./cell";

// moves that should be rendered in history
export type RenderAction = MovePieceAction | CastleAction | EnPassantAction;

export type Action =
    | RenderAction
    | CheckAction
    | UndoMoveAction
    | ClearBoardAction;

export interface MovePieceAction {
    type: "MOVE_PIECE";
    payload: {
        from: Cell;
        to: Cell;
        denote: string;
    };
}

export interface CastleAction {
    type: "CASTLE_ACTION";
    payload: {
        isWhite: boolean;
        side: string;
        denote: string;
    };
}
export interface EnPassantAction {
    type: "EN_PASSANT_ACTION";
    payload: {
        isWhite: boolean;
        from: Cell;
        to: Cell;
        denote: string;
    };
}

interface CheckAction {
    type: "CHECK_ACTION";
}

interface UndoMoveAction {
    type: "UNDO_MOVE";
}
interface ClearBoardAction {
    type: "CLEAR_BOARD";
}
