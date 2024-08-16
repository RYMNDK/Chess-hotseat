import { expect, test } from 'vitest'
import {genFEN, parseFEN} from "../services/FENService.ts";
import {Chessboard} from "../types/chessType.ts";

// Test parse game state from fen, assert correct game state
test("FEN service - FEN to gameState - New Game", () => {
    expect(parseFEN("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1")).toStrictEqual({
        "activeColor": "w",
        "board": [
            ["r", "n", "b", "q", "k", "b", "n", "r"],
            ["p", "p", "p", "p", "p", "p", "p", "p"],
            [" ", " ", " ", " ", " ", " ", " ", " "],
            [" ", " ", " ", " ", " ", " ", " ", " "],
            [" ", " ", " ", " ", " ", " ", " ", " "],
            [" ", " ", " ", " ", " ", " ", " ", " "],
            ["P", "P", "P", "P", "P", "P", "P", "P"],
            ["R", "N", "B", "Q", "K", "B", "N", "R"]
        ],
        "castlingAvailability": "KQkq",
        "enPassantTarget": "-",
        "fullmoveNumber": 1,
        "halfmoveClock": 0,
    });
});

// Test pack game state to FEN, assert correct FEN
test("FEN service - gameState to FEN - new game", () => {
    expect(genFEN({
        "activeColor": "w",
        "board": [
            ["r", "n", "b", "q", "k", "b", "n", "r"],
            ["p", "p", "p", "p", "p", "p", "p", "p"],
            [" ", " ", " ", " ", " ", " ", " ", " "],
            [" ", " ", " ", " ", " ", " ", " ", " "],
            [" ", " ", " ", " ", " ", " ", " ", " "],
            [" ", " ", " ", " ", " ", " ", " ", " "],
            ["P", "P", "P", "P", "P", "P", "P", "P"],
            ["R", "N", "B", "Q", "K", "B", "N", "R"]
        ],
        "castlingAvailability": "KQkq",
        "enPassantTarget": "-",
        "fullmoveNumber": 1,
        "halfmoveClock": 0,
    })).toBe("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
});


// Test FEN random position using: http://bernd.bplaced.net/fengenerator/fengenerator.html
// Assert same FEN after parsing then packing.
test("FEN service - random position", () => {
    const position = "2NQ2R1/1kpP4/1pp3K1/8/3nn3/3q4/2Bp2P1/2B5 w - - 0 1";
    expect(genFEN(parseFEN(position))).toBe(position);
});

// All further tests are based on positions set by a FEN, do a few more tests
test("FEN service - random position FEN to gameState 1", () => {
    const position = "6R1/1p2r2p/7b/p6p/P3n3/n2p1P2/5r1B/K6k w - - 0 1";
    const gameState: Chessboard = {
        "activeColor": "w",
        "board": [
            [" ", " ", " ", " ", " ", " ", "R", " "],
            [" ", "p", " ", " ", "r", " ", " ", "p"],
            [" ", " ", " ", " ", " ", " ", " ", "b"],
            ["p", " ", " ", " ", " ", " ", " ", "p"],
            ["P", " ", " ", " ", "n", " ", " ", " "],
            ["n", " ", " ", "p", " ", "P", " ", " "],
            [" ", " ", " ", " ", " ", "r", " ", "B"],
            ["K", " ", " ", " ", " ", " ", " ", "k"]
        ],
        "castlingAvailability": "-",
        "enPassantTarget": "-",
        "fullmoveNumber": 1,
        "halfmoveClock": 0,
    }
    expect(parseFEN(position)).toStrictEqual(gameState);
});

// slightly modified board position from Chess.com FEN page
test("FEN service - random position FEN to gameState 2", () => {
    const position = "r1b1k2r/p2pBpNp/n4n2/1p1NP2P/6P1/3P4/P1P1K3/q5b1 b kq g3 0 1";
    const gameState: Chessboard = {
        "activeColor": "b",
        "board": [
            ["r", " ", "b", " ", "k", " ", " ", "r"],
            ["p", " ", " ", "p", "B", "p", "N", "p"],
            ["n", " ", " ", " ", " ", "n", " ", " "],
            [" ", "p", " ", "N", "P", " ", " ", "P"],
            [" ", " ", " ", " ", " ", " ", "P", " "],
            [" ", " ", " ", "P", " ", " ", " ", " "],
            ["P", " ", "P", " ", "K", " ", " ", " "],
            ["q", " ", " ", " ", " ", " ", "b", " "]
        ],
        "castlingAvailability": "kq",
        "enPassantTarget": "g3",
        "fullmoveNumber": 1,
        "halfmoveClock": 0,
    }
    expect(parseFEN(position)).toStrictEqual(gameState);
});