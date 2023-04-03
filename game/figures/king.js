import Figure, { figureNames } from "/game?=figures/figure.js";
import { colors } from "/game?=resources/colors.js";

const whiteImg = '/game?=resources/img/whiteKing.png';
const blackImg = '/game?=resources/img/blackKing.png';

export default class King extends Figure {
  isFirstStep = true;

  constructor(color, cell) {
    super(color, cell);
    this.img = color === colors.WHITE ? whiteImg : blackImg;
    this.name = figureNames.KING;
  }

  moveFigure() {
    super.moveFigure();
    this.isFirstStep = false;
  }

  canMove(selectedCell) {
    if (!super.canMove(selectedCell)) {
      return false;
    }
    if (((selectedCell.y === this.cell.y + 1 && selectedCell.x === this.cell.x + 1)
      || (selectedCell.y === this.cell.y && selectedCell.x === this.cell.x + 1)
      || (selectedCell.y === this.cell.y - 1 && selectedCell.x === this.cell.x + 1)
      || (selectedCell.y === this.cell.y - 1 && selectedCell.x === this.cell.x)
      || (selectedCell.y === this.cell.y - 1 && selectedCell.x === this.cell.x - 1)
      || (selectedCell.y === this.cell.y && selectedCell.x === this.cell.x - 1)
      || (selectedCell.y === this.cell.y + 1 && selectedCell.x === this.cell.x - 1)
      || (selectedCell.y === this.cell.y + 1 && selectedCell.x === this.cell.x))
      && !this.cell.isUnderAttack(selectedCell)
    ) {
      return true;
    }
    return false;
  }
}