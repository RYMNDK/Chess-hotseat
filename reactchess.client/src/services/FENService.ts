import { Chessboard } from "../types/chessType.ts";

export const parseFEN = (fen: string): Chessboard => {
    const [
        piecePlacement,
        activeColor,
        castlingAvailability,
        enPassantTarget,
        halfmoveClock,
        fullmoveNumber,
    ] = fen.split(" ");

    const chessboard: string[][] = Array.from({ length: 8 }, () =>
        Array(8).fill(" ")
    );

    const rows = piecePlacement.split("/");
    for (let rowIdx = 0; rowIdx < rows.length; rowIdx++) {
        let colIdx = 0;
        for (const char of rows[rowIdx]) {
            if (isNaN(Number(char))) {
                chessboard[rowIdx][colIdx] = char;
                colIdx += 1;
            } else {
                colIdx += Number(char);
            }
        }
    }

    return <Chessboard>{
        board: chessboard,
        activeColor,
        castlingAvailability,
        enPassantTarget,
        halfmoveClock: Number(halfmoveClock),
        fullmoveNumber: Number(fullmoveNumber),
    };
};

export const genFEN = (gameState: Chessboard): string => {
    const {
        board: chessboard,
        activeColor,
        castlingAvailability,
        enPassantTarget,
        halfmoveClock,
        fullmoveNumber,
    } = gameState;

    const piecePlacement = chessboard
        .map((row) => {
            let resultRow = "";
            let emptyCount = 0;

            for (const square of row) {
                if (square === " ") {
                    emptyCount++;
                } else {
                    if (emptyCount > 0) {
                        resultRow += emptyCount;
                        emptyCount = 0;
                    }
                    resultRow += square;
                }
            }

            if (emptyCount > 0) {
                resultRow += emptyCount;
            }

            return resultRow;
        })
        .join("/");

    const activeColorFEN = activeColor;
    const castlingFEN =
        castlingAvailability !== "" ? castlingAvailability : "-";
    const enPassantFEN = enPassantTarget !== "" ? enPassantTarget : "-";
    const halfmoveFEN = Math.floor(halfmoveClock).toString();
    const fullmoveFEN = Math.floor(fullmoveNumber).toString();

    return `${piecePlacement} ${activeColorFEN} ${castlingFEN} ${enPassantFEN} ${halfmoveFEN} ${fullmoveFEN}`;
};


// todo: check FEN validity
// todo: check board validity