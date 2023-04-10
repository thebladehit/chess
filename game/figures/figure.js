import Board from "/game?=board/board.js";

export const figureNames = {
  FIGURE: 'figure',
  KING: 'king',
  QUEEN: 'queen',
  BISHOP: 'bishop',
  KNIGHT: 'knight',
  PAWN: 'pawn',
  ROOK: 'rook'
};

export default class Figure {
  constructor(color, cell) {
    this.color = color;
    this.img = null;
    this.cell = cell;
    this.cell.figure = this;
    this.name = figureNames.FIGURE;
    Board.figures.push(this);
  }

  moveFigure() {

  }

  clearCheck() {
    Board.getMyKing(this.color).cell.check = false;
  }

  canProtectKing(selectedCell) {
    for (const cell of Board.getAttackedCells(this.color)) {
      if (selectedCell === cell) {
        return true;
      }
      if (cell.figure?.name === figureNames.PAWN && this.name === figureNames.PAWN) {
        const availableCell = Board.getCell(cell.y + this.direction, cell.x);
        if (availableCell.doubleMove && availableCell === selectedCell) {
          return true;
        }
      }
    }
    return false;
  }

  isKingWillBeChecked(selectedCell) {
    const attackingFigures = this.cell.getAttackingFigures(this.cell);
    for (const attackingFigure of attackingFigures) {
      if (attackingFigure.figure.name === figureNames.KNIGHT || attackingFigure.figure.name === figureNames.PAWN || attackingFigure.figure.name === figureNames.KING) {
        continue;
      }
      const attackedCells = Board.getFutureAttackedCells(this.cell, attackingFigure);
      if (this.isHereKing(attackedCells)) {
        for (const cell of attackedCells) {
          if (cell === selectedCell) {
            return false;
          }
        }
        return true;
      }
    }
    return false;
  }

  isHereKing(cells) {
    for (const cell of cells) {
      if (cell.figure?.name === figureNames.KING) {
        return true;
      }
    }
    return false;
  }

  checkKing() {
    const enemyKing = Board.getEnemyKing(this.color);
    const attackingFigures = enemyKing.cell.getAttackingFigures(enemyKing.cell);
    if (attackingFigures.length !== 0) {
      enemyKing.cell.check = true;
      enemyKing.cell.checkedBy = attackingFigures;
      this.checkMate();
    }
  }

  checkMate() {
    const availableCells = [];
    for (const figure of Board.figures) {
      if (figure.color !== this.color) {
        for (const row of Board.cells) {
          for (const cell of row) {
            if (figure.canMove(cell)) {
              availableCells.push(cell);
            }
          }
        }
      }
    }
    if (availableCells.length === 0) {
      console.log(`${this.color} win`);
    }
  }

  isMyKingChecked() {
    const king = Board.getMyKing(this.color);
    if (king.cell.isUnderAttack(king.cell)) {
      return true;
    }
    return false;
  }

  deleteFigure() {
    const inx = Board.figures.indexOf(this);
    Board.figures.splice(inx, 1);
  }

  canMove(selectedCell) {
    if (selectedCell.figure?.color === this.color) {
      return false;
    }
    if (selectedCell.figure?.name === figureNames.KING) {
      return false;
    }
    return true;
  }
}