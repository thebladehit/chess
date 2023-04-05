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

  canProtectKing(selectedCell) {
    const cells = [];
    const king = Board.getMyKing(this.color);

    if (king.cell.checkedBy.length > 1) {
      return false;
    }

    const minX = Math.min(king.cell.x, king.cell.checkedBy[0].x);
    const maxX = Math.max(king.cell.x, king.cell.checkedBy[0].x);

    const minY = Math.min(king.cell.y, king.cell.checkedBy[0].y);
    const maxY = Math.max(king.cell.y, king.cell.checkedBy[0].y);

    if (king.cell.x === king.cell.checkedBy[0].x) {
      for (let i = minY; i <= maxY; i++) {
        const cell = Board.getCell(i, king.cell.x);
        if (cell.name !== figureNames.KING) {
          cells.push(cell);
        }
      }
    } else if (king.cell.y === king.cell.checkedBy[0].y) {
      for (let i = minX; i <= maxX; i++) {
        const cell = Board.getCell(i, king.cell.x);
        if (cell.name !== figureNames.KING) {
          cells.push(cell);
        }
      }
    } else if (king.cell.checkedBy[0].figure.name === figureNames.KNIGHT) {
      cells.push(king.checkedBy[0]);
    } else {
      for (let i = 0; i <= maxY - minY; i++) {
        const cell = Board.getCell(minY + i, minX + i);
        if (cell.name !== figureNames.KING) {
          cells.push(cell);
        }
      }
    }

    for (const cell of cells) {
      if (selectedCell === cell) {
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