import Board from '/game?=board/board.js';
import { colors } from "/game?=resources/colors.js";

const board = document.querySelector('.board');

Board.createBoard(); // create cells
Board.addFigure(colors.WHITE, colors.BLACK);
Board.drawBoard(board); // draw cells
