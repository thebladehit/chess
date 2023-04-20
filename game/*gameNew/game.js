import figureTypes from "/game?=*gameNew/resources/figureTypes.js";

export default class Game {
  constructor(board) {
    this.board = board;
  }

  checkAvailableCells(fromCell) {
    for (const row of this.board.cells) {
      for (const cell of row) {
        cell.available = this.canMove(fromCell, cell);
      }
    }
  }

  clearAvailableCells() {
    for (const row of this.board.cells) {
      for (const cell of row) {
        cell.available = false;
      }
    }
  }

  moveFigure(fromCell, targetCell) {
    targetCell.figure = fromCell.figure;
    fromCell.figure = null;
  }

  canMove(fromCell, targetCell) {
    if (fromCell.figure.color === targetCell.figure?.color) {
      return false;
    }
    if (targetCell.figure?.type === figureTypes.k) {
      return false;
    }
    return true;
  }
}