import { expect, test } from 'vitest'
import {parseFEN} from "../services/FENService.ts";
import {Chessboard, GameData} from "../types/chessType.ts";
import {resolveAction} from "../services/actionService.ts";
import {SetBoardFromFEN} from "../types/actionType.ts";
import {recalculateBoardHelper} from "../services/boardHelperService.ts";
import {getAllMoves, getCell} from "../services/gameService.ts";
import {Cell} from "../types/cell.ts";

test("action Service - set up new game from FEN", () => {
    // arrange
    const oldGameStateFEN: string = "8/8/8/8/8/8/8/8 w - - 0 1";
    const newGameStateFEN: string = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
    const oldGameState: Chessboard = parseFEN(oldGameStateFEN);
    const newGameState: Chessboard = parseFEN(newGameStateFEN);
    const gameMessage = "Setup board from testing"
    const setupAction: SetBoardFromFEN = {
        type: "SET_BOARD_FROM_FEN",
        payload: {
            message: gameMessage,
            FEN: newGameStateFEN
        }
    };

    // act
    const result:GameData = resolveAction(oldGameState, setupAction);

    // assert
    expect(result).toStrictEqual({
        gameState: newGameState,
        message: gameMessage,
        status: "",
        helper: recalculateBoardHelper(newGameState)
    });
});

test("test recalculateBoardHelper", () => {
    // arrange
    const gameStateFEN: string = "k7/8/8/8/8/8/8/7K w - - 0 1";
    const gameState: Chessboard = parseFEN(gameStateFEN);

    // act
    const result = recalculateBoardHelper(gameState);

    // assert
    expect(result).toStrictEqual({
        bk: getCell("a8"),
        wk: getCell("h1"),
        moves: getAllMoves(gameState)
    });
});

// more descriptive test names
test("test getAllMoves", () => {
    // arrange
    const gameStateFEN: string = "k7/8/8/8/8/8/8/7K w - - 0 1";
    const gameState: Chessboard = parseFEN(gameStateFEN);

    // act
    const result = recalculateBoardHelper(gameState);

    // assert
    expect(result).toStrictEqual({
    });
});

// edge case: all moves will include illegal moves, those moves are filtered AFTER a piece is picked up

test("test getCell", () => {
    // arrange
    const letter = "e3";

    // act
    const result = getCell(letter);

    // assert
    expect(result).toStrictEqual(new Cell(4, 5));
});

// todo: end to end testing