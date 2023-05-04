export const figuresImg = {
  rook: {
    white: '/getFile?=game/resources/img/whiteRook.png',
    black: '/getFile?=game/resources/img/blackRook.png'
  },
  knight: {
    white: '/getFile?=game/resources/img/whiteKnight.png',
    black: '/getFile?=game/resources/img/blackKnight.png'
  },
  bishop: {
    white: '/getFile?=game/resources/img/whiteBishop.png',
    black: '/getFile?=game/resources/img/blackBishop.png'
  },
  queen: {
    white: '/getFile?=game/resources/img/whiteQueen.png',
    black: '/getFile?=game/resources/img/blackQueen.png',
  },
  king: {
    white: '/getFile?=game/resources/img/whiteKing.png',
    black: '/getFile?=game/resources/img/blackKing.png',
  },
  pawn: {
    white: '/getFile?=game/resources/img/whitePawn.png',
    black: '/getFile?=game/resources/img/blackPawn.png',
  }
};

export default class Figure {
  constructor(color, type) {
    this.color = color;
    this.type = type;
    this.img = figuresImg[type][color];
    this.isFirstStep = true;
  }
}