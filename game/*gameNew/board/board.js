import Figure from "/game?=*gameNew/figures/figure.js";
import Cell from "/game?=*gameNew/board/cell.js";
import { colors } from "/game?=*gameNew/resources/colors.js";

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
        const figure = new Figure(color, splitedStartPosition[y][x]);
        this.cells[y][x].figure = figure;
        this.figures.push(figure);
      }
    }
  }
}