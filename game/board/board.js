import { colors } from "/game?=resources/colors.js";
import Cell from "/game?=board/cell.js";
import Pawn from "/game?=figures/pawn.js";
import Queen from "/game?=figures/queen.js";
import King from "/game?=figures/king.js";
import Bishop from "/game?=figures/bishop.js";
import Knight from "/game?=figures/knight.js";
import Rook from "/game?=figures/rook.js";
import { figureNames } from "/game?=figures/figure.js";

export default class Board {
  static cells = [];
  static selected = null;
  static figures = [];
  static kings = [];

  static createBoard() {
    for (let i = 0; i < 8; i++) {
      const row = [];

      for (let j = 0; j < 8; j++) {
        if ((i + j) % 2 === 0) {
          row.push(new Cell(i, j, colors.WHITE));
        } else {
          row.push(new Cell(i, j, colors.BLACK));
        }
      }
      this.cells.push(row);
    }
  }

  static drawBoard(board) {
    board.innerHTML = '';
    for (const row of this.cells) {
      const rowHTML = document.createElement('div');
      rowHTML.classList.add('row');
      for (const cell of row) {
        const cellHTML = this.createCellHtml(cell, board);
        rowHTML.append(cellHTML);
      }
      board.append(rowHTML);
    }
  }

  static createCellHtml(cell, board) {
    const cellHTML = document.createElement('div');
    cellHTML.className = `col ${cell.color}`;
    if (cell.available) {
      const available = document.createElement('div');
      if (!cell.figure) {
        available.classList.add('available');
      } else {
        cellHTML.classList.add('availableFigure');
      }
      cellHTML.append(available);
    }
    if (cell.figure) {
      const img = document.createElement('img');
      img.classList.add('figure');
      img.src = cell.figure.img;
      cellHTML.append(img);
    }
    if (this.selected === cell) {
      cellHTML.classList.add('selected');
    }
    if (cell.check) {
      cellHTML.classList.add('check');
    }
    cellHTML.addEventListener('click', () => {
      if (this.selected && this.selected !== cell && this.selected.figure.canMove(cell)) {
        this.selected.moveFigure(cell);
        this.selected = null;
        this.clearAvailable();
        this.drawBoard(board);
      } else if (cell.figure) {
        this.selected = cell;
        this.highlightCells(cell);
        this.drawBoard(board);
      }
    });
    return cellHTML;
  }

  static highlightCells(selectedCell) {
    for (const row of this.cells) {
      for (const cell of row) {
        cell.available = selectedCell.figure.canMove(cell);
      }
    }
  }

  static clearAvailable() {
    for (const row of this.cells) {
      for (const cell of row) {
        cell.available = false;
      }
    }
  }

  static getCell(y, x) {
    return this.cells[y][x];
  }

  static getAttackedCells(color) {
    const cells = [];
    const king = this.getMyKing(color);

    if (king.cell.checkedBy.length > 1) {
      return [];
    }

    const minX = Math.min(king.cell.x, king.cell.checkedBy[0].x);
    const maxX = Math.max(king.cell.x, king.cell.checkedBy[0].x);
    const minY = Math.min(king.cell.y, king.cell.checkedBy[0].y);
    const maxY = Math.max(king.cell.y, king.cell.checkedBy[0].y);

    if (king.cell.x === king.cell.checkedBy[0].x) {
      for (let i = minY; i <= maxY; i++) {
        cells.push(this.getCell(i, king.cell.x));
      }
    } else if (king.cell.y === king.cell.checkedBy[0].y) {
      for (let i = minX; i <= maxX; i++) {
        cells.push(this.getCell(king.cell.y, i));
      }
    } else if (king.cell.checkedBy[0].figure.name === figureNames.KNIGHT) {
      cells.push(king.cell.checkedBy[0]);
    } else {
      const dx = king.cell.x < king.cell.checkedBy[0].x ? 1 : -1;
      const dy = king.cell.y < king.cell.checkedBy[0].y ? 1 : -1;
      const abs = Math.abs(king.cell.y - king.cell.checkedBy[0].y);

      for (let i = 1; i <= abs; i++) {
        cells.push(this.getCell(king.cell.y + i * dy, king.cell.x + i * dx));
      }
    }
    return cells;
  }

