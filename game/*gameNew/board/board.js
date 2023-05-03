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
        row.push(new Cell(i, j, (i + j) % 2 === 0 ? colors.WHITE : colors.BLACK))
      }
      cells.push(row);
    }
    return cells;
  }

  addFigure(position, firstColor, secondColor) {
    this.setDirectionForPawn(firstColor);
    this.setAisleCellForPawn(firstColor);
    this.setFinalHorizontal(firstColor);
    let color = secondColor;
    let splitedStartPosition = position.startPos.split('/');
    if (position.forColor !== firstColor) {
      splitedStartPosition = splitedStartPosition
        .map(row => row === 'null' ? row : row
          .split('')
          .reverse()
          .join(''));
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

  clearBoard() {
    this.figures = [];
    for (const row of this.cells) {
      for (const cell of row) {
        cell.figure = null;
        cell.available = false;
        cell.checked = false;
        cell.rookCellForCastling = null;
        cell.cellForRookCastling = null;
      }
    }
  }

  setDirectionForPawn(firstColor) {
    const white = firstColor === colors.WHITE ? -1 : 1;
    this.directionForPawn = { white, black: -white };
  }

  setAisleCellForPawn(firstColor) {
    const white = firstColor === colors.WHITE ? 3 : 4;
    const black = firstColor === colors.BLACK ? 3 : 4;
    this.aisleCellForPawn = { white, black };
  }

  setFinalHorizontal(firstColor) {
    const white = firstColor === colors.WHITE ? 0 : 7;
    const black = firstColor === colors.BLACK ? 0 : 7;
    this.finalHorizontalForPawn = { white, black };
  }

  getMyKingCell(color) {
    for (const row of this.cells) {
      for (const cell of row) {
        if (cell.figure?.color === color && cell.figure?.type === figureTypes.k) return cell;
      }
    }
  }

  getEnemyKingCell(color) {
    return color === colors.WHITE ? this.getMyKingCell(colors.BLACK) : this.getMyKingCell(colors.WHITE);
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

  isEnemy(fromCell, targetCell) {
    if (targetCell.figure) {
      return fromCell.figure.color !== targetCell.figure.color;
    }
    return false;
  }

  isEmptyVertical(fromCell, targetCell) {
    if (fromCell === targetCell) {
      return false;
    }
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
    if (fromCell === targetCell) {
      return false;
    }
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

  isEmptyDiagonal(fromCell, targetCell) {
    if (fromCell === targetCell) {
      return false;
    }
    const absX = Math.abs(fromCell.x - targetCell.x);
    const absY = Math.abs(fromCell.y - targetCell.y);
    if (absY !== absX) {
      return false;
    }
    const dy = targetCell.y > fromCell.y ? 1 : -1;
    const dx = targetCell.x > fromCell.x ? 1 : -1;
    for (let i = 1; i < absY; i++) {
      if (!this.isEmpty(this.getCell(fromCell.y + i * dy, fromCell.x + i * dx), fromCell.figure.color)) {
        return false;
      }
    }
    return true;
  }
}