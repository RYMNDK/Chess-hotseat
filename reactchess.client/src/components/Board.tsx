import { useReducer, useState } from "react";
import "./Board.css";
import Piece from "./Piece";

type ChessBoard = string[][];

class Cell {
    private row: number;
    private col: number;

    constructor(row: number, col: number) {
        this.row = row;
        this.col = col;
    }

    remove(board: ChessBoard): void {
        board[this.row][this.col] = " ";
    }

    assign(board: ChessBoard, piece: string): void {
        board[this.row][this.col] = piece;
    }

    piece(board: ChessBoard): string {
        return board[this.row][this.col];
    }

    equals(other: Cell | null): boolean {
        return other?.row === this.row && other?.col === this.col;
    }

    toString(): string {
        return `${this.row}|${this.col}`;
    }
}

const reduceBoard = (prevState: ChessBoard, action: Action): ChessBoard => {
    switch (action.type) {
        case "MOVE_PIECE":
            action.payload.from.remove(prevState);
            action.payload.to.assign(prevState, action.payload.piece);
            return prevState;
        default:
            return prevState;
    }
};

type Action = MovePieceAction;
interface MovePieceAction {
    type: "MOVE_PIECE";
    payload: {
        piece: string;
        from: Cell;
        to: Cell;
    };
}

// string works, but better if use color and piece
type Hand = { cell: Cell; piece: string };

// change this to FEN String, parse before set up board
interface BoardProps {
    boardSetup: ChessBoard;
    updateMoveList: React.Dispatch<Action>;
}
const Board: React.FC<BoardProps> = ({ boardSetup, updateMoveList }) => {
    const [board, updateBoard] = useReducer(reduceBoard, boardSetup); // initial should be set to initialSetup
    const [hand, setHand] = useState<Hand | null>(null);
    // list of available moves here, array of cells

    // handle board click
    const onBoardClick = (location: Cell): void => {
        if (!hand && location.piece(board) !== " ") {
            // show potential moves here
            setHand({ cell: location, piece: location.piece(board) }); // highlight the piece
        } else if (hand) {
            // move validation goes here
            const action: Action = {
                type: "MOVE_PIECE",
                payload: { piece: hand.piece, from: hand.cell, to: location },
            };
            // add the move to the game state
            updateMoveList(action);
            // move the piece and clear hand
            updateBoard(action);

            setHand(null);
        } else {
            setHand(null); // unhighlight the piece
        }
    };
    return (
        <div className="board">
            {board.map((row, rowIndex) => (
                <div key={rowIndex} className="chess-row">
                    {row.map((piece: string, colIndex: number) => (
                        <div
                            key={`${rowIndex}-${colIndex}`}
                            onClick={() =>
                                onBoardClick(new Cell(rowIndex, colIndex))
                            }
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
                                isSelected={
                                    hand?.cell.equals(
                                        new Cell(rowIndex, colIndex)
                                    ) ?? false
                                }
                            />
                        </div>
                    ))}
                </div>
            ))}

            {/* <button onClick={updateMoveList}>Click me</button> */}
        </div>
    );
};

export default Board;
