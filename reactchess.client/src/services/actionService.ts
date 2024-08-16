
import {Cell} from "../types/cell.ts";
import {Chessboard, Direction, GameData,} from "../types/chessType.ts";
import {boardHelper} from "../types/boardHelperType.ts";
import {getCell, getNewPiece, isCheck, isCheckMate} from "./gameService.ts";
import {Action, EmptyAction, RenderAction} from "../types/actionType.ts";
import {parseFEN} from "./FENService.ts";
import {renderMap} from "./renderService.ts";
import {recalculateBoardHelper} from "./boardHelperService.ts";

// todo: make this return all legal moves
// todo: review color checking

// this returns all available moves, NOT ALL moves are legal so another filter is needed
export const getAvailableMoves = (gameState: Chessboard, cell: Cell,
                                  // cache the available moves
                                  boardHelperCache: boardHelper): Cell[] => {
    let availableCells: Cell[] = [];
    const piece = cell.getPieceFromBoard(gameState);

    // reading from cache
    if (Object.prototype.hasOwnProperty.call(boardHelperCache.moves, cell.toString())) {
        availableCells = boardHelperCache.moves[cell.toString()];

        // console.log(cell.toString() + " moves (cached)", boardHelperCache.moves[cell.toString()].map((cell)=> cell.toString()));
    }
    else {
        // calculate all moves of this piece manually
        switch (piece.toUpperCase()) {
            case "K":
                availableCells.push(
                    new Cell(cell.getCol() + 1, cell.getRow() + 1)
                );
                availableCells.push(
                    new Cell(cell.getCol() + 1, cell.getRow())
                );
                availableCells.push(
                    new Cell(cell.getCol() + 1, cell.getRow() - 1)
                );
                availableCells.push(
                    new Cell(cell.getCol(), cell.getRow() - 1)
                );
                availableCells.push(
                    new Cell(cell.getCol(), cell.getRow() + 1)
                );
                availableCells.push(
                    new Cell(cell.getCol() - 1, cell.getRow() + 1)
                );
                availableCells.push(
                    new Cell(cell.getCol() - 1, cell.getRow())
                );
                availableCells.push(
                    new Cell(cell.getCol() - 1, cell.getRow() - 1)
                );

                availableCells = availableCells.filter((other) =>
                    cell.canMove(gameState, other)
                );

                // castle, just check all spaces are free.
                if (piece === "K" && gameState.castlingAvailability.includes("K") &&
                    gameState.board[7][4] === "K" && gameState.board[7][5] === " " && gameState.board[7][6] === " " && gameState.board[7][7] === "R") {
                    availableCells.push(new Cell(6, 7));
                } else if (piece === "k" && gameState.castlingAvailability.includes("k") &&
                    gameState.board[0][4] === "k" && gameState.board[0][5] === " " && gameState.board[0][6] === " " && gameState.board[0][7] === "r") {
                    availableCells.push(new Cell(6, 0));
                }
                if (piece === "K" && gameState.castlingAvailability.includes("Q") &&
                    gameState.board[7][0] === "R" && gameState.board[7][1] === " " && gameState.board[7][2] === " " && gameState.board[7][3] === " " && gameState.board[7][4] === "K") {
                    availableCells.push(new Cell(2, 7));
                } else if (piece === "k" && gameState.castlingAvailability.includes("q") &&
                    gameState.board[0][0] === "r" && gameState.board[0][1] === " " && gameState.board[0][2] === " " && gameState.board[0][3] === " " && gameState.board[0][4] === "k") {
                    availableCells.push(
                        new Cell(2, 0)
                    );
                }
                break;
            case "N":
                availableCells.push(
                    new Cell(cell.getCol() + 1, cell.getRow() + 2)
                );
                availableCells.push(
                    new Cell(cell.getCol() + 2, cell.getRow() + 1)
                );
                availableCells.push(
                    new Cell(cell.getCol() + 1, cell.getRow() - 2)
                );
                availableCells.push(
                    new Cell(cell.getCol() + 2, cell.getRow() - 1)
                );
                availableCells.push(
                    new Cell(cell.getCol() - 1, cell.getRow() + 2)
                );
                availableCells.push(
                    new Cell(cell.getCol() - 2, cell.getRow() + 1)
                );
                availableCells.push(
                    new Cell(cell.getCol() - 1, cell.getRow() - 2)
                );
                availableCells.push(
                    new Cell(cell.getCol() - 2, cell.getRow() - 1)
                );

                availableCells = availableCells.filter((other) =>
                    cell.canMove(gameState, other)
                );
                break;
            case "R": {
                const directions: { [key: string]: Direction } = {
                    U: {col: 0, row: -1},
                    D: {col: 0, row: 1},
                    L: {col: 1, row: 0},
                    R: {col: -1, row: 0},
                };
                availableCells = moveInDirections(directions, cell, gameState, availableCells);
                break;
            }
            case "B": {
                const directions: { [key: string]: Direction } = {
                    UL: {col: -1, row: -1},
                    UR: {col: 1, row: -1},
                    DL: {col: -1, row: 1},
                    DR: {col: 1, row: 1},
                };
                availableCells = moveInDirections(directions, cell, gameState, availableCells);
                break;
            }
            case "Q": {
                const directions: { [key: string]: Direction } = {
                    U: {col: 0, row: -1},
                    D: {col: 0, row: 1},
                    L: {col: 1, row: 0},
                    R: {col: -1, row: 0},
                    UL: {col: -1, row: -1},
                    UR: {col: 1, row: -1},
                    DL: {col: -1, row: 1},
                    DR: {col: 1, row: 1},
                };
                availableCells = moveInDirections(directions, cell, gameState, availableCells);
                break;
            }
            default: {
                if (piece === "p") {
                    if (
                        cell.getRow() === 1 &&
                        gameState.board[cell.getRow() + 2][cell.getCol()] === " "
                    ) {
                        availableCells.push(
                            new Cell(cell.getCol(), cell.getRow() + 2)
                        );
                    }
                    if (gameState.board[cell.getRow() + 1][cell.getCol() + 1] !== " ") {
                        availableCells.push(
                            new Cell(cell.getCol() + 1, cell.getRow() + 1)
                        );
                    }
                    if (gameState.board[cell.getRow() + 1][cell.getCol() - 1] !== " ") {
                        availableCells.push(
                            new Cell(cell.getCol() - 1, cell.getRow() + 1)
                        );
                    }
                    if (gameState.board[cell.getRow() + 1][cell.getCol()] === " ") {
                        availableCells.push(
                            new Cell(cell.getCol(), cell.getRow() + 1)
                        );
                    }
                }
                else if (piece === "P") {
                    if (
                        cell.getRow() === 6 &&
                        gameState.board[cell.getRow() - 2][cell.getCol()] === " "
                    ) {
                        availableCells.push(
                            new Cell(cell.getCol(), cell.getRow() - 2)
                        );
                    }
                    if (gameState.board[cell.getRow() - 1][cell.getCol() + 1] !== " ") {
                        availableCells.push(
                            new Cell(cell.getCol() + 1, cell.getRow() - 1)
                        );
                    }
                    if (gameState.board[cell.getRow() - 1][cell.getCol() - 1] !== " ") {
                        availableCells.push(
                            new Cell(cell.getCol() - 1, cell.getRow() - 1)
                        );
                    }
                    if (gameState.board[cell.getRow() - 1][cell.getCol()] === " ") {
                        availableCells.push(
                            new Cell(cell.getCol(), cell.getRow() - 1)
                        );
                    }
                }

                availableCells = availableCells.filter((other) =>
                    cell.canMove(gameState, other)
                );

                // todo: this can be optimized
                if (gameState.enPassantTarget !== "-") {
                    const enPassant: Cell = getCell(gameState.enPassantTarget);
                    if (piece === "P" && cell.getRow() === 3 &&
                        (cell.getCol() === enPassant.getCol() - 1 || cell.getCol() === enPassant.getCol() + 1)) {
                        availableCells.push(enPassant);
                    } else if (piece === "p" && cell.getRow() === 4 &&
                        (cell.getCol() === enPassant.getCol() - 1 || cell.getCol() === enPassant.getCol() + 1)) {
                        availableCells.push(enPassant);
                    }

                }
            }
        }

        // console.log(cell.toString() + " moves (NOT cached)", availableCells.map((cell)=> cell.toString()));
    }

    return availableCells;

}

