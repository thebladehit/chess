import Figure, { figureNames } from "/game?=figures/figure.js";
import { colors } from "/game?=resources/colors.js";

const whiteImg = '/game?=resources/img/whiteBishop.png';
const blackImg = '/game?=resources/img/blackBishop.png';

export default class Bishop extends Figure {
  constructor(color, cell) {
    super(color, cell);
    this.img = color === colors.WHITE ? whiteImg : blackImg;
    this.name = figureNames.BISHOP;
  }
}