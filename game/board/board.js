import { colors } from '../resources/colors.js';
import Cell from './cell.js'
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
        rowHTML.append(cellHTML);
      }

      board.append(rowHTML);
    }
  }
}