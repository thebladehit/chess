export default class View {
  constructor(element, game) {
    this.element = element;
    this.game = game;
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
      const available = document.createElement('div');
      if (cell.figure) {
        cellHTML.classList.add('availableFigure');
      } else {
        available.classList.add('available');
      }
      cellHTML.append(available);
    }
    cellHTML.addEventListener('click', () => {
      if (cell.figure) {
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