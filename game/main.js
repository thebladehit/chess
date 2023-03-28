import Board from '/game?=board/board.js';

const board = document.querySelector('.board');

Board.createBoard(); // create cells
Board.addFigure();
Board.drawBoard(board); // draw cells
