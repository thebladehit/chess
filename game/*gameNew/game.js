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

  clearCheck(color) {
    this.checkedBy = [];
    this.checkedKingColor = null;
    this.board.getMyKingCell(color).checked = false;
  }

  clearRookForCastling() {
    for (const row of this.board.cells) {
      for (const cell of row) {
        cell.rookCellForCastling = null;
        cell.cellForRookCastling = null;
      }
    }
  }

  clearDoubleMove() {
    for (const row of this.board.cells) {
      for (const cell of row) {
        cell.doubleMove = false;
      }
    }
  }

  deleteFigure(figure) {
    const inx = this.board.figures.indexOf(figure);
    this.board.figures.splice(inx, 1);
  }

  isUnderAttack(targetCell, color) {
    return this.getAttackingFigureCells(targetCell, color).length !== 0;
  }

  isMyKingChecked(color) {
    const kingCell = this.board.getMyKingCell(color);
    return this.isUnderAttack(kingCell, color);
  }

  isHereKing(cells) {
    for (const cell of cells) {
      if (cell.figure?.type === figureTypes.k) {
        return true;
      }
    }
    return false;
  }

  isKingWillBeChecked(fromCell, targetCell, color) {
    const attackingFigureCells = this.getAttackingFigureCells(fromCell, color);
    console.log(attackingFigureCells);
    for (const attackingFigureCell of attackingFigureCells) {
      if (attackingFigureCell.figure.type === figureTypes.k || attackingFigureCell.figure.type === figureTypes.p || attackingFigureCell.figure.type === figureTypes.n) {
        continue;
      }
      const attackedCells = this.getFutureAttackedCells(fromCell, attackingFigureCell);
      if (this.isHereKing(attackedCells)) {
        for (const cell of attackedCells) {
          if (cell === targetCell) {
            return false;
          }
        }
        return true;
      }
    }
    return false;
  }

  checkKing(color) {
    const enemyKingCell = this.board.getEnemyKingCell(color);
    const attackingFigureCells = this.getAttackingFigureCells(enemyKingCell, enemyKingCell.figure.color);
    if (attackingFigureCells.length !== 0) {
      this.checkedKingColor = enemyKingCell.figure.color;
      this.checkedBy = attackingFigureCells;
      enemyKingCell.checked = true;
      // this.checkMate(); // add later
    }
  }

  checkDoubleMove(fromCell, targetCell) {
    const direction = this.board.directionForPawn[fromCell.figure.color];
    if (targetCell.y === fromCell.y + direction * 2) {
      this.board.getCell(targetCell.y - direction, fromCell.x).doubleMove = true;
    }
  }

  getFutureAttackedCells(attackedCell, attackingCell) {
    const cells = [];
    const dy = attackingCell.y > attackedCell.y ? -1 : 1;
    const dx = attackingCell.x > attackedCell.x ? -1 : 1;

    let y = attackingCell.y;
    let x = attackingCell.x;

    if (attackedCell.x === attackingCell.x) {
      while (y >= 0 && y <= 7) {
        const cell = this.board.getCell(y, attackingCell.x);
        if (!cell) break;
        if (!this.board.isEmpty(cell) && cell !== attackedCell && cell !== attackingCell) {
          if (cell.figure?.type === figureTypes.k) {
            cells.push(cell);
          }
          break;
        }
        cells.push(cell);
        y += dy;
      }
    } else if (attackedCell.y === attackingCell.y) {
      while (x >= 0 && x <= 7) {
        const cell = this.board.getCell(attackingCell.y, x);
        if (!cell) break;
        if (!this.board.isEmpty(cell) && cell !== attackedCell && cell !== attackingCell) {
          if (cell.figure?.type === figureTypes.k) {
            cells.push(cell);
          }
          break;
        }
        cells.push(cell);
        x += dx;
      }
    } else {
      while (y >= 0 && y <= 7) {
        const cell = this.board.getCell(y, x);
        if (!cell) break;
        if (!this.board.isEmpty(cell) && cell !== attackedCell && cell !== attackingCell) {
          if (cell.figure?.type === figureTypes.k) {
            cells.push(cell);
          }
          break;
        }
        cells.push(cell);
        y += dy;
        x += dx;
      }
    }
    return cells;
  }

  getAttackedCellsToKing(color) {
    const cells = [];
    const kingCell = this.board.getMyKingCell(color);

    if (this.checkedBy.length > 1) {
      return [];
    }

    const minX = Math.min(kingCell.x, this.checkedBy[0].x);
    const maxX = Math.max(kingCell.x, this.checkedBy[0].x);
    const minY = Math.min(kingCell.y, this.checkedBy[0].y);
    const maxY = Math.max(kingCell.y, this.checkedBy[0].y);

    if (this.checkedBy[0].figure.type === figureTypes.n) {
      cells.push(this.checkedBy[0]);
    } else if (kingCell.x === this.checkedBy[0].x) {
      for (let i = minY; i <= maxY; i++) {
        cells.push(this.board.getCell(i, kingCell.x));
      }
    } else if (kingCell.y === this.checkedBy[0].y) {
      for (let i = minX; i <= maxX; i++) {
        cells.push(this.board.getCell(kingCell.y, i));
      }
    } else {
      const dx = kingCell.x < this.checkedBy[0].x ? 1 : -1;
      const dy = kingCell.y < this.checkedBy[0].y ? 1 : -1;
      const abs = Math.abs(kingCell.y - this.checkedBy[0].y);

      for (let i = 1; i <= abs; i++) {
        cells.push(this.board.getCell(kingCell.y + i * dy, kingCell.x + i * dx));
      }
    }
    return cells;
  }

  canProtectKing(fromCell, targetCell, color) {
    for (const cell of this.getAttackedCellsToKing(color)) {
      if (targetCell === cell) {
        return true;
      }
      if (cell.figure?.type === figureTypes.p && fromCell.figure.type === figureTypes.p) {
        const direction = this.board.directionForPawn[fromCell.figure.color];;
        const availableCell = this.board.getCell(cell.y + direction, cell.x);
        if (availableCell.doubleMove && availableCell === targetCell) {
          return true;
        }
      }
    }
    return false;
  }

  getAttackingFigureCells(targetCell, color) {
    const cells = [];
    for (const row of this.board.cells) {
      for (const cell of row) {
        if (cell.figure) {
          if (color !== cell.figure.color) {
            if (this.canBeat(cell, targetCell)) {
              cells.push(cell);
            }
          }
        }
      }
    }
    return cells;
  }

  getCellsForCastling(targetCell, color) {
    const cells = [];
    const kingCell = this.board.getMyKingCell(color);
    const dx = targetCell.x > kingCell.x ? 1 : -1;
    let x = kingCell.x + dx;
    while (x >= 0 && x <= 7) {
      cells.push(this.board.getCell(kingCell.y, x));
      x += dx;
    }
    return cells;
  }

  moveFigure(fromCell, targetCell) {
    this.clearCheck(fromCell.figure.color);
    if (targetCell.rookCellForCastling) {
      this.moveFigure(targetCell.rookCellForCastling, targetCell.cellForRookCastling);
    }
    if (targetCell.figure) {
      this.deleteFigure(targetCell.figure);
    }
    if (targetCell.doubleMove && fromCell.figure.type === figureTypes.p) {
      const cell = this.board.getCell(fromCell.y, targetCell.x);
      this.deleteFigure(cell.figure);
      cell.figure = null;
    }
    this.clearDoubleMove();
    if (fromCell.figure.type === figureTypes.p) {
      this.checkDoubleMove(fromCell, targetCell);
    }
    targetCell.figure = fromCell.figure;
    fromCell.figure.isFirstStep = false;
    fromCell.figure = null;
    this.checkKing(targetCell.figure.color);
  }

  canBeat(fromCell, targetCell) {
    const deltaX = Math.abs(targetCell.x - fromCell.x);
    const deltaY = Math.abs(targetCell.y - fromCell.y);

    if (fromCell.figure.type === figureTypes.p) {
      const direction = this.board.directionForPawn[fromCell.figure.color];
      if (figureMoves[fromCell.figure.type].beatMove(fromCell, targetCell, direction, deltaX)) {
        return true;
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

  isAvailable(fromCell, targetCell) {
    const deltaX = Math.abs(targetCell.x - fromCell.x);
    const deltaY = Math.abs(targetCell.y - fromCell.y);

    if (fromCell.figure.type === figureTypes.p) {
      const direction = this.board.directionForPawn[fromCell.figure.color];
      const aisleCell = this.board.aisleCellForPawn[fromCell.figure.color];
      if (((figureMoves[fromCell.figure.type].move(fromCell, targetCell, direction, deltaX) || (figureMoves[fromCell.figure.type].doubleMove(fromCell, targetCell, direction, deltaX) && this.board.isEmpty(this.board.getCell(targetCell.y - direction, targetCell.x)))) && this.board.isEmpty(targetCell))
        || (this.canBeat(fromCell, targetCell) && (this.board.isEnemy(fromCell, targetCell) || targetCell.doubleMove && fromCell.y === aisleCell))) {
        return true;
      }
    } else if (fromCell.figure.type === figureTypes.k) {
      if (this.canBeat(fromCell, targetCell) && !this.isUnderAttack(targetCell, fromCell.figure.color)) {
        return true;
      }
      if (this.canDoCastling(fromCell, targetCell) && !this.isMyKingChecked(fromCell.figure.color)) {
        return true;
      }
    } else {
      if (this.canBeat(fromCell, targetCell)) {
        return true;
      }
    }

    return false;
  }

  canDoCastling(fromCell, targetCell) {
    if (fromCell.y !== targetCell.y || Math.abs(fromCell.x - targetCell.x) !== 2) {
      return false;
    }
    if (!fromCell.figure.isFirstStep) {
      return false;
    }
    const cells = this.getCellsForCastling(targetCell, fromCell.figure.color);
    if (!cells[cells.length - 1].figure) {
      return false;
    }
    if (cells[cells.length - 1].figure.type !== figureTypes.r) {
      return false;
    }
    if (!cells[cells.length - 1].figure.isFirstStep) {
      return false;
    }
    for (let i = 0; i< cells.length - 1; i++) {
      if (cells[i].figure) {
        return false;
      }
      if (this.isUnderAttack(cells[i], fromCell.figure.color)) {
        return false;
      }
    }

    targetCell.rookCellForCastling = cells[cells.length - 1];
    targetCell.cellForRookCastling = cells[0];
    return true;
  }

  canMove(fromCell, targetCell) {
    console.log(this.isKingWillBeChecked(fromCell, targetCell, fromCell.figure.color));
    if (fromCell.figure.color === targetCell.figure?.color) {
      return false;
    }
    if (targetCell.figure?.type === figureTypes.k) {
      return false;
    }
    if (fromCell.figure.type === figureTypes.k) {
      if (this.isAvailable(fromCell, targetCell)) {
        return true;
      }
    } else if ((!this.isMyKingChecked(fromCell.figure.color) && this.isAvailable(fromCell, targetCell) && !this.isKingWillBeChecked(fromCell, targetCell, fromCell.figure.color))
      || (this.isMyKingChecked(fromCell.figure.color) && this.isAvailable(fromCell, targetCell) && !this.isKingWillBeChecked(fromCell, targetCell, fromCell.figure.color) && this.canProtectKing(fromCell, targetCell, fromCell.figure.color))
    ) {
      return true;
    }
    return false;
  }
}