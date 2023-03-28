import { colors } from "/game?=resources/colors.js";
import Cell from "/game?=board/cell.js";
import Pawn from "/game?=figures/pawn.js";
import Queen from "/game?=figures/queen.js";
import King from "/game?=figures/king.js";
import Bishop from "/game?=figures/bishop.js";
import Knight from "/game?=figures/knight.js";
import Rook from "/game?=figures/rook.js";

export default class Board {
  static cells = [];

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
    for (const row of this.cells) {
      const rowHTML = document.createElement('div');
      rowHTML.classList.add('row');

      for (const cell of row) {
        const cellHTML = document.createElement('div');
        cellHTML.className = `col ${cell.color}`;
        if (cell.figure) {
          const img = document.createElement('img');
          img.classList.add('figure');
          img.src = cell.figure.img;
          cellHTML.append(img);
        }
        rowHTML.append(cellHTML);
      }

      board.append(rowHTML);
    }
  }

  static getCell(y, x) {
    return this.cells[y][x];
  }

  static addPawns(firstColor, secondColor) {
    for (let i = 0; i < 8; i++) {
      new Pawn(secondColor, this.getCell(1, i));
      new Pawn(firstColor, this.getCell(6, i));
    }
  }

  static addQueens(firstColor, secondColor) {
    new Queen(secondColor, this.getCell(0, 4));
    new Queen(firstColor, this.getCell(7, 4));
  }

  static addKing(firstColor, secondColor) {
    new King(secondColor, this.getCell(0, 3));
    new King(firstColor, this.getCell(7, 3));
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