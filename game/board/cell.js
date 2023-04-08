import Board from "/game?=board/board.js";
import { figureNames } from "/game?=figures/figure.js";

export default class Cell {
  constructor(y, x, color) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.figure = null;
    this.available = false;
    this.check = false;
    this.checkedBy = [];
    this.rookForCastling = null;
    this.cellForRookCastling = null;
  }

   moveFigure(selectedCell) {
     selectedCell.rookForCastling?.moveFigure(selectedCell.cellForRookCastling);
     selectedCell.figure?.deleteFigure();
     selectedCell.figure = this.figure;
     this.figure.cell = selectedCell;
     this.figure = null;
     selectedCell.figure.moveFigure();
     selectedCell.figure.checkKing();
  }

  isEmpty(color) {
    if (this.figure?.name === figureNames.KING && this.figure?.color !== color) {
      return true;
    }
    if (this.figure) {
      return false;
    }
    return true;
  }

  isEnemy(selectedCell) {
    if (selectedCell.figure) {
      return this.figure.color !== selectedCell.figure.color;
    }
    return false;
  }

  getAttackingFigures(selectedCell) {
    const figures = [];
    for (const figure of Board.figures) {
      if (this.figure.color !== figure.color) {
        if (figure.canBeat(selectedCell)) {
          figures.push(figure.cell);
        }
      }
    }
    return figures;
  }

  isUnderAttack(selectedCell) {
    return this.getAttackingFigures(selectedCell).length !== 0;
  }

  isEmptyVertical(selectedCell) {
    if (this === selectedCell) {
      return false;
    }
    if (this.x !== selectedCell.x) {
      return false;
    }
    const min = Math.min(this.y, selectedCell.y);
    const max = Math.max(this.y, selectedCell.y);
    for (let i = min + 1; i < max; i++) {
      if (!Board.getCell(i, this.x).isEmpty(this.color)) {
        return false;
      }
    }
    return true;
  }

  isEmptyHorizontal(selectedCell) {
    if (this === selectedCell) {
      return false;
    }
    if (this.y !== selectedCell.y) {
      return false;
    }
    const min = Math.min(this.x, selectedCell.x);
    const max = Math.max(this.x, selectedCell.x);
    for (let i = min + 1; i < max; i++) {
      if (!Board.getCell(this.y, i).isEmpty(this.color)) {
        return false;
      }
    }
    return true;
  }

  isEmptyDiagonal(selectedCell) {
    if (this === selectedCell) {
      return false;
    }
    const absX = Math.abs(this.x - selectedCell.x);
    const absY = Math.abs(this.y - selectedCell.y);
    if (absY !== absX) {
      return false;
    }
    const dy = selectedCell.y > this.y ? 1 : -1;
    const dx = selectedCell.x > this.x ? 1 : -1;
    for (let i = 1; i < absY; i++) {
      if (!Board.getCell(this.y + i * dy, this.x + i * dx).isEmpty(this.color)) {
        return false;
      }
    }
    return true;
  }
}