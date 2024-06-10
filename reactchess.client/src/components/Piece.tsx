import "./Piece.css";

// transforms FEN letter to piece
const renderMap = (letter: string): string => {
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

    return map[letter] || " ";
};

interface PieceProps {
    row: number;
    col: number;
    piece: string;
    isSelected: boolean;
}
const Piece: React.FC<PieceProps> = ({ row, col, piece, isSelected }) => {
    return (
        <div
            id={`${row}|${col}`}
            className={`Piece ${isSelected ? "highlight" : ""}`}
        >
            {renderMap(piece)}
        </div>
    );
};

export default Piece;
