import Figure from "/game?=*gameNew/figures/figure.js";
import Cell from "/game?=*gameNew/board/cell.js";
import { colors } from "/game?=*gameNew/resources/colors.js";
import figureTypes from "/game?=*gameNew/resources/figureTypes.js";

export default class Board {
  constructor(cellNumberHorizontal, cellNumberVertical) {
    this.figures = [];
    this.cells = this.createBoard(cellNumberHorizontal, cellNumberVertical);
  }

  createBoard(cellNumberHorizontal, cellNumberVertical) {
    const cells = [];
    for (let i = 0; i < cellNumberVertical; i++) {
      const row = [];
      for (let j = 0; j < cellNumberHorizontal; j++) {
        if ((i + j) % 2 === 0) {
          row.push(new Cell(i, j, colors.WHITE));
        } else {
          row.push(new Cell(i, j, colors.BLACK));
        }
      }
      cells.push(row);
    }
    return cells;
  }

  addFigure(position, firstColor, secondColor) {
    let color = secondColor;
    let splitedStartPosition = position.startPos.split('/');
    if (position.forColor !== firstColor) {
      splitedStartPosition = splitedStartPosition.map(row => row === 'null' ? row : row.split('').reverse().join(''));
    }
    for (let y = 0; y < position.cellNumberVertical; y++) {
      if (splitedStartPosition[y] === 'null') {
        continue;
      }
      if (this.figures.length === position.figureNumberOnePlayer) {
        color = firstColor;
      }
      for (let x = 0; x < position.cellNumberHorizontal; x++) {
        const figure = new Figure(color, figureTypes[splitedStartPosition[y][x]]);
        this.cells[y][x].figure = figure;
        this.figures.push(figure);
      }
    }
  }

  getCell(y, x) {
    return this.cells[y][x];
  }

  isEmpty(cell, color) {
    if (cell.figure?.type === figureTypes.k && cell.figure?.color !== color) {
      return true;
    }
    if (cell.figure) {
      return false;
    }
    return true;
  }

  isEmptyVertical(fromCell, targetCell) {
    // if (this === selectedCell) {
    //   return false;
    // }
    if (fromCell.x !== targetCell.x) {
      return false;
    }
    const min = Math.min(fromCell.y, targetCell.y);
    const max = Math.max(fromCell.y, targetCell.y);
    for (let i = min + 1; i < max; i++) {
      if (!this.isEmpty(this.getCell(i, fromCell.x), fromCell.figure.color)) {
        return false;
      }
    }
    return true;
  }

  isEmptyHorizontal(fromCell, targetCell) {
    // if (this === selectedCell) {
    //   return false;
    // }
    if (fromCell.y !== targetCell.y) {
      return false;
    }
    const min = Math.min(fromCell.x, targetCell.x);
    const max = Math.max(fromCell.x, targetCell.x);
    for (let i = min + 1; i < max; i++) {
      if (!this.isEmpty(this.getCell(fromCell.y, i), fromCell.figure.color)) {
        return false;
      }
    }
    return true;
  }
}