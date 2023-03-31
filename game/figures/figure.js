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
  }

  canMove(selectedCell) {
    if (selectedCell.figure?.color === this.color) return false;
    if (selectedCell.figure?.name === figureNames.KING) return false;
    return true;
  }
}