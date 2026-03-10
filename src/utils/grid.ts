import { CELL_PX } from "../constants";

export function snapG(px: number): number {
  return Math.round(px / CELL_PX);
}
