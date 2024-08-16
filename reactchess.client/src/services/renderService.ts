export const renderMap = (cellString: string): string => {
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
