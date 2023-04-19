const figuresImg = {
  r: {
    white: '/game?=*gameNew/resources/img/whiteRook.png',
    black: '/game?=*gameNew/resources/img/blackRook.png'
  },
  n: {
    white: '/game?=*gameNew/resources/img/whiteKnight.png',
    black: '/game?=*gameNew/resources/img/blackKnight.png'
  },
  b: {
    white: '/game?=*gameNew/resources/img/whiteBishop.png',
    black: '/game?=*gameNew/resources/img/blackBishop.png'
  },
  q: {
    white: '/game?=*gameNew/resources/img/whiteQueen.png',
    black: '/game?=*gameNew/resources/img/blackQueen.png',
  },
  k: {
    white: '/game?=*gameNew/resources/img/whiteKing.png',
    black: '/game?=*gameNew/resources/img/blackKing.png',
  },
  p: {
    white: '/game?=*gameNew/resources/img/whitePawn.png',
    black: '/game?=*gameNew/resources/img/blackPawn.png',
  }
};

export default class Figure {
  constructor(color, type) {
    this.color = color;
    this.type = type;
    this.img = figuresImg[type][color];
  }
}