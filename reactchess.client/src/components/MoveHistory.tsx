interface MoveHistoryProps {
    moveList: string[];
    updateMoveList: React.Dispatch<Action>;
}

type Action = UndoPieceAction;
interface UndoPieceAction {
    type: "UNDO_PIECE";
}

const MoveHistory: React.FC<MoveHistoryProps> = ({
    moveList,
    updateMoveList,
}) => {
    // undo a move
    const onUndoClick = (): void => {
        console.log(moveList);
    };

    return (
        <>
            <div>
                <h3>MoveHistory</h3>
                <ol>
                    {moveList.map((move, index) => (
                        <li key={index / 2 + "|" + (index % 2)}>{move}</li>
                    ))}
                </ol>
                <button onClick={onUndoClick}>Undo a move</button>
            </div>
            {/* // move history // some list here in half moves // button for undo */}
        </>
    );
};

export default MoveHistory;
