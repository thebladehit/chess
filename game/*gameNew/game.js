import figureTypes from "/game?=*gameNew/resources/figureTypes.js";

const figureMoves = {
  rook: {
    directions: [[1,0], [-1, 0], [0, 1], [0, -1]],
    range: Infinity
  }
}

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
    const deltaX = fromCell.x - targetCell.x;
    const deltaY = fromCell.y - targetCell.y;
    if (deltaX > figureMoves[fromCell.figure.type].range || deltaY > figureMoves[fromCell.figure.type].range) {
      return false;
    }
    const directionX = deltaX === 0 ? 0 : deltaX / Math.abs(deltaX);
    const directionY = deltaY === 0 ? 0 : deltaY / Math.abs(deltaY);
    for (const direction of figureMoves[fromCell.figure.type].directions) {
      if (direction[0] === directionY && direction[1] === directionX) {
        if (deltaX === 0) {
          if (this.board.isEmptyVertical(fromCell, targetCell)) {
            return true;
          }
        } else if (deltaY === 0) {
         if (this.board.isEmptyHorizontal(fromCell, targetCell)) {
           return true;
         }
        }
      }
    }
    return false;
  }
}