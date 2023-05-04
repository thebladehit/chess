import Figure, { figureNames } from "/game?=figures/figure.js";
import { colors } from "/game?=resources/colors.js";

export const whiteImg = '/game?=resources/img/whiteBishop.png';
export const blackImg = '/game?=resources/img/blackBishop.png';

export default class Bishop extends Figure {
  constructor(color, cell) {
    super(color, cell);
    this.img = color === colors.WHITE ? whiteImg : blackImg;
    this.name = figureNames.BISHOP;
  }

  canBeat(selectedCell) {
    if (this.cell.isEmptyDiagonal(selectedCell)) {
      return true;
    }
    return false;
  }

  canMove(selectedCell) {
    if (!super.canMove(selectedCell)) {
      return false;
    }
    if (!this.isMyKingChecked() && (this.canBeat(selectedCell) && !this.isKingWillBeChecked(selectedCell))
      || (this.isMyKingChecked() && this.canBeat(selectedCell) && !this.isKingWillBeChecked(selectedCell) && this.canProtectKing(selectedCell)))
    {
      return true;
    }
    return false;
  }
}