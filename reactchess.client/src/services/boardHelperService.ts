
import { Cell } from "../types/cell.ts";
import {Chessboard} from "../types/chessType.ts";
import {boardHelper} from "../types/boardHelperType.ts";
import {getCell} from "./gameService.ts";
import {getAvailableMoves} from "./actionService.ts";

// todo: get finer control of the move calculations

// calculate the board with one scan of the board
export const recalculateBoardHelper = (gameState: Chessboard): boardHelper => {
    const moves: { [p: string]: Cell[] } = { };
    let wk: Cell | null = null;
    let bk: Cell | null = null;

    let i = 0;
    let j = 0;

    while (i < 8) {
        while (j < 8) {
            if (gameState.board[i][j] !== " ") {
                const cell:Cell = new Cell(j, i);
                moves[cell.toString()] = getAvailableMoves(gameState, cell,{
                    moves: {},
                    wk: getCell("i9"),
                    bk: getCell("i9")
                });
                if (gameState.board[i][j] === "K") {
                    wk = cell;
                }
                else if (gameState.board[i][j] === "k") {
                    bk = cell;
                }
            }
            j++;
        }
        j = 0;
        i++;
    }

    return {
        moves, wk: wk!, bk: bk!
    }
}

