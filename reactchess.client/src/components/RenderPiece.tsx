import { Hand } from "../types/chessType";
import { Cell } from "../types/cell";

import {renderMap} from "../services/renderService.ts";

import "../Styles/RenderPiece.css";


interface RenderPieceProps {
    location: Cell;
    piece: string
    hand: Hand;
}

// todo: pass in piece and isHighlight instead?
const RenderPiece: React.FC<RenderPieceProps> = ({ location, piece, hand }) => {
    return (
        <div
            id={location.toString()}
            className={`Piece${
                hand != null && hand.equals(location) ? " highlight" : ""
            }`}
        >
            {renderMap(piece)}
        </div>
    );
};

export default RenderPiece;
