import Board from '/game?=board/board.js';
import { colors } from "/game?=resources/colors.js";

Board.createBoard(); // create cells
Board.addFigure(colors.WHITE, colors.BLACK);
Board.drawBoard(); // draw cells
