import Figure, { figureNames } from "/game?=figures/figure.js";
import { colors } from "/game?=resources/colors.js";
import Board from "/game?=board/board.js";

const whiteImg = '/game?=resources/img/whiteKing.png';
const blackImg = '/game?=resources/img/blackKing.png';

export default class King extends Figure {
  isFirstStep = true;

  constructor(color, cell) {
    super(color, cell);
    this.img = color === colors.WHITE ? whiteImg : blackImg;
    this.name = figureNames.KING;
    Board.kings.push(this);
  }

  moveFigure() {
    super.moveFigure();
    this.isFirstStep = false;
  }

  canDoCastling(selectedCell) {
    if (!this.isFirstStep) {
      return false;
    }
    if (this.cell.y !== selectedCell.y || Math.abs(this.cell.x - selectedCell.x) !== 2) {
      return false;
    }
    const cells = Board.getCellsForCastling(selectedCell, this.color);
    if (!cells[cells.length - 1].figure) {
      return false;
    }
    if (cells[cells.length - 1].figure.name !== figureNames.ROOK) {
      return false;
    }
    if (!cells[cells.length - 1].figure.isFirstStep) {
      return false;
    }
    for (let i = 0; i< cells.length - 1; i++) {
      if (cells[i].figure) {
        return false;
      }
      if (this.cell.isUnderAttack(cells[i])) {
        return false;
      }
    }
    selectedCell.rookForCastling = cells[cells.length - 1];
    selectedCell.cellForRookCastling = cells[0];
    return true;
  }

  canBeat(selectedCell) {
    if ((selectedCell.y === this.cell.y + 1 && selectedCell.x === this.cell.x + 1)
        || (selectedCell.y === this.cell.y && selectedCell.x === this.cell.x + 1)
        || (selectedCell.y === this.cell.y - 1 && selectedCell.x === this.cell.x + 1)
        || (selectedCell.y === this.cell.y - 1 && selectedCell.x === this.cell.x)
        || (selectedCell.y === this.cell.y - 1 && selectedCell.x === this.cell.x - 1)
        || (selectedCell.y === this.cell.y && selectedCell.x === this.cell.x - 1)
        || (selectedCell.y === this.cell.y + 1 && selectedCell.x === this.cell.x - 1)
        || (selectedCell.y === this.cell.y + 1 && selectedCell.x === this.cell.x))
    {
      return true;
    }
    return false;
  }

  canMove(selectedCell) {
    if (this.canDoCastling(selectedCell)) {
      return true;
    }
    if (!super.canMove(selectedCell)) {
      return false;
    }
    if (this.canBeat(selectedCell) && !this.cell.isUnderAttack(selectedCell)) {
      return true;
    }
    return false;
  }
}