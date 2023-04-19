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
  constructor(color, type) {
    this.color = color;
    this.img = null;
    this.name = figureNames.FIGURE;
    this.type = type;
  }
}