export default class Game {
  constructor(board) {
    this.board = board;
  }

  checkAvailableCells(fromCell) {
    for (const row of this.board.cells) {
      for (const cell of row) {
        if (this.canMove(fromCell, cell)) {
          cell.available = true;
        }
      }
    }
  }

  canMove(fromCell, targetCell) {
    if (fromCell.figure.color === targetCell.figure?.color) {
      return false;
    }
    if (targetCell.figure?.type === 'k') {
      return false;
    }
    return true;
  }
}