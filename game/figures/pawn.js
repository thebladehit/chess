import Figure, { figureNames } from "/game?=figures/figure.js";
import { colors } from "/game?=resources/colors.js";
import Board from "/game?=board/board.js";

const whiteImg = '/game?=resources/img/whitePawn.png';
const blackImg = '/game?=resources/img/blackPawn.png';

export default class Pawn extends Figure {
  isFirstStep = true;
  constructor(color, cell, direction, finalCell) {
    super(color, cell);
    this.img = color === colors.WHITE ? whiteImg : blackImg;
    this.name = figureNames.PAWN;
    this.direction = direction;
    this.finalCell = finalCell;
  }

  moveFigure() {
    super.moveFigure();
    this.isFirstStep = false;
    if (this.isFinalCell()) {
      this.deleteFigure();
      Board.drawFigureList(this.color, this.cell);
    }
  }

  isFinalCell() {
    return this.cell.y === this.finalCell;
  }

  canBeat(selectedCell) {
    if (selectedCell.y === this.cell.y + this.direction && (selectedCell.x === this.cell.x + 1 || selectedCell.x === this.cell.x - 1)
      && this.cell.isEnemy(selectedCell))
    {
      return true;
    }
    return false;
  }

  isAvailable(selectedCell) {
    return (selectedCell.y === this.cell.y + this.direction || this.isFirstStep && selectedCell.y === this.cell.y + this.direction * 2)
      && selectedCell.x === this.cell.x
      && Board.getCell(selectedCell.y, selectedCell.x).isEmpty();
  }

  canMove(selectedCell) {
    if (!super.canMove(selectedCell)) {
      return false;
    }
    if (((this.isAvailable(selectedCell) || this.canBeat(selectedCell)) && !this.isMyKingChecked() && !this.isKingWillBeChecked(selectedCell))
      || (this.isMyKingChecked() && this.canProtectKing(selectedCell) && (this.canBeat(selectedCell) || this.isAvailable(selectedCell))))
    {
      return true;
    }
    return false;
  }
}