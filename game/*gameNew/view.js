export default class View {
  constructor(element, game) {
    this.element = element;
    this.game = game;
    this.selected = null;
  }

  drawBoard() {
    this.element.innerHTML = '';
    for (const row of this.game.board.cells) {
      const rowHTML = document.createElement('div');
      rowHTML.classList.add('row');
      for (const cell of row) {
        const cellHTML = this.createCellHtml(cell);
        rowHTML.append(cellHTML);
      }
      this.element.append(rowHTML);
    }
  }

  createCellHtml(cell) {
    const cellHTML = document.createElement('div');
    cellHTML.className = `col ${cell.color}`;
    if (cell.figure) {
      cellHTML.append(this.createFigureImg(cell));
    }
    if (cell.available) {
      if (cell.figure) {
        cellHTML.classList.add('availableFigure');
      } else {
        const available = document.createElement('div');
        available.classList.add('available');
        cellHTML.append(available);
      }
    }
    if (this.selected === cell) {
      cellHTML.classList.add('selected');
    }
    cellHTML.addEventListener('click', () => {
      if (this.selected && this.selected !== cell && cell.available) {
        this.game.moveFigure(this.selected, cell);
        this.selected = null;
        this.game.clearAvailableCells();
        this.drawBoard();
      } else if (cell.figure) {
        this.selected = cell;
        this.game.checkAvailableCells(cell);
        this.drawBoard()
      }
    });
    return cellHTML;
  }

  createFigureImg(cell) {
    const img = document.createElement('img');
    img.classList.add('figure');
    img.src = cell.figure.img;
    return img;
  }
}