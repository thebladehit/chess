import { Board } from '/game?=*gameNew/board/board.js';
import { colors } from "/game?=*gameNew/resources/colors.js";
import { defaultChessPosition } from "/game?=*gameNew/resources/position.js";

const board = new Board(defaultChessPosition.cellNumberHorizontal, defaultChessPosition.cellNumberVertical);
board.addFigure(defaultChessPosition, colors.WHITE, colors.BLACK);
console.log(board);
