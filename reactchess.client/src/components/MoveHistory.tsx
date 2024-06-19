import { RenderAction } from "../types/actionType";

// Long algebraic notation ["e2-e4 Nf8-g6"]
const parse = (halfMove: RenderAction): string => {
    // parse entire list every time, consider caching the results
    switch (halfMove.type) {
        case "MOVE_PIECE": {
            const payload = halfMove.payload;
            const piece: string = payload.from.getPiece().toUpperCase();
            return `${piece !== "P" ? piece : ""}${payload.from.toString()}${
                payload.to.getPiece() === " " ? "-" : "x"
            }${payload.to.toString()}${
                payload.denote !== "" ? payload.denote.toUpperCase() : ""
            }`;
        }
        case "CASTLE_ACTION": {
            const payload = halfMove.payload;
            if (payload.side === "k") {
                return `O-O${payload.denote}`;
            } else {
                return `O-O-O${payload.denote}`;
            }
        }
        case "EN_PASSANT_ACTION": {
            const payload = halfMove.payload;
            return `${payload.from.toString()}x${payload.to.toString()}${
                payload.denote !== "" ? payload.denote : ""
            } E.P.`;
        }
        default:
            return "bad move";
    }
};

interface MoveHistoryProps {
    moveList: RenderAction[];
}

const MoveHistory: React.FC<MoveHistoryProps> = ({ moveList }) => {
    const renderFullMoves = (halfMoveAction: RenderAction[]): string[] => {
        const fullMoves: Array<string> = [];
        for (let i: number = 0; i < halfMoveAction.length; i += 2) {
            fullMoves.push(
                `${parse(halfMoveAction[i])}${
                    i + 1 < halfMoveAction.length
                        ? " " + parse(halfMoveAction[i + 1])
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