// get available move for that moves in a straight line (R B and Q)
const moveInDirections = (directions: { [p: string]: Direction }, cell: Cell, gameState:Chessboard, availableCells: Cell[]): Cell[] => {
    for (const direction in directions) {
        const { col: dCol, row: dRow } = directions[direction];
        for (let i = 1; i <= 7; i++) {
            const next = new Cell(
                cell.getCol() + i * dCol,
                cell.getRow() + i * dRow
            );

            if (cell.canMove(gameState, next)) {
                availableCells.push(next);
                if (gameState.board[next.getRow()][next.getCol()] !== " ") {
                    break;
                }
            } else {
                break;
            }
        }
    }

    return availableCells;
};

// This get the Action after clicking the board destination
export const getAction = (gameState:Chessboard, hand:Cell, location:Cell): RenderAction|EmptyAction => {
    // return empty action on invalid action
    if (hand.getPieceFromBoard(gameState).toUpperCase() === "K") {
        if (hand.getRow() === 7 && location.getRow() === 7 &&
            ((gameState.castlingAvailability.includes("K") && location.getCol() === 6) ||
                (gameState.castlingAvailability.includes("Q") && location.getCol() === 2))) {
            return {
                type: "CASTLE_ACTION",
                payload: {
                    target: location
                },
            }
        }
        if (hand.getRow() === 0 && location.getRow() === 0 &&
            ((gameState.castlingAvailability.includes("k") && location.getCol() === 6) ||
                (gameState.castlingAvailability.includes("q") && location.getCol() === 2))) {
            return {
                type: "CASTLE_ACTION",
                payload: {
                    target: location
                },
            }
        }

        // normal king move
        return {
            type: "MOVE_PIECE",
            payload: {
                from: hand,
                target: location
            },
        }
    }
    else if (hand.getPieceFromBoard(gameState).toUpperCase() === "P") {
        // EP
        if (gameState.enPassantTarget === (location.toString())) {
            return {
                type: "EN_PASSANT_ACTION",
                payload: {
                    from: hand,
                    target: location
                }
            }
        }

        // promotion
        if ((hand.getPieceFromBoard(gameState) === "P" && location.getRow() === 0) ||
            (hand.getPieceFromBoard(gameState) === "p" && location.getRow() === 7)) {
            return {
                type: "PROMOTION_ACTION",
                payload: {
                    from: hand,
                    target: new Cell(location.getCol(), location.getRow())
                }
            }
        }
    }

    // consider using advanced move actions
    return {
        type: "MOVE_PIECE",
        payload: {
            from: hand,
            target: location
        },
    }
}

