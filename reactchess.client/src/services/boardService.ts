import { Cell } from "../types/cell.ts";

export const getCell = (location: string): Cell =>
    new Cell(
        location.charCodeAt(0) - "a".charCodeAt(0),
        8 - (location[1].charCodeAt(0) - "0".charCodeAt(0)),
        " "
    );
export const getNewPiece = (isWhiteTurn: boolean): string => {
    let piece;
    do {
        piece = prompt("Enter one of q, b, r, n:") || "";
    } while (!["q", "b", "r", "n"].includes(piece));
    return isWhiteTurn ? piece.toUpperCase() : piece.toLowerCase();
};
