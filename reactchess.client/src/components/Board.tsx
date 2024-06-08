import { useReducer, useState } from "react";
import "./Board.css";
import Piece from "./Piece";

type Chessboard = string[][];

const initialBoard: Chessboard = [
    ["r", "n", "b", "q", "k", "b", "n", "r"],
    ["p", "p", "p", "p", "p", "p", "p", "p"],
    [" ", " ", " ", " ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " ", " ", " ", " "],
    ["P", "P", "P", "P", "P", "P", "P", "P"],
    ["R", "N", "B", "Q", "K", "B", "N", "R"],
];

const emptyBoard: Chessboard = Array.from({ length: 8 }, () =>
    Array(8).fill(" ")
);

type Square = {
    row: number;
    col: number;
};
type Move = [Square | null, Square | null];

const Board: React.FC = ({ initialSetup: Chessboard }) => {
    const board: string[][] = initialBoard;
    // const [board, setBoard] = useReducer<String[][]>();
    const [move, setMove] = useState<Move>([null, null]);

    const onBoardClick = (row: number, col: number): void => {
        console.log(`${row}|${col}|${board[row][col]}`);
        setMove([null, null]);
    };
    return (
        <div className="board">
            {board.map((row, rowIndex) => (
                <div key={rowIndex} className="chess-row">
                    {row.map((piece: string, colIndex: number) => (
                        <div
                            key={colIndex}
                            onClick={() => {
                                () => onBoardClick(rowIndex, colIndex);
                            }}
                            className={`chess-square ${
                                (rowIndex + colIndex) % 2 === 0
                                    ? "white"
                                    : "black"
                            }`}
                        >
                            <Piece
                                row={rowIndex}
                                col={colIndex}
                                piece={piece}
                            />
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default Board;
