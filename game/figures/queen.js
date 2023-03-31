import Figure, { figureNames } from "/game?=figures/figure.js";
import { colors } from "/game?=resources/colors.js";

const whiteImg = '/game?=resources/img/whiteQueen.png';
const blackImg = '/game?=resources/img/blackQueen.png';

export default class Queen extends Figure {
  constructor(color, cell) {
    super(color, cell);
    this.img = color === colors.WHITE ? whiteImg : blackImg;
    this.name = figureNames.QUEEN;
  }

  canMove(selectedCell) {
    if (!super.canMove(selectedCell)) {
      return false;
    }
    if (this.cell.isEmptyVertical(selectedCell)) {
      return true;
    }
    if (this.cell.isEmptyHorizontal(selectedCell)) {
      return true;
    }
    if (this.cell.isEmptyDiagonal(selectedCell)) {
      return true;
    }
    return false;
  }
}