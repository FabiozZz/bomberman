export interface Cell {
    row: number;
    col: number;
    point: number | null;
    bomb: boolean;
    isHide: boolean;
    flag: boolean;
}
