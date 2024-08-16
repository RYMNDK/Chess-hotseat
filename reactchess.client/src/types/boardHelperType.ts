import {Cell} from "./cell.ts";

export interface boardHelper {
 wk: Cell; moves: { [p: string]: Cell[] }; bk: Cell
}
