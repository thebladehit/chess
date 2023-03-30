export default class Cell {
  constructor(y, x, color) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.figure = null;
    this.available = false;
  }

   moveFigure(selectedCell) {
    if (this.figure?.canMove(selectedCell)) {
      selectedCell.figure = this.figure;
      this.figure = null;
    }
  }
}