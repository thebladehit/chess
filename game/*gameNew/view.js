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
    return cellHTML;
  }
}