export default class View {
  constructor(element) {
    this.element = element;
  }

  drawBoard(cells) {
    this.element.innerHTML = '';
    for (const row of cells) {
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
    return cellHTML;
  }

  createFigureImg(cell) {
    const img = document.createElement('img');
    img.classList.add('figure');
    img.src = cell.figure.img;
    return img;
  }
}