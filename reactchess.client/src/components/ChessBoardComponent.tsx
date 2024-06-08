import { useState, useEffect } from "react";
type Chessboard = string[][];

interface ChessGameState {
    chessboard: Chessboard;
    activeColor: string;
    castlingAvailability: string;
    enPassantTarget: string;
    halfmoveClock: number;
    fullmoveNumber: number;
}

const parseFEN = (fen: string): ChessGameState => {
    const [
        piecePlacement,
        activeColor,
        castlingAvailability,
        enPassantTarget,
        halfmoveClock,
        fullmoveNumber,
    ] = fen.split(" ");

    const chessboard: Chessboard = Array.from({ length: 8 }, () =>
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

    return {
        chessboard,
        activeColor,
        castlingAvailability,
        enPassantTarget,
        halfmoveClock: Number(halfmoveClock),
        fullmoveNumber: Number(fullmoveNumber),
    };
};

const ChessBoardComponent: React.FC = () => {
    const [chessboard, setChessboard] = useState<Chessboard>(
        Array.from({ length: 8 }, () => Array(8).fill(" "))
    );
    const [activeColor, setActiveColor] = useState<string>("w");
    const [castlingAvailability, setCastlingAvailability] =
        useState<string>("");
    const [enPassantTarget, setEnPassantTarget] = useState<string>("");
    const [halfmoveClock, setHalfmoveClock] = useState<number>(0);
    const [fullmoveNumber, setFullmoveNumber] = useState<number>(1);

    useEffect(() => {
        const fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
        const gameState = parseFEN(fen);

        setChessboard(gameState.chessboard);
        setActiveColor(gameState.activeColor);
        setCastlingAvailability(gameState.castlingAvailability);
        setEnPassantTarget(gameState.enPassantTarget);
        setHalfmoveClock(gameState.halfmoveClock);
        setFullmoveNumber(gameState.fullmoveNumber);
    }, []);

    return (
        <div>
            <div>Active Color: {activeColor}</div>
            <div>Castling Availability: {castlingAvailability}</div>
            <div>En Passant Target: {enPassantTarget}</div>
            <div>Halfmove Clock: {halfmoveClock}</div>
            <div>Fullmove Number: {fullmoveNumber}</div>
            <div>
                {chessboard.map((row, rowIndex) => (
                    <div key={rowIndex} style={{ display: "flex" }}>
                        {row.map((square, colIndex) => (
                            <div
                                key={colIndex}
                                style={{
                                    width: "30px",
                                    height: "30px",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    border: "1px solid black",
                                }}
                            >
                                {square}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ChessBoardComponent;
