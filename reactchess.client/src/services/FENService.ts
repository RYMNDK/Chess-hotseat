import {Chessboard, ChessGameState} from "../types/chessType.ts";

export const parseFEN = (fen: string): ChessGameState => {
    const [
        piecePlacement,
        activeColor,
        castlingAvailability,
        enPassantTarget,
        halfmoveClock,
        fullmoveNumber,
    ] = fen.split(" ");

    const chessboard: Chessboard = { squares:
        Array.from({length: 8}, () =>
            Array(8).fill(" ")
        )
    }

    const rows = piecePlacement.split("/");
    for (let rowIdx = 0; rowIdx < rows.length; rowIdx++) {
        let colIdx = 0;
        for (const char of rows[rowIdx]) {
            if (isNaN(Number(char))) {
                chessboard.squares[rowIdx][colIdx] = char;
                colIdx += 1;
            } else {
                colIdx += Number(char);
            }
        }
    }

    return {
        chessboard,
        activeColor,
        castlingAvailability,
        enPassantTarget,
        halfmoveClock: Number(halfmoveClock),
        fullmoveNumber: Number(fullmoveNumber),
    };
};

export const genFEN = (gameState: ChessGameState): string => {
    console.log("Initial chess game state:", gameState);
    const { chessboard, activeColor, castlingAvailability, enPassantTarget, halfmoveClock, fullmoveNumber } = gameState;

    // Convert board state to FEN piece placement
    const piecePlacement = chessboard.squares.map(row => {
        let emptyCount = 0;
        let resultRow = row.map(square => {
            if (square === '') {
                emptyCount++;
                return '';  // Do not add anything to the string yet
            } else {
                const piece = (emptyCount > 0 ? emptyCount.toString() : '') + square; // Append the count before the piece if needed
                emptyCount = 0; // Reset empty count
                return piece;
            }
        }).join(''); // Join all pieces and numbers within the row

        if (emptyCount > 0) {
            resultRow += emptyCount.toString(); // Append any remaining empty squares at the end of the row
        }
        return resultRow;
    }).join('/'); // Join all rows with '/'

    const activeColorFEN = activeColor;
    const castlingFEN = castlingAvailability !== '' ? castlingAvailability : '-';
    const enPassantFEN = enPassantTarget !== '' ? enPassantTarget : '-';
    const halfmoveFEN = halfmoveClock.toString();
    const fullmoveFEN = fullmoveNumber.toString();

    // Combine all parts to form the FEN string
    const FEN = `${piecePlacement} ${activeColorFEN} ${castlingFEN} ${enPassantFEN} ${halfmoveFEN} ${fullmoveFEN}`;

    console.log("Generated FEN:", FEN);
    return FEN;
};