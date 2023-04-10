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

  moveFigure(oldCell) {
    super.moveFigure();
    this.isFirstStep = false;
    if (this.isFinalCell()) {
      this.deleteFigure();
      Board.drawFigureList(this.color, this.cell);
    }
    this.checkDoubleMove(oldCell);
  }

  isFinalCell() {
    return this.cell.y === this.finalCell;
  }

  checkDoubleMove(oldCell) {
    if (this.cell.y === oldCell.y + this.direction * 2) {
      Board.getCell(this.cell.y - this.direction, this.cell.x).doubleMove = true;
    }
  }

  canBeat(selectedCell) {
    return selectedCell.y === this.cell.y + this.direction && (selectedCell.x === this.cell.x + 1 || selectedCell.x === this.cell.x - 1);
  }

  isDoubleMove(selectedCell) {
    return selectedCell.doubleMove;
  }

  isAvailable(selectedCell) {
    return (selectedCell.y === this.cell.y + this.direction || this.isFirstStep && selectedCell.y === this.cell.y + this.direction * 2 && Board.getCell(this.cell.y + this.direction, this.cell.x).isEmpty())
      && selectedCell.x === this.cell.x
      && Board.getCell(selectedCell.y, selectedCell.x).isEmpty();
  }

  canMove(selectedCell) {
    if (!super.canMove(selectedCell)) {
      return false;
    }
    if (((this.isAvailable(selectedCell) || (this.canBeat(selectedCell) && (this.cell.isEnemy(selectedCell) || this.isDoubleMove(selectedCell)))) && !this.isMyKingChecked() && !this.isKingWillBeChecked(selectedCell))
      || (this.isMyKingChecked() && (this.isAvailable(selectedCell) || (this.canBeat(selectedCell) && (this.cell.isEnemy(selectedCell) || this.isDoubleMove(selectedCell)))) && this.canProtectKing(selectedCell)))
    {
      return true;
    }
    return false;
  }
}