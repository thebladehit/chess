import Board from '/game?=*gameNew/board/board.js';
import { colors } from "/game?=*gameNew/resources/colors.js";
import { defaultChessPosition } from "/game?=*gameNew/resources/position.js";
import View from "/game?=*gameNew/view.js";
import Game from "/game?=*gameNew/game.js";

const board = new Board(defaultChessPosition.cellNumberHorizontal, defaultChessPosition.cellNumberVertical);
board.addFigure(defaultChessPosition, colors.BLACK, colors.WHITE);

const boardHtml = document.querySelector('.board');
const game = new Game(board);
const view = new View(boardHtml, game);
view.drawBoard();

console.log(board);
