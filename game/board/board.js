import { colors } from "/game?=resources/colors.js";
import Cell from "/game?=board/cell.js";
import Pawn from "/game?=figures/pawn.js";
import Queen, { whiteImg as whiteQueen, blackImg as blackQueen } from "/game?=figures/queen.js";
import King from "/game?=figures/king.js";
import Bishop, { whiteImg as whiteBishop, blackImg as blackBishop } from "/game?=figures/bishop.js";
import Knight, { whiteImg as whiteKnight, blackImg as blackKnight } from "/game?=figures/knight.js";
import Rook, { whiteImg as whiteRook, blackImg as blackRook } from "/game?=figures/rook.js";
import { figureNames } from "/game?=figures/figure.js";

const figuresForList = {
  queen: { whiteFigure: whiteQueen, blackFigure: blackQueen, createFigure: (color, cell) => new Queen(color, cell) },
  rook: { whiteFigure: whiteRook, blackFigure: blackRook, createFigure: (color, cell) => new Rook(color, cell) },
  bishop: { whiteFigure: whiteBishop, blackFigure: blackBishop, createFigure: (color, cell) => new Bishop(color, cell) },
  knight: { whiteFigure: whiteKnight, blackFigure: blackKnight, createFigure: (color, cell) => new Knight(color, cell) }
};

export default class Board {
  static cells = [];
  static selected = null;
  static figures = [];
  static kings = [];
  static board = document.querySelector('.board');

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

  static drawBoard() {
    this.board.innerHTML = '';
    for (const row of this.cells) {
      const rowHTML = document.createElement('div');
      rowHTML.classList.add('row');
      for (const cell of row) {
        const cellHTML = this.createCellHtml(cell);
        rowHTML.append(cellHTML);
      }
      this.board.append(rowHTML);
    }
  }

  static drawFigureList(color, cell) {
    const list = this.createFigureListHtml(color, cell);
    document.querySelector('.container').append(list);
  }

  static createCellHtml(cell) {
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
      cellHTML.append(this.createImgHtml(cell));
    }
    if (this.selected === cell) {
      cellHTML.classList.add('selected');
    }
    if (cell.check) {
      cellHTML.classList.add('check');
    }
    cellHTML.addEventListener('click', () => {
      if (this.selected && this.selected !== cell && cell.available) {
        this.selected.moveFigure(cell);
        this.selected = null;
        this.clearAvailable();
        this.drawBoard();
      } else if (cell.figure) {
        this.selected = cell;
        this.clearRookForCastling();
        this.highlightCells(cell);
        this.drawBoard();
      }
    });
    return cellHTML;
  }

  static createFigureListHtml(color, cell) {
    const list = document.createElement('div');
    list.classList.add('listFigure');
    for (const figure of Object.values(figuresForList)) {
      const div = document.createElement('div');
      const img = this.createImgHtml(null, color === colors.WHITE ? figure.whiteFigure : figure.blackFigure);
      div.append(img);
      div.addEventListener('click', () => {
        const createdFigure = figure.createFigure(color, cell);
        cell.figure = createdFigure;
        createdFigure.moveFigure()
        this.drawBoard();
        list.remove();
      });
      list.append(div);
    }
    return list;
  }

  static createImgHtml(cell, figureSrc) {
    const img = document.createElement('img');
    img.classList.add('figure');
    img.src = cell ? cell.figure.img : figureSrc;
    return img;
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

  static clearRookForCastling() {
    for (const row of this.cells) {
      for (const cell of row) {
        cell.cellForRookCastling = null;
        cell.rookForCastling = null;
      }
    }
  }

  static clearDoubleMove() {
    for (const row of this.cells) {
      for (const cell of row) {
        cell.doubleMove = false;
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

    if (king.cell.checkedBy[0].figure.name === figureNames.KNIGHT) {
      cells.push(king.cell.checkedBy[0]);
    } else if (king.cell.x === king.cell.checkedBy[0].x) {
      for (let i = minY; i <= maxY; i++) {
        cells.push(this.getCell(i, king.cell.x));
      }
    } else if (king.cell.y === king.cell.checkedBy[0].y) {
      for (let i = minX; i <= maxX; i++) {
        cells.push(this.getCell(king.cell.y, i));
      }
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
        if (!cell.isEmpty(attackingCell.figure.color) && cell !== attackedCell && cell !== attackingCell) {
          break;
        }
        cells.push(cell);
        if (cell.figure?.name === figureNames.KING) break;
        y += dy;
      }
    } else if (attackedCell.y === attackingCell.y) {
      let x = attackingCell.x;
      while (x >= 0 && x <= 7) {
        const cell = this.getCell(attackingCell.y, x);
        if (!cell) break;
        if (!cell.isEmpty(attackingCell.figure.color) && cell !== attackedCell && cell !== attackingCell) {
          break;
        }
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
        if (!cell.isEmpty(attackingCell.figure.color) && cell !== attackedCell && cell !== attackingCell) {
          break;
        }
        cells.push(cell);
        if (cell.figure?.name === figureNames.KING) break;
        y += dy;
        x += dx;
      }
    }
    return cells;
  }

  static getCellsForCastling(selectedCell, color) {
    const cells = [];
    const king = this.getMyKing(color);
    const dx = selectedCell.x > king.cell.x ? 1 : -1;
    let x = king.cell.x + dx;
    while (x >= 0 && x <= 7) {
      cells.push(this.getCell(king.cell.y, x));
      x += dx;
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
      new Pawn(secondColor, this.getCell(1, i), 1, 7, 4);
      new Pawn(firstColor, this.getCell(6, i), -1, 0, 3);
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