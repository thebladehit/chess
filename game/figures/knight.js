import Figure, { figureNames } from "/game?=figures/figure.js";
import { colors } from "/game?=resources/colors.js";

const whiteImg = '/game?=resources/img/whiteKnight.png';
const blackImg = '/game?=resources/img/blackKnight.png';

export default class Knight extends Figure {
  constructor(color, cell) {
    super(color, cell);
    this.img = color === colors.WHITE ? whiteImg : blackImg;
    this.name = figureNames.KNIGHT;
  }

  canBeat(selectedCell) {
    const dx = Math.abs(this.cell.x - selectedCell.x);
    const dy = Math.abs(this.cell.y - selectedCell.y);
    return (dx === 2 && dy === 1) || (dx === 1 && dy === 2);
  }

  canMove(selectedCell) {
    if (!super.canMove(selectedCell)) {
      return false;
    }
    if ((this.canBeat(selectedCell) && !this.isMyKingChecked() && !this.isKingWillBeChecked(selectedCell))
      || (this.isMyKingChecked() && this.canProtectKing(selectedCell) && this.canBeat(selectedCell)))
    {
      return true;
    }
    return false;
  }
}