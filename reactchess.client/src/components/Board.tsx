import { Action, Cell, Hand } from "../types/chessType";
import { useReducer, useState } from "react";
import "./Board.css";
import RenderPiece from "./RenderPiece";

const reduceBoard = (prevState: string[][], action: Action): string[][] => {
    switch (action.type) {
        case "MOVE_PIECE": {
            const newState = prevState.map((row) => row.slice());

            const piece: string =
                prevState[action.payload.from.getRow()][
                    action.payload.from.getCol()
                ];
            newState[action.payload.to.getRow()][action.payload.to.getCol()] =
                piece;
            newState[action.payload.from.getRow()][
                action.payload.from.getCol()
            ] = " ";

            return newState;
        }

        default:
            return prevState;
    }
};

// Take in board
interface BoardProps {
    boardSetup: string[][];
    updateMoveList: React.Dispatch<Action>;
    // undo here
}
const Board: React.FC<BoardProps> = ({ boardSetup, updateMoveList }) => {
    const [board, updateBoard] = useReducer(reduceBoard, boardSetup); // initial should be set to initialSetup
    const [hand, setHand] = useState<Hand>(null);
    // add a state to resolve undo

    // handle board click
    const onBoardClick = (location: Cell): void => {
        if (!hand && location.getPiece() !== " ") {
            // show potential moves here
            setHand(location); // highlight the piece
        } else if (hand && !location.equals(hand)) {
            // move validation goes here
            // put down the piece on invalid move
            handleMove({
                type: "MOVE_PIECE",
                payload: {
                    from: hand,
                    to: location,
                },
            });
            setHand(null);
        } else {
            setHand(null);
        }
    };

    const handleMove = async (action: Action): Promise<void> => {
        // add to move history, then update board
        await updateMoveList(action);
        updateBoard(action);
    };

    return (
        <div className="board">
            {board.map((row: string[], rowIndex: number) => (
                <div key={rowIndex} className="chess-row">
                    {row.map((piece: string, colIndex: number) => (
                        <div
                            key={colIndex}
                            onClick={() =>
                                onBoardClick(
                                    new Cell(colIndex, rowIndex, piece)
                                )
                            }
                            className={`chess-square ${
                                (rowIndex + colIndex) % 2 === 0
                                    ? "white"
                                    : "black"
                            }`}
                        >
                            <RenderPiece
                                location={new Cell(colIndex, rowIndex, piece)}
                                hand={hand}
                            />
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default Board;
