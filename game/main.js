import Board from '/getFile?=game/board/board.js';
import { colors } from "/getFile?=game/resources/colors.js";
import { defaultChessPosition } from "/getFile?=game/resources/position.js";
import View from "/getFile?=game/view.js";
import Game from "/getFile?=game/game.js";

const board = new Board(defaultChessPosition.cellNumberHorizontal, defaultChessPosition.cellNumberVertical);
board.addFigure(defaultChessPosition, colors.WHITE, colors.BLACK);

const boardHtml = document.querySelector('.board');
const game = new Game(board);
const view = new View(boardHtml, game);
view.drawBoard();

console.log(board);
