import Figure, { figureNames } from "/game?=figures/figure.js";
import { colors } from "/game?=resources/colors.js";

const whiteImg = '/game?=resources/img/whiteRook.png';
const blackImg = '/game?=resources/img/blackRook.png';

export default class Rook extends Figure {
  constructor(color, cell) {
    super(color, cell);
    this.img = color === colors.WHITE ? whiteImg : blackImg;
    this.name = figureNames.ROOK;
  }
}