export default class Figure {
  constructor(color, cell) {
    this.color = color;
    this.img = null;
    this.cell = cell;
    this.cell.figure = this;
  }

  canMove(selectedCell) {
    return true;
  }
}