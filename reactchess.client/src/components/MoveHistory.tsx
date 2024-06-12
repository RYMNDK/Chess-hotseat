import { Action, RenderAction } from "../types/chessType";

interface MoveHistoryProps {
    moveList: RenderAction[];
    updateMoveList: React.Dispatch<Action>;
}

// Long algebraic notation
// ["e2-e4 Nf8-g6", (other moves)]
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
            // for debugging
            return "bad move";
    }
};

const MoveHistory: React.FC<MoveHistoryProps> = ({
    moveList,
    updateMoveList,
}) => {
    // const onUndoClick = (): void => {
    //     updateMoveList({
    //         type: "UNDO_PIECE",
    //     });
    // };
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
            {/* <button onClick={onUndoClick}>Undo a move</button> */}
            {/* // move history // some list here in half moves*/}
        </div>
    );
};

export default MoveHistory;