// look ONE step ahead to detect illegal board states
export const illegalMoveFilter = (gameState: Chessboard, cell: Cell, boardHelperCache: boardHelper, availableCells:Cell[]):Cell[] => {
    const legalMoves = availableCells.filter(
        (target) => {
            // todo: we can cache these actions for later
            // copy existing game state, then apply the action
            const oldBoard = gameState.board.map((row: string[]) => row.slice());
            const copyGameState: Chessboard = {... gameState, board: oldBoard }

            let action = getAction(gameState, cell, target)
            if (action.type !== "EMPTY_ACTION") {
                if (action.type === "PROMOTION_ACTION") {
                    // todo: additional testing required
                    // need to test this
                    action = {
                        type: "MOVE_PIECE",
                        payload: {
                            from: cell,
                            target: action.payload.target,
                        }
                    }
                } else if (action.type === "CASTLE_ACTION") {
                    // todo: additional testing required
                    // castle check happens after evaluation of move
                    const isInCheck = isCheck(gameState, boardHelperCache);
                    let moveOne: Cell;
                    switch (action.payload.target.toString()) {
                        case "c1":
                            moveOne = getCell("d1");
                            break;
                        case "g1":
                            moveOne = getCell("f1");
                            break;
                        case "c8":
                            moveOne = getCell("d8");
                            break;
                        case "g8":
                            moveOne = getCell("f8");
                            break;
                    }
                    // cas
                    const isMoveOneLegal = legalMoves.some(cell => cell.equals(moveOne));
                    if (isInCheck && isMoveOneLegal) {
                        return false;
                    }

                    // check the second square
                    action = {
                        type: "MOVE_PIECE",
                        payload: {
                            from: cell,
                            target: action.payload.target,
                        }
                    }
                }

                // apply the action and a boardState is illegal if your king is in check AFTER move
                const possibleState = resolveAction(copyGameState, action);
                // todo: color review!
                // flip back active color
                possibleState.gameState.activeColor = possibleState.gameState.activeColor === "w" ? "b" : "w";
                // console.log(target.toString());
                // console.log("possiblestate", possibleState);
                // console.log("is in check", isincheck);

                return !isCheck(possibleState.gameState, possibleState.helper!);
            }
            return false;
        }
    );

    return legalMoves;
}

