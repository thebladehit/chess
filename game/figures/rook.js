import Figure, { figureNames } from "/game?=figures/figure.js";
import { colors } from "/game?=resources/colors.js";

const whiteImg = '/game?=resources/img/whiteRook.png';
const blackImg = '/game?=resources/img/blackRook.png';

export default class Rook extends Figure {
  constructor(color, cell) {
    super(color, cell);
    this.img = color === colors.WHITE ? whiteImg : blackImg;
    this.name = figureNames.ROOK;
  }

  canBeat(selectedCell) {
    if (this.cell.isEmptyHorizontal(selectedCell)) {
      return true;
    }
    if (this.cell.isEmptyVertical(selectedCell)) {
      return true;
    }
    return false;
  }

  canMove(selectedCell) {
    if (!super.canMove(selectedCell)) {
      return false;
    }
    if (this.canBeat(selectedCell)) {
      return true
    }
    return false;
  }
}