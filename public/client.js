const token = localStorage.getItem('CHESS_TOKEN');
let game = null;

(async ()=> {
  if (!token) {
    redirect('/enterPage');
  } else {
    if (await autoEnter()) {
      const socket = new WebSocket('ws://localhost:3000');
      socket.addEventListener('open', () => {
        socket.send(JSON.stringify({ event: 'authorization', token }));
      });
      socket.addEventListener('message', (message) => {
        message = JSON.parse(message.data);
        console.log(message);
        if (message.event === 'gamesList' && !game) {
          createTrForTable(message.data, socket);
        } else if (message.event === 'gameCreated' || message.event === 'gameCurrent') {
          game = message.data;
          console.log(message.game);
          waitingForPlayer();
        } else if (message.event === 'gameJoined') {
          game = message.data;
          startChess(socket);
        }
      });

    } else {
      redirect('/enterPage');
    }
  }
})()

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

function createTrForTable(games, socket) {
  const userZone = document.querySelector('.userZone');
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

function createGame(socket) {
  socket.send(JSON.stringify({ event: 'gameCreate' }));
  console.log('send game create'); // console
}

function waitingForPlayer() {
  const userZone = document.querySelector('.userZone');
  userZone.innerHTML = `<div class="alert">Waiting for player...</div>`;
}
function startChess(socket) {
  const userZone = document.querySelector('.userZone');
  userZone.innerHTML = 'Game here';
  const btn = document.createElement('button');
  btn.textContent = 'Click';
  btn.addEventListener('click', () => {
    socket.send(JSON.stringify({ event: 'sendMove' }));
  })
  userZone.append(btn);
}