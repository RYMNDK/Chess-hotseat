import { RenderAction } from "../types/chessType";

// Long algebraic notation ["e2-e4 Nf8-g6"]
const parse = (halfMove: RenderAction): string => {
    switch (halfMove.type) {
        case "MOVE_PIECE": {
            const payload = halfMove.payload;
            const piece: string = payload.from.getPiece().toUpperCase();
            return `${piece !== "P" ? piece : ""}${payload.from.toString()}${
                payload.to.getPiece() === " " ? "-" : "x"
            }${payload.to.toString()}${payload.denote ?? ""}`;
        }
        default:
            return "bad move";
    }
};

interface MoveHistoryProps {
    moveList: RenderAction[];
}

const MoveHistory: React.FC<MoveHistoryProps> = ({
    moveList
}) => {
    const renderFullMoves = (halfMoveAction: RenderAction[]): string[] => {
        const fullMoves: Array<string> = [];
        for (let i: number = 0; i < halfMoveAction.length; i += 2) {
            fullMoves.push(
                `${parse(halfMoveAction[i])}${
                    i + 1 < halfMoveAction.length
                        ? "\t" + parse(halfMoveAction[i + 1])
                        : ""
                }`
            );
        }

        return fullMoves;
    };

    const fullMoves: string[] = renderFullMoves(moveList);

    return (
        <div>
            <h3>Move History</h3>
            <ol>
                {fullMoves.map((line: string, index: number) => (
                    <li key={index}>{line}</li>
                ))}
            </ol>
        </div>
    );
};

export default MoveHistory;
