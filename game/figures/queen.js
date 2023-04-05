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

  canBeat(selectedCell) {
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

  canMove(selectedCell) {
    if (!super.canMove(selectedCell)) {
      return false;
    }
    if ((this.canBeat(selectedCell) && !this.isMyKingChecked()) || (this.isMyKingChecked() && this.canProtectKing(selectedCell) && this.canBeat(selectedCell))) {
      return true;
    }
    return false;
  }
}