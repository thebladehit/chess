import figureTypes from "/getFile?=game/resources/figureTypes.js";
import Figure, { figuresImg } from "/getFile?=game/figures/figure.js";
import { colors } from "/getFile?=game/resources/colors.js";
import { defaultChessPosition } from "/getFile?=game/resources/position.js";

const figuresForList = {
  queen: {
    white: figuresImg[figureTypes.q]['white'],
    black: figuresImg[figureTypes.q]['black']
  },
  rook: {
    white: figuresImg[figureTypes.r]['white'],
    black: figuresImg[figureTypes.r]['black']
  },
  knight: {
    white: figuresImg[figureTypes.n]['white'],
    black: figuresImg[figureTypes.n]['black']
  },
  bishop: {
    white: figuresImg[figureTypes.b]['white'],
    black: figuresImg[figureTypes.b]['black']
  }
};

export default class View {
  constructor(element, game) {
    this.element = element;
    this.game = game;
    this.selected = null;
    this.reversed = false;
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
    if (cell.figure) cellHTML.append(this.createFigureImg(cell));
    if (cell.available) {
      if (cell.figure) cellHTML.classList.add('availableFigure');
      else {
        const available = document.createElement('div');
        available.classList.add('available');
        cellHTML.append(available);
      }
    }
    if (this.selected === cell) cellHTML.classList.add('selected');
    if (cell.checked) cellHTML.classList.add('check');
    if (!this.movable) return cellHTML;
    cellHTML.addEventListener('click', () => {
      if (this.selected && this.selected !== cell && cell.available) {
        this.game.moveFigure(this.selected, cell);
        this.selected = null;
        this.game.clearAvailableCells();
        this.drawBoard();
        this.checkPawnTurn();
        this.checkMate();
        this.checkDraw();
        this.checkStalemate();
        this.game.changePlayer();
        this.socket.send(JSON.stringify({ event: 'moveFigure', position: this.game.board.convertPositionToString(this.forColor) }))
      } else if (cell.figure?.color === this.game.movePlayer && cell.figure) {
        this.selected = cell;
        this.game.clearRookForCastling();
        this.game.checkAvailableCells(cell);
        this.drawBoard();
      }
    });
    return cellHTML;
  }

  createFigureImg(cell, src) {
    const img = document.createElement('img');
    img.classList.add('figure');
    img.src = src ? src :cell.figure.img;
    return img;
  }

  createFigureListHtml(cell) {
    const list = document.createElement('div');
    list.classList.add('listFigure');
    for (const [ type, figureImg ] of Object.entries(figuresForList)) {
      const div = document.createElement('div');
      const img = this.createFigureImg(null, cell.figure.color === colors.WHITE ? figureImg.white : figureImg.black);
      div.append(img);
      div.addEventListener('click', () => {
        const createdFigure = new Figure(cell.figure.color, type);
        this.game.board.figures.push(createdFigure);
        this.game.deleteFigure(cell.figure);
        cell.figure = createdFigure;
        this.game.checkKing(createdFigure.color);
        this.game.checkStalemate(createdFigure.color);
        this.game.checkDraw();
        this.drawBoard();
        this.checkMate();
        this.checkDraw();
        this.checkStalemate();
        list.remove();
      });
      list.append(div);
    }
    return list;
  }

  createContextBackground() {
    const div = document.createElement('div');
    div.classList.add('contextBackground');
    return div;
  }

  createRestartButton() {
    const button = document.createElement('button');
    button.classList.add('buttonRestart');
    button.textContent = 'RESTART';
    button.addEventListener('click', () => {
      this.restartGame();
    });
    return button;
  }

  createPanelForRestart(text, style) {
    const div = this.createContextBackground();
    const p = document.createElement('p');
    const button = this.createRestartButton();
    p.textContent = `${text}`;
    if (style) p.style.color = `${this.game.checkMateColor}`;
    div.append(p);
    div.append(button);
    return div;
  }

  addFigureList() {
    const div = this.createContextBackground();
    const list = this.createFigureListHtml(this.game.finalHorizontalCell);
    div.append(list);
    this.element.prepend(div);
  }

  restartGame() {
    this.reversed = false;
    this.game.setDefaultSettings();
    this.game.board.clearBoard();
    this.game.board.addFigure(defaultChessPosition, colors.WHITE, colors.BLACK);
    this.drawBoard();
  }

  checkPawnTurn() {
    if (this.game.finalHorizontalCell) {
      this.addFigureList();
      this.game.finalHorizontalCell = null;
    }
  }

  checkMate() {
    if (this.game.checkMateColor) {
      this.element.prepend(this.createPanelForRestart(`${this.game.checkMateColor.toUpperCase()} WIN!`, true));
    }
  }

  checkDraw() {
    if (this.game.draw) {
      this.element.prepend(this.createPanelForRestart('DRAW'));
    }
  }

  checkStalemate() {
    if (this.game.stalemate) {
      this.element.prepend(this.createPanelForRestart('STALEMATE'));
    }
  }
}