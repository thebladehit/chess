import Board from './board/board.js';

const board = document.querySelector('.board');

Board.createBoard(); // create cells
Board.drawBoard(board) // draw cells