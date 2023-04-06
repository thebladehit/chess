import Figure, { figureNames } from "/game?=figures/figure.js";
import { colors } from "/game?=resources/colors.js";

const whiteImg = '/game?=resources/img/whiteBishop.png';
const blackImg = '/game?=resources/img/blackBishop.png';

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
    if ((this.canBeat(selectedCell) && !this.isMyKingChecked() && !this.isKingWillBeChecked(selectedCell))
      || (this.isMyKingChecked() && this.canProtectKing(selectedCell) && this.canBeat(selectedCell)))
    {
      return true;
    }
    return false;
  }
}