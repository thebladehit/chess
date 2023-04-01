import Board from "/game?=board/board.js";

export default class Cell {
  constructor(y, x, color) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.figure = null;
    this.available = false;
  }

   moveFigure(selectedCell) {
     selectedCell.figure = this.figure;
     this.figure?.moveFigure();
     this.figure.cell = selectedCell;
     this.figure = null;
  }

  isEmpty() {
    return this.figure === null;
  }

  isEmptyVertical(selectedCell) {
    if (this.x !== selectedCell.x) {
      return false;
    }
    const min = Math.min(this.y, selectedCell.y);
    const max = Math.max(this.y, selectedCell.y);
    for (let i = min + 1; i < max; i++) {
      if (!Board.getCell(i, this.x).isEmpty()) {
        return false;
      }
    }
    return true;
  }

  isEmptyHorizontal(selectedCell) {
    if (this.y !== selectedCell.y) {
      return false;
    }
    const min = Math.min(this.x, selectedCell.x);
    const max = Math.max(this.x, selectedCell.x);
    for (let i = min + 1; i < max; i++) {
      if (!Board.getCell(this.y, i).isEmpty()) {
        return false;
      }
    }
    return true;
  }

  isEmptyDiagonal(selectedCell) {
    const absX = Math.abs(this.x - selectedCell.x);
    const absY = Math.abs(this.y - selectedCell.y);
    if (absY !== absX) {
      return false;
    }
    const dy = selectedCell.y > this.y ? 1 : -1;
    const dx = selectedCell.x > this.x ? 1 : -1;
    for (let i = 1; i < absY; i++) {
      if (!Board.getCell(this.y + i * dy, this.x + i * dx).isEmpty()) {
        return false;
      }
    }
    return true;
  }
}