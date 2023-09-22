import Board from '/getFile?=game/board/board.js';
import View from "/getFile?=game/viewTwoPlayer.js";
import Game from "/getFile?=game/game.js";
import { defaultChessPosition } from "/getFile?=game/resources/position.js";

const token = localStorage.getItem('CHESS_TOKEN');
let game = null;
let boardHtml;
let view;

const messageEvents = {
  gamesList: (message, socket) => {
    if (game) return;
    createTrForTable(message.data, socket);
  },
  gameJoined: (message, socket) => {
    game = message.data;
    startChess(message, socket);
  },
  gameCreated: (message, socket) => {
    game = message.data;
    console.log(message.data);
    waitingForPlayer();
  },
  gameCurrent: (message, socket) => {
    game = message.data;
    console.log(message.data);
    waitingForPlayer();
  },
  movedFigure: (message, socket) => {
    movedPlayer(message);
  }
};

async function autoEnter() {
  const response = await fetch(`/autoEnter`, {
    method: 'GET',
    headers: {
      'CHESS_TOKEN': token
    }
  });
  const data = await response.json();
  return data.res;
}

function redirect(url) {
  location.href = url;
}

(async ()=> {
  if (!token) return redirect('/enterPage');
    if (!await autoEnter()) return redirect('/enterPage');
    const socket = new WebSocket('ws://localhost:3000');
    socket.addEventListener('open', () => {
      socket.send(JSON.stringify({ event: 'authorization', token }));
    });
    socket.addEventListener('message', message => messageListener(message, socket));
})()

function messageListener(message, socket) {
  message = JSON.parse(message.data);

  for (const [eventName, event] of Object.entries(messageEvents)) {
    if (eventName === message.event) {
      event(message, socket);
    }
  }
}

function createGame(socket) {
  socket.send(JSON.stringify({ event: 'gameCreate' }));
}

function waitingForPlayer() {
  const userZone = document.querySelector('.table');
  userZone.innerHTML = `<div class="alert">Waiting for player...</div>`;
}

function startChess(message, socket) { // here must draw chess field
  console.log(message);
  document.querySelector('h1').remove();
  document.querySelector('.table').remove();
  const board = new Board(defaultChessPosition.cellNumberHorizontal, defaultChessPosition.cellNumberVertical);
  board.addFigure(defaultChessPosition, message.hoster ? message.data.u1Color : message.data.u2Color, message.hoster ? message.data.u2Color : message.data.u1Color);
  
  boardHtml = document.querySelector('.userZone');
  const game = new Game(board);
  view = new View(boardHtml, game);
  const movable = message.hoster && message.data.movePlayer === message.data.u1Color || !message.hoster && message.data.movePlayer === message.data.u2Color ? true : false;
  view.movable = movable;
  view.socket = socket;
  view.forColor = message.hoster ? message.data.u1Color : message.data.u2Color;
  view.drawBoard();
}

function movedPlayer(message) {
  console.log(message);
  view.game.board.clearBoard();
  view.game.board.addFigure(message.position, message.hoster ? message.data.u1Color : message.data.u2Color, message.hoster ? message.data.u2Color : message.data.u1Color);
  const movable = message.hoster && message.data.movePlayer === message.data.u1Color || !message.hoster && message.data.movePlayer === message.data.u2Color ? true : false;
  view.movable = movable;
  view.game.movePlayer = message.data.movePlayer;
  view.drawBoard();
}

function createTrForTable(games, socket) {
  const userZone = document.querySelector('.table');
  userZone.innerHTML = `
    <div class="alert">
        Please, join to room or create new
    </div>
    <table id="table">
        <tr>
            <th>Id</th>
            <th>Hoster</th>
            <th>Actions</th>
        </tr>
    </table>`;

  const btn = document.createElement('button');
  btn.id = 'create';
  btn.textContent = 'Create room';
  btn.addEventListener('click', () => {
    createGame(socket);
  });
  userZone.append(btn);

  const table = document.querySelector('#table');
  for (const game of games) {
    const tr = document.createElement('tr');
    for (const value of Object.values(game)) {
      const td = document.createElement('td');
      td.textContent = value;
      tr.append(td);
    }
    const btn = document.createElement('button');
    btn.textContent = 'Join';
    btn.addEventListener('click', () => {
      socket.send(JSON.stringify({ event: 'gameJoin', data: game.id }));
    })
    tr.lastChild.appendChild(btn);
    table.append(tr);
  }
}