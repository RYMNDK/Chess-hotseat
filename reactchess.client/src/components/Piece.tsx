interface PieceProps {
    row: number;
    col: number;
    piece: string;
}

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

const Piece: React.FC<PieceProps> = ({ row, col, piece }) => {
    return (
        <div id={`${row}|${col}`} className="Piece">
            {renderMap(piece)}
        </div>
    );
};

export default Piece;