  static getFutureAttackedCells(attackedCell, attackingCell) {
    const cells = [];
    const dy = attackingCell.y > attackedCell.y ? -1 : 1;
    const dx = attackingCell.x > attackedCell.x ? -1 : 1;

    if (attackedCell.x === attackingCell.x) {
      let y = attackingCell.y;
      while (y >= 0 && y <= 7) {
        const cell = this.getCell(y, attackingCell.x);
        if (!cell) break;
        cells.push(cell);
        if (cell.figure?.name === figureNames.KING) break;
        y += dy;
      }
    } else if (attackedCell.y === attackingCell.y) {
      let x = attackingCell.x;
      while (x >= 0 && x <= 7) {
        const cell = this.getCell(attackingCell.y, x);
        if (!cell) break;
        cells.push(cell);
        if (cell.figure?.name === figureNames.KING) break;
        x += dx;
      }
    } else {
      let y = attackingCell.y;
      let x = attackingCell.x;
      while (y >= 0 && y <= 7) {
        const cell = this.getCell(y, x);
        if (!cell) break;
        cells.push(cell);
        if (cell.figure?.name === figureNames.KING) break;
        y += dy;
        x += dx;
      }
    }
    return cells;
  }

  static getMyKing(color) {
    for (const king of this.kings) {
      if (king.color === color) return king;
    }
  }

  static getEnemyKing(color) {
    if (color === colors.WHITE) {
      return this.getMyKing(colors.BLACK)
    }
    return color === colors.WHITE ? this.getMyKing(colors.BLACK) : this.getMyKing(colors.WHITE);
  }

  static addPawns(firstColor, secondColor) {
    for (let i = 0; i < 8; i++) {
      new Pawn(secondColor, this.getCell(1, i), 1);
      new Pawn(firstColor, this.getCell(6, i), -1);
    }
  }

  static addQueens(firstColor, secondColor) {
    new Queen(secondColor, this.getCell(0, firstColor === colors.WHITE ? 3 : 4));
    new Queen(firstColor, this.getCell(7, firstColor === colors.WHITE ? 3 : 4));
  }

  static addKing(firstColor, secondColor) {
    new King(secondColor, this.getCell(0, firstColor === colors.WHITE ? 4 : 3));
    new King(firstColor, this.getCell(7, firstColor === colors.WHITE ? 4 : 3));
  }

  static addBishop(firstColor, secondColor) {
    new Bishop(secondColor, this.getCell(0, 2));
    new Bishop(secondColor, this.getCell(0, 5));
    new Bishop(firstColor, this.getCell(7, 2));
    new Bishop(firstColor, this.getCell(7, 5));
  }

  static addKnight(firstColor, secondColor) {
    new Knight(secondColor, this.getCell(0, 1));
    new Knight(secondColor, this.getCell(0, 6));
    new Knight(firstColor, this.getCell(7, 1));
    new Knight(firstColor, this.getCell(7, 6));
  }

  static addRook(firstColor, secondColor) {
    new Rook(secondColor, this.getCell(0, 0));
    new Rook(secondColor, this.getCell(0, 7));
    new Rook(firstColor, this.getCell(7, 0));
    new Rook(firstColor, this.getCell(7, 7));
  }

  static addFigure(firstColor, secondColor) {
    this.addPawns(firstColor, secondColor);
    this.addQueens(firstColor, secondColor);
    this.addKing(firstColor, secondColor);
    this.addBishop(firstColor, secondColor);
    this.addKnight(firstColor, secondColor);
    this.addRook(firstColor, secondColor);
  }
}