// apply action onto gameState
// check updateMoveHelper
export const resolveAction = (gameState:Chessboard, action:Action): GameData => {
    // copy the previous state first
    const oldBoard = gameState.board.map((row: string[]) => row.slice());
    const newState: Chessboard = {... gameState};

    let message = "default message";
    let status = "";

    // validate the action by sending FEN and Action to backend
    // if an action is sent from the backend then it doesn't have to be validated?

    // todo: find better way to restructure the case
    switch (action.type) {
        case "MOVE_PIECE": {
            const ap = action.payload;
            const piece = ap.from.getPieceFromBoard(gameState);
            const isCaptureMove = oldBoard[ap.target.getRow()][ap.target.getCol()] !== " ";
            // updates the game state
            newState.board[ap.target.getRow()][ap.target.getCol()] =
                gameState.board[ap.from.getRow()][ap.from.getCol()];
            newState.board[ap.from.getRow()][ap.from.getCol()] = " ";

            newState.enPassantTarget = "-";
            switch (piece.toUpperCase()) {
                case "K":
                    if (
                        gameState.castlingAvailability.includes("K") &&
                        gameState.castlingAvailability.includes("Q") &&
                        newState.activeColor === "w"
                    ) {
                        newState.castlingAvailability = gameState.castlingAvailability.replace("KQ", "");
                    }
                    else if (
                        gameState.castlingAvailability.includes("k") &&
                        gameState.castlingAvailability.includes("q") &&
                        newState.activeColor === "b"
                    ) {
                        newState.castlingAvailability = gameState.castlingAvailability.replace("kq", "");
                    }
                    break;
                case "R":
                    if (
                        gameState.castlingAvailability.includes("K") &&
                        ap.from.getCol() === 7 &&
                        newState.activeColor === "w"
                    ) {
                        newState.castlingAvailability = gameState.castlingAvailability.replace("K", "");
                    } else if (
                        gameState.castlingAvailability.includes("Q") &&
                        ap.from.getCol() === 0 &&
                        newState.activeColor === "w"
                    ) {
                        newState.castlingAvailability = gameState.castlingAvailability.replace("Q", "");
                    }
                    else if (
                        gameState.castlingAvailability.includes("k") &&
                        ap.from.getCol() === 7 &&
                        newState.activeColor === "b"
                    ) {
                        newState.castlingAvailability = gameState.castlingAvailability.replace("k", "");
                    } else if (
                        gameState.castlingAvailability.includes("q") &&
                        ap.from.getCol() === 0 &&
                        newState.activeColor === "b"
                    ) {
                        newState.castlingAvailability = gameState.castlingAvailability.replace("q", "");
                    }

                    break;
                case "P":
                    if (
                        ap.from.getRow() === 1 &&
                        ap.target.getRow() === 3 &&
                        newState.activeColor === "b"
                    ) {
                        newState.enPassantTarget = new Cell(ap.from.getCol(),2).toString();
                    } else if (
                        ap.from.getRow() === 6 &&
                        ap.target.getRow() === 4 &&
                        newState.activeColor === "w"
                    ) {
                        newState.enPassantTarget = new Cell(ap.from.getCol(),5).toString();
                    }

                    break;
            }

            // swap turn player
            newState.activeColor = gameState.activeColor === "w" ? "b" : "w";

            // increment half move, a player can claim draw after 50 moves of no capture or pawn move
            if (isCaptureMove || piece.toUpperCase() === "P") {
                newState.halfmoveClock = 0;
            } else {
                newState.halfmoveClock += 1;
            }

            // turn number
            newState.fullmoveNumber += 0.5;

            // display a message
            message = `Last move:
                ${piece.toUpperCase() !== "P" ? renderMap(piece) : ""}
                ${ap.from.toString()}${isCaptureMove ? "x" : "-"}${ap.target.toString()}`;

            break;
        }
        case "CASTLE_ACTION": {
            const ap = action.payload;
            if (newState.activeColor === "w") {
                newState.board[7][4] = " ";
                switch (ap.target.getCol()) {
                    case 6:
                        newState.board[7][5] = "R";
                        newState.board[7][6] = "K";
                        newState.board[7][7] = " ";
                        message = "White King Side Castle";
                        break;
                    case 2:
                        newState.board[7][0] = " ";
                        newState.board[7][1] = " ";
                        newState.board[7][2] = "K";
                        newState.board[7][3] = "R";
                        message = "White Queen Side Castle";
                        break;
                }
                newState.castlingAvailability = gameState.castlingAvailability.replace("KQ", "");
            } else {
                newState.board[0][4] = " ";
                switch (ap.target.getCol()) {
                    case 6:
                        newState.board[0][5] = "r";
                        newState.board[0][6] = "k";
                        newState.board[0][7] = " ";
                        message = "Black King Side Castle";
                        break;
                    case 2:
                        newState.board[0][0] = " ";
                        newState.board[0][1] = " ";
                        newState.board[0][2] = "k";
                        newState.board[0][3] = "r";
                        message = "Black Queen Side Castle";
                        break;
                }
                newState.castlingAvailability = gameState.castlingAvailability.replace("kq", "");
            }

            // swap turn player
            newState.activeColor = gameState.activeColor === "w" ? "b" : "w";

            // clear EP target
            newState.enPassantTarget = "-";

            // castle does not capture
            newState.halfmoveClock += 1;

            // turn number
            newState.fullmoveNumber += 0.5;

            break;
        }
        case "EN_PASSANT_ACTION": {
            const ap = action.payload;
            const piece = ap.from.getPieceFromBoard(gameState);

            newState.board[ap.from.getRow()][ap.from.getCol()] = " ";
            newState.board[ap.target.getRow()][ap.target.getCol()] = piece;
            if (newState.activeColor === "w") {
                newState.board[ap.target.getRow() + 1][ap.target.getCol()] = " ";
            } else {
                newState.board[ap.target.getRow() - 1][ap.target.getCol()] = " ";
            }

            message = `Last move: ${ap.from.toString()}x${ap.target.toString()} EP`;

            // swap turn player
            newState.activeColor = gameState.activeColor === "w" ? "b" : "w";

            // clear EP target
            newState.enPassantTarget = "-";

            // EP is both a pawn move AND a capture
            newState.halfmoveClock = 0;

            // turn number
            newState.fullmoveNumber += 0.5;

            break;
        }
        case "PROMOTION_ACTION": {
            const ap = action.payload;
            // todo: check color
            const piece = newState.activeColor === "w" ? getNewPiece().toUpperCase(): getNewPiece();

            newState.board[ap.from.getRow()][ap.from.getCol()] = " ";
            newState.board[ap.target.getRow()][ap.target.getCol()] = piece;

            message = `Last move: ${ap.from.toString()
            }${(oldBoard[ap.target.getRow()][ap.target.getCol()] !== " ") ? "x" : "-"
            }${ap.target.toString()}=${renderMap(piece)}`

            // swap turn player
            newState.activeColor = gameState.activeColor === "w" ? "b" : "w";

            // clear EP target
            newState.enPassantTarget = "-";

            // Promotion is a pawn move
            newState.halfmoveClock = 0;

            // turn number
            newState.fullmoveNumber += 0.5;

            break;
        }
        case "SET_BOARD_FROM_FEN": {
            const ap = action.payload;
            const setState = parseFEN(ap.FEN);

            newState.board = setState.board;
            newState.activeColor = setState.activeColor;
            newState.castlingAvailability = setState.castlingAvailability;
            newState.enPassantTarget = setState.enPassantTarget;
            newState.halfmoveClock = setState.halfmoveClock;
            newState.fullmoveNumber = setState.fullmoveNumber;

            message = ap.message;
            break;
        }
        case "EMPTY_ACTION": {
            const ap = action.payload;
            return { gameState: {...gameState, board: oldBoard}, message: ap.reason, status: "empty action", helper: null}
        }
        default:
            // rollback the board, oldBoard is pass by reference, (should be unreachable)
            return { gameState: {... gameState, board: oldBoard}, message: "unsupported action, rollback board.", status: "bad action", helper: null }
    }

    const updatedMoves = recalculateBoardHelper(newState)

    // todo: this should be exported as a field of its own
    // todo: support double check (++)
    // todo: this is already calculated from filter illegal moves, try to save and read cache
    if (isCheck(newState, updatedMoves)) {
        // todo: check Checkmate (turnplayer's king has no legal move left)
        if (isCheckMate(newState, updatedMoves)) {
            message += "#";
            status = "checkmate";

        }
        else {
            status = "check"
            message += "+";
        }
    }

    // todo: check draws

    // return new state
    return { gameState: newState, message: message, status: status, helper: updatedMoves}
};
