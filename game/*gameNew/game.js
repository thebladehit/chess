import figureTypes from "/game?=*gameNew/resources/figureTypes.js";

const figureMoves = {
  rook: {
    directions: [[1,0], [-1,0], [0,1], [0,-1]],
    range: Infinity
  },
  bishop: {
    directions: [[1,1], [1,-1], [-1,1], [-1,-1]],
    range: Infinity
  },
  queen: {
    directions: [[1,1], [1,-1], [-1,1], [-1,-1], [1,0], [-1,0], [0,1], [0,-1]],
    range: Infinity
  },
  king: {
    directions: [[1,1], [1,-1], [-1,1], [-1,-1], [1,0], [-1,0], [0,1], [0,-1]],
    range: 1
  },
  pawn: {
    directions: [undefined,0],
    beat: [[undefined, 1], [undefined, -1]]
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
    targetCell.figure.isFirstStep = false;
  }

  canMove(fromCell, targetCell) {
    if (fromCell.figure.color === targetCell.figure?.color) {
      return false;
    }
    if (targetCell.figure?.type === figureTypes.k) {
      return false;
    }
    const deltaX = targetCell.x - fromCell.x;
    const deltaY = targetCell.y - fromCell.y;
    const directionX = deltaX === 0 ? 0 : deltaX / Math.abs(deltaX);
    const directionY = deltaY === 0 ? 0 : deltaY / Math.abs(deltaY);

    if (fromCell.figure.type === figureTypes.p) {
      if ((fromCell.y + this.board.directionForPawn[fromCell.figure.color] === targetCell.y && figureMoves[fromCell.figure.type].directions[1] === deltaX && this.board.isEmpty(targetCell))
      || (fromCell.figure.isFirstStep && fromCell.y + this.board.directionForPawn[fromCell.figure.color] * 2 === targetCell.y) && figureMoves[fromCell.figure.type].directions[1] === deltaX && this.board.isEmpty(targetCell)) {
        return true;
      }
    } else {
      if (Math.abs(deltaX) > figureMoves[fromCell.figure.type].range || Math.abs(deltaY) > figureMoves[fromCell.figure.type].range) {
        return false;
      }

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
          } else {
            if (this.board.isEmptyDiagonal(fromCell, targetCell)) {
              return true;
            }
          }
        }
      }
    }


    return false;
  }
}