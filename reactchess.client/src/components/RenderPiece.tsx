import { Cell, Hand } from "../types/chessType";
import "./RenderPiece.css";

// render the piece
const renderMap = (cellString: string): string => {
    // map the piece to the emoji icon
    const map: { [key: string]: string } = {
        R: "♖",
        N: "♘",
        B: "♗",
        Q: "♕",
        K: "♔",
        P: "♙",
        r: "♜",
        n: "♞",
        b: "♝",
        q: "♛",
        k: "♚",
        p: "♟",
    };

    return map[cellString] || " ";
};

interface RenderPieceProps {
    location: Cell;
    hand: Hand;
}
const RenderPiece: React.FC<RenderPieceProps> = ({ location, hand }) => {
    return (
        <div
            id={location.toString()}
            className={`Piece ${
                hand != null && hand.equals(location) ? "highlight" : ""
            }`}
        >
            {renderMap(location.getPiece())}
        </div>
    );
};

export default RenderPiece;
