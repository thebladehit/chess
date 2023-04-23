import figureTypes from "/game?=*gameNew/resources/figureTypes.js";

const figureMoves = {
  rook: [
    (deltaY, deltaX) => Infinity >= deltaX && deltaY === 0,
    (deltaY, deltaX) => Infinity >= deltaY && deltaX === 0
  ],
  bishop: [
    (deltaY, deltaX) => deltaX === deltaY
  ],
  queen: [
    (deltaY, deltaX) => Infinity >= deltaY && deltaX === 0,
    (deltaY, deltaX) => Infinity >= deltaX && deltaY === 0,
    (deltaY, deltaX) => deltaX === deltaY
  ],
  king: [
    (deltaY, deltaX) => deltaX === 1 && deltaY === 1,
    (deltaY, deltaX) => 1 === deltaX && deltaY === 0,
    (deltaY, deltaX) => 1 === deltaY && deltaX === 0
  ],
  pawn: {
    move: (fromCell, targetCell, direction, deltaX) => fromCell.y + direction === targetCell.y && deltaX === 0,
    doubleMove: (fromCell, targetCell, direction, deltaX) => fromCell.figure.isFirstStep && fromCell.y + direction * 2 === targetCell.y && deltaX === 0,
    beatMove: (fromCell, targetCell, direction, deltaX) => fromCell.y + direction === targetCell.y && deltaX === 1
  },
  knight: [
    (deltaY, deltaX) => deltaY === 2 && deltaX === 1,
    (deltaY, deltaX) => deltaY === 1 && deltaX === 2
  ]
};

export default class Game {
  constructor(board) {
    this.board = board;
    this.checkedKingColor = null;
    this.checkedBy = [];
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

  checkKing(color) {
    const enemyKingCell = this.board.getEnemyKingCell(color);
    console.log(enemyKingCell)
    const attackingFigures = this.getAttackingFigures(enemyKingCell, enemyKingCell.figure.color);
    if (attackingFigures.length !== 0) {
      this.checkedKingColor = enemyKingCell.figure.color;
      this.checkedBy = attackingFigures;
      enemyKingCell.checked = true;
      // this.checkMate(); // add later
    }
  }

  getAttackingFigures(targetCell, color) {
    const figures = [];
    for (const row of this.board.cells) {
      for (const cell of row) {
        if (cell.figure) {
          if (color !== cell.figure.color) {
            if (this.isAvailable(cell, targetCell)) {
              figures.push(cell); // return cells maybe figure?
            }
          }
        }
      }
    }
    return figures;
  }

  moveFigure(fromCell, targetCell) {
    targetCell.figure = fromCell.figure;
    fromCell.figure = null;
    targetCell.figure.isFirstStep = false;
    this.checkKing(targetCell.figure.color);
  }

  isAvailable(fromCell, targetCell) {
    const deltaX = Math.abs(targetCell.x - fromCell.x);
    const deltaY = Math.abs(targetCell.y - fromCell.y);

    if (fromCell.figure.type === figureTypes.p) {
      const direction = this.board.directionForPawn[fromCell.figure.color];
      if (((figureMoves[fromCell.figure.type].move(fromCell, targetCell, direction, deltaX) || (figureMoves[fromCell.figure.type].doubleMove(fromCell, targetCell, direction, deltaX) && this.board.isEmpty(this.board.getCell(targetCell.y - direction, targetCell.x)))) && this.board.isEmpty(targetCell))
        || (figureMoves[fromCell.figure.type].beatMove(fromCell, targetCell, direction, deltaX) && this.board.isEnemy(fromCell, targetCell))) {
        return true;
      }
    } else if (fromCell.figure.type === figureTypes.r) {
      for (const direction of figureMoves[fromCell.figure.type]) {
        if (direction(deltaY, deltaX)) {
          if (this.board.isEmptyHorizontal(fromCell, targetCell)) {
            return true;
          }
          if (this.board.isEmptyVertical(fromCell, targetCell)) {
            return true;
          }
        }
      }
    } else if (fromCell.figure.type === figureTypes.k) {
      for (const direction of figureMoves[fromCell.figure.type]) {
        if (direction(deltaY, deltaX)) {
          return true;
        }
      }
    } else {
      for (const direction of figureMoves[fromCell.figure.type]) {
        if (direction(deltaY, deltaX)) {
          if (deltaX === 0) {
            if (this.board.isEmptyVertical(fromCell, targetCell)) {
              return true;
            }
          } else if (deltaY === 0) {
            if (this.board.isEmptyHorizontal(fromCell, targetCell)) {
              return true;
            }
          } else if (deltaY === deltaX){
            if (this.board.isEmptyDiagonal(fromCell, targetCell)) {
              return true;
            }
          } else {
            return true;
          }
        }
      }
    }
    return false;
  }

  canMove(fromCell, targetCell) {
    if (fromCell.figure.color === targetCell.figure?.color) {
      return false;
    }
    if (targetCell.figure?.type === figureTypes.k) {
      return false;
    }
    if (this.isAvailable(fromCell, targetCell)) {
      return true;
    }
    return false;
  }
}