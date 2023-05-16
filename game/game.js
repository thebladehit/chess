import figureTypes from "/getFile?=game/resources/figureTypes.js";
import { colors } from "/getFile?=game/resources/colors.js";

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
    this.setDefaultSettings();
  }

  setDefaultSettings() {
    this.checkedBy = [];
    this.checkMateColor = null;
    this.draw = false;
    this.stalemate = false;
    this.gameOver = false;
    this.finalHorizontalCell = null;
    this.movePlayer = colors.WHITE;
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

  isHereKing(cells, color) {
    for (const cell of cells) {
      if (cell.figure?.type === figureTypes.k && cell.figure?.color === color) {
        return true;
      }
    }
    return false;
  }

  changePlayer() {
    this.movePlayer = this.movePlayer === colors.WHITE ? colors.BLACK : colors.WHITE;
  }

  isKingWillBeChecked(fromCell, targetCell, color) {
    const notDangerousFigure = {
      'king': true,
      'knight': true,
      'pawn': true
    };
    const attackingFigureCells = this.getAttackingFigureCells(fromCell, color);
    for (const attackingFigureCell of attackingFigureCells) {
      if (notDangerousFigure[attackingFigureCell.figure.type]) {
        continue;
      }
      const attackedCells = this.getFutureAttackedCells(fromCell, attackingFigureCell);
      if (this.isHereKing(attackedCells, fromCell.figure.color)) {
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

  isFinalHorizontal(cell) {
    const finalHorizontal = this.board.finalHorizontalForPawn[cell.figure.color];
    return cell.y === finalHorizontal;
  }

  checkKing(color) {
    const enemyKingCell = this.board.getEnemyKingCell(color);
    const attackingFigureCells = this.getAttackingFigureCells(enemyKingCell, enemyKingCell.figure.color);
    if (attackingFigureCells.length !== 0) {
      this.checkedBy = attackingFigureCells;
      enemyKingCell.checked = true;
      this.checkMate(color);
    }
  }

  checkMate(color) {
    if (!this.isAvailableMoves(color)) {
      this.checkMateColor = color;
      this.gameOver = true;
    }
  }

  checkStalemate(color) {
    if (!this.isAvailableMoves(color) && !this.gameOver) {
      this.stalemate = true;
      this.gameOver = true;
    }
  }

  checkDraw() {
    if (this.board.figures.length === 2) {
      this.draw = true;
      this.gameOver = true;
    } else if (this.board.figures.length === 3) {
      for (const figure of this.board.figures) {
        if (figure.type === figureTypes.n || figure.type === figureTypes.b) {
          this.draw = true;
          this.gameOver = true;
        }
      }
    } else if (this.board.figures.length === 4) {
      const bishopCells= [];
      for (const row of this.board.cells) {
        for (const cell of row) {
          if (cell.figure?.type === figureTypes.b) {
            bishopCells.push(cell);
          }
        }
      }
      if (bishopCells.length === 2 && bishopCells[0].figure.color === bishopCells[1].figure.color && bishopCells[0].color === bishopCells[1].color) {
        this.draw = true;
        this.gameOver = true;
      }
    }
  }

  isAvailableMoves(color) {
    for (const rowFrom of this.board.cells) {
      for (const fromCell of rowFrom) {
        if (fromCell.figure && fromCell.figure.color !== color) {
          for (const rowTarget of this.board.cells) {
            for (const targetCell of rowTarget) {
              if (this.canMove(fromCell, targetCell)) {
                return true;
              }
            }
          }
        }
      }
    }
    return false;
  }

  checkDoubleMove(fromCell, targetCell) {
    const direction = this.board.directionForPawn[fromCell.figure.color];
    if (targetCell.y === fromCell.y + direction * 2) {
      this.board.getCell(targetCell.y - direction, fromCell.x).doubleMove = true;
    }
  }

  getFutureAttackedCells(attackedCell, attackingCell) {
    const cells = [];
    let y = attackingCell.y;
    let x = attackingCell.x;
    const dx = attackingCell.x === attackedCell.x ? 0 : attackingCell.x < attackedCell.x ? 1 : -1;
    const dy = attackingCell.y === attackedCell.y ? 0 : attackingCell.y < attackedCell.y ? 1 : -1;
    while (y >= 0 && y <= 7 && x >= 0 && x <= 7) {
      const cell = this.board.getCell(y, x);
      // if (!cell) break;
      if (!this.board.isEmpty(cell) && cell !== attackedCell && cell !== attackingCell) {
        if (cell.figure?.type === figureTypes.k) cells.push(cell);
        break;
      }
      cells.push(cell);
      y += dy;
      x += dx;
    }
    return cells;
  }

  getAttackedCellsToKing(color) {
    const cells = [];
    const kingCell = this.board.getMyKingCell(color);
    if (this.checkedBy.length > 1) return [];
    if (this.checkedBy[0].figure.type === figureTypes.n) cells.push(this.checkedBy[0]);
    else {
      const dx = kingCell.x === this.checkedBy[0].x ? 0 : kingCell.x < this.checkedBy[0].x ? 1 : -1;
      const dy = kingCell.y === this.checkedBy[0].y ? 0 : kingCell.y < this.checkedBy[0].y ? 1 : -1;
      const absY = Math.abs(kingCell.y - this.checkedBy[0].y);
      const absX = Math.abs(kingCell.x - this.checkedBy[0].x);
      const absForLoop = absX === 0 ? absY : absX;
      for (let i = 1; i <= absForLoop; i++) {
        cells.push(this.board.getCell(kingCell.y + i * dy, kingCell.x + i * dx));
      }
    }
    return cells;
  }

  canProtectKing(fromCell, targetCell, color) {
    for (const cell of this.getAttackedCellsToKing(color)) {
      if (targetCell === cell) return true;
      if (cell.figure && cell.figure.type === figureTypes.p && fromCell.figure.type === figureTypes.p) {
        const direction = this.board.directionForPawn[fromCell.figure.color];
        const availableCell = this.board.getCell(cell.y + direction, cell.x);
        if (availableCell.doubleMove && availableCell === targetCell) return true;
      }
    }
    return false;
  }

  getAttackingFigureCells(targetCell, color) {
    const cells = [];
    for (const row of this.board.cells) {
      for (const cell of row) {
        if (cell.figure && cell.figure.color !== color && this.canBeat(cell, targetCell)) {
          cells.push(cell);
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

  doTakingOnTheAisle(fromCell, targetCell) {
    const cell = this.board.getCell(fromCell.y, targetCell.x);
    this.deleteFigure(cell.figure);
    cell.figure = null;
  }

  moveFigure(fromCell, targetCell) {
    this.clearCheck(fromCell.figure.color);
    if (targetCell.rookCellForCastling) this.moveFigure(targetCell.rookCellForCastling, targetCell.cellForRookCastling);
    if (targetCell.figure) this.deleteFigure(targetCell.figure);
    if (targetCell.doubleMove && fromCell.figure.type === figureTypes.p) this.doTakingOnTheAisle(fromCell, targetCell);
    this.clearDoubleMove();
    if (fromCell.figure.type === figureTypes.p) this.checkDoubleMove(fromCell, targetCell);
    fromCell.figure.isFirstStep = false;
    targetCell.figure = fromCell.figure;
    fromCell.figure = null;
    if (targetCell.figure.type === figureTypes.p && this.isFinalHorizontal(targetCell)) this.finalHorizontalCell = targetCell;
    this.checkKing(targetCell.figure.color);
    this.checkStalemate(targetCell.figure.color);
    this.checkDraw();
  }

  canBeat(fromCell, targetCell) {
    const deltaX = Math.abs(targetCell.x - fromCell.x);
    const deltaY = Math.abs(targetCell.y - fromCell.y);
    if (fromCell.figure.type === figureTypes.p) {
      const direction = this.board.directionForPawn[fromCell.figure.color];
      const beatMove = figureMoves[fromCell.figure.type].beatMove(fromCell, targetCell, direction, deltaX);
      if (beatMove) return true;
    } else {
      for (const direction of figureMoves[fromCell.figure.type]) {
        if (direction(deltaY, deltaX)) {
          if (fromCell.figure.type === figureTypes.k || fromCell.figure.type === figureTypes.n) return true;
          const emptyVertical = this.board.isEmptyVertical(fromCell, targetCell);
          const emptyHorizontal = this.board.isEmptyHorizontal(fromCell, targetCell);
          const emptyDiagonal = this.board.isEmptyDiagonal(fromCell, targetCell);
          if (deltaX === 0 && emptyVertical) return true;
          if (deltaY === 0 && emptyHorizontal) return true;
          if (deltaY === deltaX && emptyDiagonal) return true;
        }
      }
    }
    return false;
  }

  isAvailable(fromCell, targetCell) {
    if (fromCell.figure.type === figureTypes.p) {
      const deltaX = Math.abs(targetCell.x - fromCell.x);
      const direction = this.board.directionForPawn[fromCell.figure.color];
      const aisleCell = this.board.aisleCellForPawn[fromCell.figure.color];
      const pawnDefaultMove = figureMoves[fromCell.figure.type].move(fromCell, targetCell, direction, deltaX);
      const pawnDoubleMove = figureMoves[fromCell.figure.type].doubleMove(fromCell, targetCell, direction, deltaX);
      const pawnBeatMove = this.canBeat(fromCell, targetCell);
      const emptyTargetCell = this.board.isEmpty(targetCell);
      const enemyCell = this.board.isEnemy(fromCell, targetCell);

      if ((pawnDefaultMove || (pawnDoubleMove && this.board.isEmpty(this.board.getCell(targetCell.y - direction, targetCell.x)))) && emptyTargetCell) return true;
      if (pawnBeatMove && enemyCell) return true;
      if (targetCell.doubleMove && fromCell.y === aisleCell) return true;
    } else if (fromCell.figure.type === figureTypes.k) {
      if (this.canBeat(fromCell, targetCell) && !this.isUnderAttack(targetCell, fromCell.figure.color)) return true;
      if (this.canDoCastling(fromCell, targetCell) && !this.isMyKingChecked(fromCell.figure.color)) return true;
    } else {
      if (this.canBeat(fromCell, targetCell)) return true;
    }
    return false;
  }

  canDoCastling(fromCell, targetCell) {
    if (fromCell.y !== targetCell.y || Math.abs(fromCell.x - targetCell.x) !== 2) return false;
    if (!fromCell.figure.isFirstStep) return false;
    const cells = this.getCellsForCastling(targetCell, fromCell.figure.color);
    const lastFigure = cells[cells.length - 1].figure;
    if (!lastFigure) return false;
    if (lastFigure.type !== figureTypes.r) return false;
    if (!lastFigure.isFirstStep) return false;
    for (let i = 0; i < cells.length - 1; i++) {
      if (cells[i].figure) return false;
      if (this.isUnderAttack(cells[i], fromCell.figure.color)) return false;
    }
    targetCell.rookCellForCastling = cells[cells.length - 1];
    targetCell.cellForRookCastling = cells[0];
    return true;
  }

  canMove(fromCell, targetCell) {
    if (fromCell.figure.color === targetCell.figure?.color) return false;
    if (targetCell.figure?.type === figureTypes.k) return false;
    const available = this.isAvailable(fromCell, targetCell);
    if (!available) return false;
    if (fromCell.figure.type === figureTypes.k) return true;
    const kingChecked = this.isMyKingChecked(fromCell.figure.color);
    const kingWillBeChecked = this.isKingWillBeChecked(fromCell, targetCell, fromCell.figure.color);
    if (kingWillBeChecked) return false;
    return !kingChecked || (kingChecked && this.canProtectKing(fromCell, targetCell, fromCell.figure.color));
  }
}